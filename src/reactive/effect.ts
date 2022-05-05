import { extend } from "../shared";

export class ReactiveEffect {
    private _fn: any;
    public scheduler: Function | undefined
    deps = [] as Set<ReactiveEffect>[];
    active = true;//对象的是否调用过stop
    onStop?: () => {}
    constructor(fn: any, scheduler?: Function) {
        this._fn = fn;
        this.scheduler = scheduler
    }

    run() {
        if (!this.active) {
            return this._fn();
        };
        shouldTrack = true;

        activeEffect = this;

        // 执行fn函数，
        const result = this._fn();
        //reset
        shouldTrack = false;

        //并且返回fn的返回值
        return result
    }

    stop() {
        if (this.active) {
            cleanUpEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false;
        }
    }
}

function cleanUpEffect(effect: ReactiveEffect) {
    effect.deps.forEach((dep: Set<ReactiveEffect>) => {
        dep.delete(effect)
    })
    //将deps数组滞空
    effect.deps.length = 0
}

// 当前在执行的effect
let activeEffect: ReactiveEffect;
// 用来存储所有响应式对象
const targetMap = new Map();
// 判断是否收集依赖
let shouldTrack:boolean;

// effect函数
export function effect(fn: Function, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options)
    _effect.onStop = options.onStop;
    // 调用fn
    _effect.run()
    // 返回runner，使用bind是为了解决run()的this指向问题
    const runner: any = _effect.run.bind(_effect)

    runner.effect = _effect;

    return runner

}

// 依赖收集
export function track(target, key: symbol | string) {
    //不是收集状态直接return
    if(!isTracking()) return
    // 存储结构 target -> key -> dep 
    // 获取当前target所有depMap
    let depMap = targetMap.get(target);
    if (!depMap) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }
    // 获取当前key的dep
    let dep = depMap.get(key);
    if (!dep) {
        dep = new Set();
        depMap.set(key, dep);
    }

    trackEffect(dep)
}

export function trackEffect(dep){
     //只收集一次
    if(dep.has(activeEffect))return

    //容器收集依赖
    dep.add(activeEffect);
    //反向记录容器
    activeEffect.deps.push(dep);
}

export function isTracking() {
    //减少重复收集 
    // if (!activeEffect) return
    //避免在stop时收集依赖
    // if (!shouldTrack) return
    // 2 in 1
    return shouldTrack && activeEffect  !== undefined;
}

// 依赖触发
export function trigger(target, key: symbol | string) {
    // 在所有响应式对象中，依据target找到对应depMap
    const depMap = targetMap.get(target);
    // 通过找到对应的dep
    const dep = depMap.get(key);
    triggerEffect(dep)
}
export function triggerEffect(dep){
    for (const effect of dep) {
        // 执行所有依赖相关的fn
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run()
        }
    }
}

export function stop(runner) {
    runner.effect.stop()
}