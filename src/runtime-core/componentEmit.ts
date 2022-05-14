import { camelize, capitalize, toHandlerKey } from "../shared/index";

export function emit(instance,eventName,...args) {
    console.log('emit -',eventName);
    const {props} = instance;

    const key = toHandlerKey(capitalize(camelize(eventName)));
    
    const handler = props[key];
    handler && handler(...args);
}