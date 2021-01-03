import { FC, useEffect, useRef } from 'react'
import StatsJS from 'stats.js'

export const Stats: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }

    const inst = new StatsJS()
    inst.dom.style.position = 'absolute'
    inst.dom.style.left = ''
    inst.dom.style.right = '0'
    ref.current.appendChild(inst.dom)

    let rafId: number
    const update = () => {
      inst.update()
      rafId = requestAnimationFrame(update)
    }
    update()
    return () => {
      cancelAnimationFrame(rafId)
      inst.dom.remove()
    }
  }, [])

  return (
    <div ref={ ref } />
  )
}
