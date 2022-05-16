import { shallowReadonly } from "../reactive/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode: any) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots:{},  
        emit:()=>{},
    }
    component.emit = emit.bind(null,component) as any;

    return component

}

export function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);

    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
    const component = instance.type;

    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)

    const { setup } = component;
    // setup 可能返回一个 render 函数，
    // 或者一个对象
    if (setup) {
        // 传入  props
        const setupResult = setup(shallowReadonly(instance.props),{
            emit:instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult: any) {
    // TODO function
    if (typeof setupResult === 'object') {
        // setupState 赋值操作
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const component = instance.type;
    // if(component.render){
    instance.render = component.render;
    // }

}

