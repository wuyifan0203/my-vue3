import { mutableHandlers, readonlyHanders, shallowReadonlyHanders } from "./baseHandler"

function createActiveObject(obj:any,baseHandler) {
    return new Proxy(obj,baseHandler)
}

export function reactive(obj) {
    return createActiveObject(obj, mutableHandlers )
}

export function readonly(obj) {
    return createActiveObject(obj,readonlyHanders)
}

export function shallowReadonly(obj) {
    return createActiveObject(obj, shallowReadonlyHanders)
}


