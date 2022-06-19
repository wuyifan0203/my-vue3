import { isObject } from "../shared/index";
import { shapFlags } from "../shared/shapFlags";
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode";

export function render(vnode, container,parent) {
    // patch 统一处理
    patch(vnode, container,parent)
}

function patch(vnode, container,parent) {
    const { shapFlag, type } = vnode;
    switch (type) {
        // 新增类型 Fragment 只渲染 children
        case Fragment:
            processFragment(vnode, container,parent);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            // 判断类型，是组件？ 还是元素
            if (shapFlag & shapFlags.ELEMENT) {
                processElement(vnode, container,parent)
            } else if ((shapFlag & shapFlags.STATEFUL_COMPONENT)) {
                processComponent(vnode, container,parent);
            }
            break;
    }

}

function processFragment(vnode, container,parent) {
    mountChildren(vnode, container,parent)
}

function processText(vnode, container) {
    const {children} = vnode;
    const TextVNode =  vnode.el = document.createTextNode(children);
    container.append(TextVNode)
}

function processElement(vnode, container,parent) {
    // 挂载元素
    mountElement(vnode, container,parent)
}

function mountElement(vnode, container,parent) {
    const { type, props, children, shapFlag } = vnode;
    const el: HTMLElement = vnode.el = document.createElement(type);

    // 判断是否为string，为string则为文本类型
    // 判断是否为array， 为array说明里面还有其他vnode，则需要继续调patch
    if ((shapFlag & shapFlags.TEXT_CHILDREN)) {
        el.textContent = children;
    } else if (shapFlag & shapFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el,parent)
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
function mountChildren(vnode, container,parent) {
    vnode.children.forEach(vn =>
        // 递归调用 patch
        patch(vn, container,parent)
    )
}

function processComponent(vnode, container,parent) {
    // 挂载组件
    mountComponent(vnode, container,parent)
}


function mountComponent(initialVNode, container,parent) {
    const instance = createComponentInstance(initialVNode,parent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container );
}

function setupRenderEffect(instance, initialVNode, container) {
    // 需要继续 vnode -> patch
    // vnode -> element -> mount

    // 从实例上拿到代理好的 this，并绑定
    const { proxy } = instance;
    // 注意这里的 subTree 依然是一个 vnode
    const subTree = instance.render.call(proxy);
    // 递归调用 patch
    patch(subTree, container,instance);
    // 此时 subTree 已经 mountElement 完毕，有了el
    initialVNode.el = subTree.el;
}



