import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
    private _getter: any;
    private _value: any;
    private _dirty: boolean = true;
    private _effect
    constructor(getter) {
        this._getter = getter;
        // 需要effect来收集依赖
        this._effect = new ReactiveEffect(
            // fn
            getter,
            // scheduler
            () => {
                if (!this._dirty) {
                    this._dirty = true;
                }
            }
        )
    }

    get value() {
        // 当get 的时候，需要将ditry设为true
        // effect
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }

}


export function computed(getter) {
    return new ComputedRefImpl(getter)
}