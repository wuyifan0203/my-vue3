import { h,getCurrentInstance,inject } from "../../lib/my-mini-vue.esm.js ";

export const Foo = {
    name: "Foo",
    setup(props) {
        // 测试 getCurrentInstance
        const instance = getCurrentInstance();
        console.log(instance);
        // 测试 inject
        const injectName = inject('injectName');
        console.log(injectName);
        // const injectAge = inject('injectAge',24)
  
        // 假设有个 count
        console.log(props);
        props.count++;
        console.log(props);
        return {
            injectName
        }
    },
    //  count
    render() {
        return h('div', {}, 'Foo:' + this.count + ' inject name: ' + this.injectName)
    },

}
// 1.输出 props
// 2.内部可以通过 this 访问到
// 3.不可以被更改，是一个 shallowReadonly