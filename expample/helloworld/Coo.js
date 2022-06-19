import { h,renderSlots } from "../../lib/my-mini-vue.esm.js ";
import {Foo} from "./Foo.js";

export const Coo = {
    name: "Coo",
    setup(props,{$slots}) {

    },
    render() {
        const coo = h('p',{},"this is coo")
        console.log(this.$slots);
        // 当 $slots 为数组的时候，不能直接渲染，需要做一层转化，
        // Array<VNode> -> vnode...
        // 解决方法，重新用一个 vndoe 包裹起来，使用 renderSlots 进行这步操作
        const age = 18;
        return h('div', {}, [
            renderSlots(this.$slots,"header",{age}),
            coo,
            renderSlots(this.$slots,"footer"),
            renderSlots(this.$slots,"default"),
            h(Foo,{ count: 99 })
        ])
    },

}
// 1，支持单节点，也支持数组节点
// 2，可以传key，按需渲染（具名插槽）  