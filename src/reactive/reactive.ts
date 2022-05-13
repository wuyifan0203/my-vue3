import { isObject } from "../shared/index"
import { mutableHandlers, readonlyHanders, shallowReadonlyHanders } from "./baseHandler"

function createReactiveObject(target:any,baseHandler) {
    if(!isObject(target)){
        console.warn(`target ${target} is not a Object`);
        return target
    }
    return new Proxy(target,baseHandler)
}

export function reactive(obj) {
    return createReactiveObject(obj, mutableHandlers )
}

export function readonly(obj) {
    return createReactiveObject(obj,readonlyHanders)
}

export function shallowReadonly(obj) {
    return createReactiveObject(obj, shallowReadonlyHanders)
}


