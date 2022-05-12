import { h } from "../../lib/my-mini-vue.esm.js";

window.self = null

export const App = {
    // <template></template> 
    // 或 render 函数
    render() {
         // 查看 render 绑定的 this
        window.self = this

        return h("div", {
            id:"root",
            class:["red"],
            onClick(){
                console.log('onClick');
            }
        },
        "hi , " + this.msg
        // [
        //     h("p",{class:"red"},"hi !"),
        //     h("p",{class:"blue"}," It 's my vue 3")
        // ]
        );
    },

    // compostion Api
    setup() {
        return {
            msg: "my vue3"
        };
    }
} 