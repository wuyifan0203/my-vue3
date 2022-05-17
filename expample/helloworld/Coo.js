import { h } from "../../lib/my-mini-vue.esm.js ";

export const Coo = {
    name: "Coo",
    setup(props,{slots}) {

    },
    render() {
        const coo = h('p',{},"this is coo")
        return h('div', {}, [coo,this.$slots])
    },

}