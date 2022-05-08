import typescript from "@rollup/plugin-typescript";
export default {
    input: "./src/index.ts",
    output: [
        // 两种打包形式
        // 第一种 cjs -> commonjs
        {
            format:"cjs",
            file:"lib/my-mini-vue.cjs.js"
        },
        // 第二种 es module
        {
            format:'es',
            file:"lib/my-mini-vue.esm.js"
        }
    ],
    plugins :[
        typescript()
    ]
};