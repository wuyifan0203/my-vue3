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