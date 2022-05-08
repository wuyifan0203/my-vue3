import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container) {
    // patch 统一处理
    patch(vnode,container)
}

function patch(vnode,container){
    // 判断类型，是组件？ 还是元素
    // TODO
    // processElement()

    processComponent(vnode,container);

}

function processComponent(vnode,container ) {
    // 挂载组件
    mountComponent(vnode,container)
    
}

function mountComponent(vnode,container) {
    const instance = createComponentInstance(vnode);

    setupComponent(instance);
    setupRenderEffect(instance,container); 
}

function setupRenderEffect(instance,container ) {
    // 注意这里的 subTree 依然是一个 vnode
    // 需要继续 vnode -> patch
    // vnode -> element -> mount
    const subTree = instance.render(); 

    patch(subTree,container)

}

