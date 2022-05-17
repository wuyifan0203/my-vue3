import { h } from "../../lib/my-mini-vue.esm.js ";
// emit
export const Boo = {
    name: "Boo",
    setup(props,{emit}) {
        const emitAdd = () => {
            emit("add",1,2),
            emit("add-foo",3,4)
        }
       return {
           emitAdd
       }
    },

    render() {
        const btn = h('button',{
            onClick:this.emitAdd,
        },'emitAdd')
        const p = h('p',{},'emmit test')
        return h('div', {}, [p,btn])
    },
}

// 1.内部可以通过 context 访问到
// 2.支持 emit 事件调用
// 3.支持穿参数