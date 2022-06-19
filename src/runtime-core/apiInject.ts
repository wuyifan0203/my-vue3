import { getCurrentInstance } from "./component"

function provide(key:any,value:any) {
    // 存
    const currentInstance:any = getCurrentInstance()
    if(currentInstance){
        let {provides} = currentInstance;
        const parentProvides = currentInstance.parent?.provides;
        //  这里有个 ？ 是因为根组件 App 的 parent 是个undefind

        // 初始化，只在第一次赋值，如果一样就不赋值
        if(parentProvides === provides){
            // 这里不太理解
            provides = currentInstance.provides = Object.create(parentProvides);
        }

        // provides = currentInstance.provides
        
       
        provides[key] = value
    }

    
}

function inject(key:any,defaultValue:any) {
     // 取
     const currentInstance:any = getCurrentInstance()
     if(currentInstance){
        const parentProvides = currentInstance.parent.provides;

        if(key in parentProvides){
            return parentProvides[key]
        }else if (defaultValue){
            if(typeof defaultValue === 'function'){
                return defaultValue();
            }
            return defaultValue
        }
       
     }
    
    
}
export {
    provide,
    inject
}