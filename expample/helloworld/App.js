import { h } from "../../lib/my-mini-vue.esm.js";
import { Foo } from "./Foo.js";

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
                h(Foo, { count: 1 })
            ]
        );
    },

    // compostion Api
    setup() {
        return {
            msg: "my vue3"
        };
    }
} 