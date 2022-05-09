import { h } from "../../lib/my-mini-vue.esm.js";

export const App = {
    // <template></template> 
    // 或 render函数
    render() {
        return h("div", {
            id:"root",
            class:["red","blue"]
        },[
            h("p",{class:"red"},"hi !"),
            h("p",{class:"blue"}," It 's my vue 3")
        ]);
    },

    // compostion Api
    setup() {
        return {
            msg: "my vue3"
        };
    }
} 