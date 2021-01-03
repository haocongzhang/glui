import { AbstractRenderer } from '@pixi/core'
import { Container } from '@pixi/display'
import { Ticker, UPDATE_PRIORITY } from '@pixi/ticker'
import { createContext, ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { render, unmountComponentAtNode } from './renderer'

export type CanvasState = {
  left: number
  top: number
  width: number
  height: number
  gl: AbstractRenderer
  stage: Container
}

export const CanvasStateContext = createContext({} as CanvasState) // TODO makealwaysthrowobject

export const useCanvasState = () => {
  return useContext(CanvasStateContext)
}

export type UseCanvasOptions = {
  gl: AbstractRenderer
  left: number
  top: number
  width: number
  height: number
  children: ReactNode
  onReady?: () => void
}
export const useCanvas = ({
  gl,
  left,
  top,
  width,
  height,
  children,
  onReady,
}: UseCanvasOptions) => {

  const [{
    stage,
    defaultContainer,
    ticker,
  }] = useState(() => {
    const res = {
      // 根节点，相当于 `document.body`
      stage: new Container(),

      // 默认容器，相当于 `document.body.querySelector('#root')`
      defaultContainer: new Container(),

      ticker: Ticker.shared,
    }
    res.stage.addChild(res.defaultContainer)
    return res
  })

  const state: CanvasState = useMemo(() => {
    console.group('CanvasState changed')
    const nextState = {
      gl,
      stage,
      ticker,
      left,
      top,
      width,
      height,
    }
    console.info(nextState)
    console.groupEnd()
    return nextState
  }, [
    gl,
    stage,
    ticker,
    left,
    top,
    width,
    height,
  ])

  const [Canvas] = useState(() => {
    return function Canvas (props: { children: JSX.Element }): JSX.Element {
      useEffect(() => {
        onReady?.()
      }, [])
      return props.children
    }
  })

  useLayoutEffect(() => {
    render(
      <Canvas>
        <CanvasStateContext.Provider value={state}>
          { children }
        </CanvasStateContext.Provider>
      </Canvas>,
      defaultContainer,
    )
  }, [Canvas, children, defaultContainer, state])
  
  useLayoutEffect(() => {
    const renderLoop = () => {
      gl.render(stage)
    }
    ticker.add(renderLoop, null, UPDATE_PRIORITY.LOW)
    return () => {
      ticker.remove(renderLoop)
    }
  }, [gl, ticker, stage])

  useEffect(() => {
    return () => {
      ticker.destroy()
      stage.destroy()
      unmountComponentAtNode(defaultContainer)
    }
  }, [defaultContainer, ticker, stage])

  // 缩放
  useEffect(() => {
    gl.resize(width, height)
  }, [gl, width, height])

}
