import typescript from "@rollup/plugin-typescript";
import pkg from './package.json'
export default {
    input: "./src/index.ts",
    output: [
        // 两种打包形式
        // 第一种 cjs -> commonjs
        {
            format:"cjs",
            file:pkg.main
        },
        // 第二种 es module
        {
            format:'es',
            file:pkg.module
        }
    ],
    plugins :[
        typescript()
    ]
};