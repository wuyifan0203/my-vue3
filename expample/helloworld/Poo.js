import { h,inject,provide,createTextVNode } from "../../lib/my-mini-vue.esm.js ";
import { Foo } from "./Foo.js";

export const Poo = {
    name: "Poo",
    setup(props) {
        // 测试 inject
        const injectName = inject('injectName');
        // console.log(injectName);

        const injectDefault = inject("injectDefaultText","default");
        // console.log(injectDefault);

        const injectDefaultFunction = inject("injectFunction",()=>'default function')

        // 测试 循环嵌套 provide 
        provide('injectName','wyf2')
        return {
            injectName,
            injectDefault,
            injectDefaultFunction
        }
    },
    //  count
    render() {
        return h('div', {},[
            createTextVNode('Test inject --->'),
            h('p',{},'Poo inject name: ' + this.injectName),
            h('p',{},'Poo inject Default typeof Text: ' + this.injectDefault),
            h('p',{},'Poo inject Default typeof Function: ' + this.injectDefaultFunction),
            createTextVNode('this is foo'),
            h(Foo)
        ])
    },

}