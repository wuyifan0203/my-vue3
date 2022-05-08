import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootCompontent) { 
    return {
        mount(rootContainer){
            // 第一步  将所有的Conponent 转化为 Vnode，再去做处理
            const vnode = createVNode(rootCompontent);

            render(vnode,rootContainer )
        }
    }
    
}


