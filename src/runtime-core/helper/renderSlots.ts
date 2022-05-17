import { createVNode } from "../vnode";

export function renderSlots(slots,name,params) {
    let slot = slots[name]
    if(slot){
        if(typeof slot === 'function'){
            return createVNode("div",{},slot(params));
        }
    }
}