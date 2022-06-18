import { isObject } from "../shared/index";
import { shapFlags } from "../shared/shapFlags";
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    // patch 统一处理
    patch(vnode, container)
}

function patch(vnode, container) {
    const { shapFlag, type } = vnode;
    switch (type) {
        // 新增类型 Fragment 只渲染 children
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            // 判断类型，是组件？ 还是元素
            if (shapFlag & shapFlags.ELEMENT) {
                processElement(vnode, container)
            } else if ((shapFlag & shapFlags.STATEFUL_COMPONENT)) {
                processComponent(vnode, container);
            }
            break;
    }

}

function processFragment(vnode, container) {
    mountChildren(vnode, container)
}

function processText(vnode, container) {
    const {children} = vnode;
    const TextVNode =  vnode.el = document.createTextNode(children);
    container.append(TextVNode)
}

function processElement(vnode, container) {
    // 挂载元素
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const { type, props, children, shapFlag } = vnode;
    const el: HTMLElement = vnode.el = document.createElement(type);

    // 判断是否为string，为string则为文本类型
    // 判断是否为array， 为array说明里面还有其他vnode，则需要继续调patch
    if ((shapFlag & shapFlags.TEXT_CHILDREN)) {
        el.textContent = children;
    } else if (shapFlag & shapFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    // 判断是否为 on 开头，第三个字母大写的事件名
    const isOn = (key: string): boolean => /^on[A-Z]/.test(key);

    for (const key in props) {
        const value = props[key];
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            // 挂载事件
            el.addEventListener(event, value)
        } else {
            el.setAttribute(key, value)
        }
    }

    container.append(el)
}
function mountChildren(vnode, container) {
    vnode.children.forEach(vn =>
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



