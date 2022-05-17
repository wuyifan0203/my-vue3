import { shapFlags } from "../shared/shapFlags";

export function initSlots(instance,children) {
    const {vnode} = instance;
    if (vnode.shapFlag & shapFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children,instance.slots); 
    }
   
}

function normalizeObjectSlots(children,slots) {
    for (const key in children) {
        if (Object.prototype.hasOwnProperty.call(children, key)) {
            const slot = children[key];
             // 满足传值为数组或者单个节点
            slots[key] = (props)=>normalizeSlotValue(slot(props));
        }
    }
}

function normalizeSlotValue(slot) {
    return  Array.isArray(slot) ? slot : [slot]; 
}