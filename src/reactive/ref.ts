import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

export class RefImp {
    private _value: any;
    private _originValue
    public dep
    public _v_isRef: boolean

    constructor(value) {
        this._v_isRef = true
        this._originValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }

    get value() {
        //收集过的不在收集
        if (isTracking()) {
            trackEffect(this.dep);
        }
        return this._value;
    }

    set value(newValue) {
        // newValue -> value 相等则不做赋值
        if (hasChanged(newValue, this._originValue)) {
            //收集过的不在收集
            this._originValue = newValue
            this._value = convert(newValue);
            triggerEffect(this.dep);
        }
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
    return new RefImp(value);
}

export function isRef(obj) {
    return !!obj._v_isRef;
}

export function unRef(obj) {
    return isRef(obj) ? obj.value : obj;
}

export function proxyRefs(object) {
    return new Proxy(object,{
        get(target,key){
            // 如果是ref对象返回.value
            // 不是则返回本身
            return unRef(Reflect.get(target,key))
        },
        set(target,key,value){
            if (isRef(target[key]) && !isRef(value)) {
                 // 如果原来是ref对象，传过来的不是ref对象，只替换value值
                return (target[key].value = value)
            }else{
                 // 如果value是个ref对象则直接替换
                return Reflect.set(target,key,value)
            }
        }
    })
    
}