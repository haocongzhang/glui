/* eslint-disable no-prototype-builtins */
export type UpdatePayload = any

export type AnyElement = any

export type AnyProps = Record<string, any>

export const defaultApplyProps = (el: AnyElement, props: AnyProps) => {
  for (const key in props) {
    set(el, key, props[key])
  }
}

export const defaultApplyUpdate = (el: AnyElement, payload: UpdatePayload) => {
  for (let i = 0; i < payload.length; i += 2) {
    const key = payload[i]
    const value = payload[i+1]
    set(el, key, value)
  }
}

const set = <T>(el: AnyElement, key: string, value: T) => {
  if (key === 'children') {
    // 不支持文本节点
    return
  }
  el[key] = value
}

export const defaultDiffProps = (_: AnyElement, oldProps: AnyProps, newProps: AnyProps) => {
  let propKey: string
  let updatePayload: any[] | null = null

  for (propKey in oldProps) {
    if (
      newProps.hasOwnProperty(propKey) ||
      !oldProps.hasOwnProperty(propKey) ||
      oldProps[propKey] == null
    ) {
      continue;
    }

    if (propKey === 'children') {
      continue
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the allowed property list in the commit phase instead.
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  
  for (propKey in newProps) {
    const nextProp = newProps[propKey];
    const lastProp = oldProps != null ? oldProps[propKey] : undefined;
    if (
      !newProps.hasOwnProperty(propKey) ||
      nextProp === lastProp ||
      (nextProp == null && lastProp == null)
    ) {
      continue;
    }
    if (propKey === 'children') {
      continue
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the allowed property list during the commit.
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  return updatePayload
}

export function mixin <T extends new (...args: any) => any>(factory: T, properties: PropertyDescriptorMap & ThisType<InstanceType<T>>) {
  return Object.defineProperties(factory.prototype, properties)
}
