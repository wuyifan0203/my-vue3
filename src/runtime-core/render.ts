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
    const el: HTMLElement = document.createElement(type);

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
        patch(vn, container)
    )
}

function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container)

}


function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);

    setupComponent(instance);
    setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
    // 注意这里的 subTree 依然是一个 vnode
    // 需要继续 vnode -> patch
    // vnode -> element -> mount
    const subTree = instance.render();

    patch(subTree, container)

}



