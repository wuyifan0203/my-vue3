export const extend = Object.assign;

export const isObject = (value: any): boolean => value !== null && typeof value === 'object';

export const hasChanged = (val: any, newVal: any): boolean => !Object.is(val, newVal);

export const hasOwn = (val, key: any): boolean => Object.prototype.hasOwnProperty.call(val, key);

export const toHandlerKey = (key):string =>{
    return key ? "on" + capitalize(key) : "";
}

export const capitalize = (key: string): string => key.charAt(0).toUpperCase() + key.slice(1);

export const camelize = (key: string): string => {
    return key.replace(/-(\w)/g, (_, c: string): string => {    
        return c ? c.toUpperCase() : ""
    })
}