import { shapFlags } from "../shared/shapFlags";

export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapFlag: getShapFlag(type)
    }

    if(typeof children === 'string'){
        // 将 shapFlag 置为 X1XX
        vnode.shapFlag = vnode.shapFlag | shapFlags.TEXT_CHILDREN;
    }else if(Array.isArray(children)){
         // 将 shapFlag 置为 1XXX
        vnode.shapFlag = vnode.shapFlag | shapFlags.ARRAY_CHILDREN;
    }
    // 当使用 slots 时，首先是组件，其次 children 是 object
    if(vnode.shapFlag & shapFlags.STATEFUL_COMPONENT){
        if(typeof children === 'object'){
            vnode.shapFlag = vnode.shapFlag | shapFlags.SLOT_CHILDREN
        }
    }

    return vnode;
}

function getShapFlag(type) {
     return typeof type === 'string' ? shapFlags.ELEMENT : shapFlags.STATEFUL_COMPONENT;
}