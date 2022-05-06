export function createComponentInstance(vnode: any) {
    const component = {
        vnode,
        type:vnode.type
    }

    return component

}

export function setupComponent(instance) {

    // TODO  
    // initProps()
    // initSlots()

    setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        // setup可能返回一个render函数，
        // 或者一个对象
        const setupResult = setup(); 
        handleSetupResult(instance,setupResult);
    }
}
function handleSetupResult(instance,setupResult: any) {
    // TODO function
    if(typeof setupResult === 'object'){
        instance.setupState = setupResult; 

    }
    finishComponentSetup(instance)
}

function finishComponentSetup (instance){
    const component = instance.type;
    if(component.render){
        instance.render = component.render;
    }

}

