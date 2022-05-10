const publicProertiesMap = {
    "$el":instance=>instance.vnode.el
};

export const publicInstanceProxyHandlers = {
    get({_:instance}, key) {
        // 拿取 data
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key]
        }

        const publicGetter = publicProertiesMap[key];
        if(publicGetter){
            return publicGetter(instance);
        }
    }
}