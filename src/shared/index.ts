export const extend = Object.assign;

export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

export const hasChanged = (val: any, newVal: any) => !Object.is(val, newVal);

export const hasOwn = (val, key: any) => Object.prototype.hasOwnProperty.call(val, key);
