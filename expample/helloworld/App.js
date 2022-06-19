import { h,createTextVNode, getCurrentInstance,provide } from "../../lib/my-mini-vue.esm.js";
import { Foo } from "./Foo.js";
import { Boo } from "./Boo.js";
import { Coo } from "./Coo.js";
import { Poo } from "./Poo.js";

window.self = null

export const App = {
    // <template></template> 
    // 或 render 函数
    name: "App",
    render() {
        // 查看 render 绑定的 this
        window.self = this

        return h("div", {
            id: "root",
            class: ["red"],
            onClick() {
                console.log('onClick');
            }
        },
            [
                h("p", { class: "red" }, "hi !"),
                h("p", { class: "blue" }, " It 's my " + this.msg),
                h(Foo, { count: 1 }),
                h(Boo, {
                    onAdd(a, b) {
                        console.log('on add 666666');
                        console.log(a, b);
                    },
                    onAddFoo(a, b) {
                        console.log('on AddFoo 666666');
                        console.log(a, b);
                    }
                }),
                h(Coo, { class: "blue" }, {
                    header: ({ age }) => [
                        h("p", {}, "Coo is Array children 1 " + age),
                        createTextVNode('createTextVNode :Hello I love you !'),
                        h(Poo)
                    ],
                    footer: () => h("p", {}, "Coo is Array children 2"),
                    default: () => h("p", {}, "Coo is Array children default"),
                }),
                // h(Coo,{ class: "blue"},{
                //     default:()=>h("p",{},"Coo is Array children default"),
                // }),
            ]
        );
    },

    // compostion Api
    setup() {
        // 测试 getCurrentInstance
        const instance = getCurrentInstance();
        console.log(instance);

        // 测试 provide
        provide('injectName','wyf')
        return {
            msg: "my vue3"
        };
    }
} 