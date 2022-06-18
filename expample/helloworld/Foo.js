import { h,getCurrentInstance } from "../../lib/my-mini-vue.esm.js ";

export const Foo = {
    name: "Foo",
    setup(props) {
        const instance = getCurrentInstance();
        console.log(instance);
        // 假设有个 count
        console.log(props);
        props.count++;
        console.log(props);
    },
    //  count
    render() {
        return h('div', {}, 'Foo:' + this.count)
    },

}
// 1.输出 props
// 2.内部可以通过 this 访问到
// 3.不可以被更改，是一个 shallowReadonly