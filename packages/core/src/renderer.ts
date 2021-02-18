/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from '@pixi/display'
import { Text } from '@pixi/text'
import type { ReactNode } from 'react'
import type { FiberRoot } from 'react-reconciler'
import { unstable_now as now } from 'scheduler'
import { createElement, ElementType } from './elements'
import { Reconciler } from './reconciler'

const roots = new Map<Container, FiberRoot>()

export enum ReactRootTags {
  LegacyRoot = 0,
  BlockingRoot = 1,
  ConcurrentRoot = 2,
}

export const Renderer = Reconciler<
  ElementType,
  Record<string, any>,
  Container,
  Container,
  Text,
  Container,
  unknown,
  Container,
  null, // HostContext
  any[], // UpdatePayload
  unknown, // ChildSet 暂时没有用到
  number, // setTimeout 的返回值
  -1
  >({
  now,
  createInstance: createElement,
  removeChild: (parentInstance, child) => {
    parentInstance.removeChild(child)
    child.destroy(true)
  },
  appendChild: (parentInstance, child) => {
    parentInstance.addChild(child)
  },
  insertBefore: (parentInstance, child, beforeChild) => {
    const index = parentInstance.getChildIndex(beforeChild)
    parentInstance.addChildAt(child, index)
  },
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  queueMicrotask: typeof window.queueMicrotask === 'function'
    ? globalThis.queueMicrotask
      : typeof Promise !== 'undefined'
      ? (callback: (...args: any[]) => any) => Promise.resolve(null).then(callback).catch(handleErrorInNextTick)
    : setTimeout, // TODO: Determine the best fallback here.
  noTimeout: -1,
  appendInitialChild: (parentInstance, child) => {
    parentInstance.addChild(child)
  },
  appendChildToContainer: (container, child) => {
    container.addChild(child)
  },
  removeChildFromContainer: (container, child) => {
    container.removeChild(child)
    child.destroy(true)
  },
  insertInContainerBefore: (container, child, beforeChild) => {
    const index = container.getChildIndex(beforeChild)
    container.addChildAt(child, index)
  },
  commitUpdate(instance, updatePayload, _type, _prevProps, _nextProps, _internalHandle) {
    instance.__applyUpdate(instance, updatePayload)
  },
  hideInstance(instance) {
    instance.visible = false
  },
  unhideInstance(instance) {
    instance.visible = true
  },
  hideTextInstance(_textInstance) {
    throw new Error('要渲染文本，请使用 <Text content=...>')
  },
  getPublicInstance(instance) {
    return instance
  },
  getRootHostContext(_rootContainer) {
    return null
  },
  getChildHostContext(parentHostContext, _type, _rootContainer) {
    return parentHostContext
  },
  createTextInstance() {
    throw new Error('要渲染文本，请使用 <Text content=...>')
  },
  finalizeInitialChildren(
    _instance,
    _type,
    _props,
    _rootContainer,
    _hostContext,
  ) {
    return false
  },
  commitMount(_instance, _type, _newProps, _internalHandle) {
  },
  prepareUpdate(
    instance,
    _type,
    oldProps,
    newProps,
    _rootContainer,
    _hostContext
  ) {
    return instance.__diffProps(instance, oldProps, newProps)
  },
  prepareForCommit() {
    return null
  },
  preparePortalMount() {
  },
  resetAfterCommit(_containerInfo) { },
  shouldSetTextContent() {
    return false
  },
  clearContainer(container) {
    container.removeChildren()
  },
})

Renderer.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
  version: process.env.PKG_VERSION ?? '0.0.0',
  rendererPackageName: '@glui/core',
})

export function render(
  element: ReactNode,
  container: Container,
  tag = ReactRootTags.ConcurrentRoot,
) {
  console.group('render', { element, container })
  let root = roots.get(container)
  console.info({ root })
  if (!root) {
    const newRoot = (root = Renderer.createContainer(
      container,
      tag,
      false,
      null,
    ))
    roots.set(container, newRoot)
  }
  Renderer.updateContainer(element, root, null, () => undefined)
  console.groupEnd()
  return Renderer.getPublicRootInstance(root)
}

export function unmountComponentAtNode(container: Container, callback?: (c: Container) => void) {
  const root = roots.get(container)
  if (root) {
    Renderer.updateContainer(null, root, null, () => {
      roots.delete(container)
      callback?.(container)
    })
    return true
  }
  return false
}

export function createPortal(
  children: ReactNode,
  containerInfo?: Container, 
  implementation?: any, 
  key?: string,
) {
  return Renderer.createPortal(children, containerInfo, implementation, key)
}

function handleErrorInNextTick(error: unknown) {
  setTimeout(() => {
    throw error;
  });
}