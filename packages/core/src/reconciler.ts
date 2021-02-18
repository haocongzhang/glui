import ReactReconciler from 'react-reconciler'

export const Reconciler = process.env.DEBUG_RECONCILER === 'true' ? DebugReconciler : ReactReconciler

type Primitive = boolean | number | undefined | number | string | symbol
const isPrimitive = (val: unknown): val is Primitive => {
  if (typeof val === 'object') {
    return val === null;
  }
  return typeof val !== 'function'
}

const log = <F extends (...args: any[]) => any>(label: string, fn: F): F => {
  const enhanced = (...args: any[]) => {
    console.group(label, args)
    const val = fn(...args)
    const primitive = isPrimitive(val)
    if (primitive) {
      console.groupCollapsed(`return ${val}`)
    } else {
      console.groupCollapsed('return')
    }
    console.info(val)
    console.groupEnd()
    console.groupEnd()
    return val
  }
  return enhanced as unknown as F
}

const logAll = (target: any) => {
  Object.keys(target).forEach(key => {
    const fn = target[key]
    if (typeof fn === 'function') {
      target[key] = log(key, fn)
    }
  })
}

function DebugReconciler <
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
>
(config: ReactReconciler.HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
  >) {
  logAll(config)
  return ReactReconciler(config)
}
