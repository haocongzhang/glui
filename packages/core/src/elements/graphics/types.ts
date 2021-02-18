/**
 * 描述一个绘图方法，他接受一个参数 `g`，通过他你可以进行任意绘图操作
 * 
 * ```ts
 * const drawRect = (g: Graphics) => {
 *  g.beginFill(0xff0000)
 *  g.drawRect(0, 0, 100, 100)
 *  g.endFill()
 * }
 * <Grahpics draw={ drawRect } />
 * ```
 */
export type Draw<T> = (g: T) => void
