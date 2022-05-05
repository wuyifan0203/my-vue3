import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true,true)

enum ReactiveFlag {
    IS_READONLY = '_v_isReadonly',
    IS_REACTIVE = '_v_isReactive'
}

function createGetter(isReadonly = false,isShallow = false){
    return function get(target, key) {
        if(key === ReactiveFlag.IS_REACTIVE){
            return true
        }else if(key === ReactiveFlag.IS_READONLY){
            return true
        }

        let res = Reflect.get(target, key);

        //是否为shallowReadonly
        if(isShallow){
            return res
        }

        // 判断是不是对象
        if(isObject(res)){
            return isReadonly? readonly(res):reactive(res);
        }

        if (!isReadonly) {
            // 收集依赖
            track(target, key)
        }
        return res;
    }
}

function createSetter (isReadonly = false){
    return function set(target, key, newValue) {

        let res = Reflect.set(target, key, newValue)
        if (!isReadonly) {
            // 触发依赖
            trigger(target, key)
        }
        return res
    }
};

export function isReactive(value){
    return !!value[ReactiveFlag.IS_REACTIVE]
}

export function isReadonly(value){
    return !!value[ReactiveFlag.IS_READONLY]
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHanders = {
    get: readonlyGet,
    set(target, key, newValue) {
        console.warn(`key ${key} can't be set ,beacuse target is a readonly Object`,target)
        return true   
    }
}

export const shallowReadonlyHanders = extend({},readonlyHanders,{
    get:shallowReadonlyGet
})