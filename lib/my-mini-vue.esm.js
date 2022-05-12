var shapFlags;
(function (shapFlags) {
    shapFlags[shapFlags["ELEMENT"] = 1] = "ELEMENT";
    shapFlags[shapFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    shapFlags[shapFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    shapFlags[shapFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN"; // 1000
})(shapFlags || (shapFlags = {}));

const publicProertiesMap = {
    "$el": instance => instance.vnode.el
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // 拿取 data
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicProertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: null,
    };
    return component;
}
function setupComponent(instance) {
    // TODO  
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = component;
    if (setup) {
        // setup 可能返回一个 render 函数，
        // 或者一个对象
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO function
    if (typeof setupResult === 'object') {
        // setupState 赋值操作
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    // if(component.render){
    instance.render = component.render;
    // }
}

function render(vnode, container) {
    // patch 统一处理
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断类型，是组件？ 还是元素
    // TODO
    // processElement()
    const { shapFlag } = vnode;
    if (shapFlag & shapFlags.ELEMENT) {
        processElement(vnode, container);
    }
    else if ((shapFlag & shapFlags.STATEFUL_COMPONENT)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // 挂载元素
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children, shapFlag } = vnode;
    const el = vnode.el = document.createElement(type);
    // 判断是否为string，为string则为文本类型
    // 判断是否为array， 为array说明里面还有其他vnode，则需要继续调patch
    if ((shapFlag & shapFlags.TEXT_CHILDREN)) {
        el.textContent = children;
    }
    else if (shapFlag & shapFlags.ARRAY_CHILDREN) {
        mountChildren(children, el);
    }
    // 判断是否为 on 开头，第三个字母大写的事件名
    const isOn = (key) => /^on[A-Z]/.test(key);
    for (const key in props) {
        const value = props[key];
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            // 挂载事件
            el.addEventListener(event, value);
        }
        else {
            el.setAttribute(key, value);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.forEach(vn => 
    // 递归调用 patch
    patch(vn, container));
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
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

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapFlag: getShapFlag(type)
    };
    if (typeof children === 'string') {
        // 将 shapFlag 置为 X1XX
        vnode.shapFlag = vnode.shapFlag | shapFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        // 将 shapFlag 置为 1XXX
        vnode.shapFlag = vnode.shapFlag | shapFlags.ARRAY_CHILDREN;
    }
    return vnode;
}
function getShapFlag(type) {
    return typeof type === 'string' ? shapFlags.ELEMENT : shapFlags.STATEFUL_COMPONENT;
}

function createApp(rootCompontent) {
    return {
        mount(rootContainer) {
            // 第一步  将所有的Conponent 转化为 Vnode，再去做处理
            const vnode = createVNode(rootCompontent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
