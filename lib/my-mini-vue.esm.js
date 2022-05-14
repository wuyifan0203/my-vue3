var shapFlags;
(function (shapFlags) {
    shapFlags[shapFlags["ELEMENT"] = 1] = "ELEMENT";
    shapFlags[shapFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    shapFlags[shapFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    shapFlags[shapFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN"; // 1000
})(shapFlags || (shapFlags = {}));

const extend = Object.assign;
const isObject = (value) => value !== null && typeof value === 'object';
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const toHandlerKey = (key) => {
    return key ? "on" + capitalize(key) : "";
};
const capitalize = (key) => key.charAt(0).toUpperCase() + key.slice(1);
const camelize = (key) => {
    return key.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
};

// 用来存储所有响应式对象
const targetMap = new Map();
// 依赖触发
function trigger(target, key) {
    // 在所有响应式对象中，依据target找到对应depMap
    const depMap = targetMap.get(target);
    // 通过找到对应的dep
    const dep = depMap.get(key);
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (const effect of dep) {
        // 执行所有依赖相关的fn
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
var ReactiveFlag;
(function (ReactiveFlag) {
    ReactiveFlag["IS_READONLY"] = "_v_isReadonly";
    ReactiveFlag["IS_REACTIVE"] = "_v_isReactive";
})(ReactiveFlag || (ReactiveFlag = {}));
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key) {
        if (key === ReactiveFlag.IS_REACTIVE) {
            return true;
        }
        else if (key === ReactiveFlag.IS_READONLY) {
            return true;
        }
        let res = Reflect.get(target, key);
        //是否为shallowReadonly
        if (isShallow) {
            return res;
        }
        // 判断是不是对象
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(isReadonly = false) {
    return function set(target, key, newValue) {
        let res = Reflect.set(target, key, newValue);
        if (!isReadonly) {
            // 触发依赖
            trigger(target, key);
        }
        return res;
    };
}
const mutableHandlers = {
    get,
    set
};
const readonlyHanders = {
    get: readonlyGet,
    set(target, key, newValue) {
        console.warn(`key ${key} can't be set ,beacuse target is a readonly Object`, target);
        return true;
    }
};
const shallowReadonlyHanders = extend({}, readonlyHanders, {
    get: shallowReadonlyGet
});

function createReactiveObject(target, baseHandler) {
    if (!isObject(target)) {
        console.warn(`target ${target} is not a Object`);
        return target;
    }
    return new Proxy(target, baseHandler);
}
function reactive(obj) {
    return createReactiveObject(obj, mutableHandlers);
}
function readonly(obj) {
    return createReactiveObject(obj, readonlyHanders);
}
function shallowReadonly(obj) {
    return createReactiveObject(obj, shallowReadonlyHanders);
}

function emit(instance, eventName, ...args) {
    console.log('emit -', eventName);
    const { props } = instance;
    const key = toHandlerKey(capitalize(camelize(eventName)));
    const handler = props[key];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // TODO
    // attrs
}

const publicProertiesMap = {
    "$el": instance => instance.vnode.el
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // 拿取 data
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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
        setupState: {},
        props: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO  
    initProps(instance, instance.vnode.props);
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = component;
    // setup 可能返回一个 render 函数，
    // 或者一个对象
    if (setup) {
        // 传入  props
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
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
