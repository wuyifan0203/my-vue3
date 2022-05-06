import { setSourceMapRange } from "typescript"

export const App = {
    // <template></template> 
    // 或 render函数
    render() {
        return h("div", "hi ,It 's " + this.msg);
    },

    // compostion Api
    setup() {
        return {
            msg: "my vue3"
        };
    }
} 