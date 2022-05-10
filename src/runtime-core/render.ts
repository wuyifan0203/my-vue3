import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
    // patch 统一处理
    patch(vnode, container)
}

function patch(vnode, container) {
    // 判断类型，是组件？ 还是元素
    // TODO
    // processElement()
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}

function processElement(vnode, container) {
    // 挂载元素
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    const el: HTMLElement = vnode.el = document.createElement(type);

    // 判断是否为string，为string则为文本类型
    // 判断是否为array， 为array说明里面还有其他vnode，则需要继续调patch
    if (typeof children === 'string') {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        mountChildren(children, el)
    }

    for (const key in props) {
        const value = props[key];
        el.setAttribute(key, value)
    }

    container.append(el)
}
function mountChildren(vnode, container) {
    vnode.forEach(vn =>
        // 递归调用 patch
        patch(vn, container)
    )
}

function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container)
}


function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
    // 需要继续 vnode -> patch
    // vnode -> element -> mount

    // 从实例上拿到代理好的 this，并绑定
    const { proxy } = instance;
    // 注意这里的 subTree 依然是一个 vnode
    const subTree = instance.render.call(proxy);
    // 递归调用 patch
    patch(subTree, container);
    // 此时 subTree 已经 mountElement 完毕，有了el
    initialVNode.el = subTree.el;
}



