import batchPackages from "@lerna/batch-packages"
import filterPackages from "@lerna/filter-packages"
import { getPackages } from "@lerna/project"
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import path from 'path'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'
import analyze from 'rollup-plugin-analyzer'
import ts from 'rollup-plugin-ts'

/**
 * 获得排序后的 packages
 * https://github.com/lerna/lerna/issues/1848#issuecomment-451762317
 */
async function getSortedPackages(scope, ignore) {
  const packages = await getPackages(__dirname)
  const filtered = filterPackages(packages, scope, ignore, false)
  return batchPackages(filtered).reduce((arr, batch) => arr.concat(batch), [])
}

const minify = (name) => {
  return name.replace(/\.(m)?js$/, '.min.$1js');
}

const getPlugins = ({ __PROD__ }) => {
  const res = [
    sourcemaps(),
    resolve({
        browser: true,
        preferBuiltins: false,
    }),
    commonjs(),
    json(),
    analyze({
      summaryOnly: true,
    }),
    ts({
      hook: {
        outputPath: (prevPath, kind) => {
          // 重定向 d.ts
          if (kind === 'declaration') {
            // 此时 path 是这样的路径
            // `/Users/.../glui/packages/renderer/dist/esm/index.d.ts`
            // 我们将最终文件移动到 dist 目录，变成
            // `/Users/.../glui/packages/renderer/dist/esm/index.d.ts`
            const info = path.parse(prevPath)

            // 移除 min.d.ts 中 `min` 部分
            const base = info.base.replace(/\.min\.d\.ts/, '.d.ts')

            // 将输出目录移动到 dist/
            const dir = path.resolve(info.dir, '../types')
            const nextPath = path.resolve(dir, base)
            return nextPath
          }
        }
      }
    }),
    string({
        include: [
            '**/*.frag',
            '**/*.vert',
        ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(__PROD__ ? 'production' : 'development')
    }),
  ]
  
  if (__PROD__) {
    res.push(
      terser({
        output: {
            comments: (node, comment) => comment.line === 1,
        },
      })
    )
  }
  return res
}

const main = async () => {
  const packages = await getSortedPackages()
  return packages
    .filter(pkg => !!pkg.get('main'))
    .map(pkg => {
      return [false, true].map(__PROD__ => {
        const external = Object.keys(pkg.dependencies || [])
        const globals = external.reduce((acc, dep) => {
          acc[dep] = dep
          return acc
        }, {})
        const basePath = path.relative(__dirname, pkg.location)
        const input = path.join(basePath, 'src/index.ts')
        const output = {
          name: pkg.name,
          sourcemap: true,
          file: path.join(basePath, pkg.get('main')),
          format: 'umd',
          globals,
        }

        if (__PROD__) {
          output.file = minify(output.file)
        }

        return {
          input,
          output,
          external,
          plugins: getPlugins({ __PROD__ }),
        }
      })
    })
    .flat()
}

export default main()
