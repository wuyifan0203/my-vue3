import { hasOwn } from "../shared/index.js";

const publicProertiesMap = {
    "$el": instance => instance.vnode.el
};

export const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // 拿取 data
        const { setupState, props } = instance;

        if (hasOwn(setupState, key)) {
            return setupState[key];
        } else if (hasOwn(props, key)) {
            return props[key];
        }

        const publicGetter = publicProertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
}