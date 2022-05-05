import { isProxy, isReadonly } from "../baseHandler";
import {  readonly } from "../reactive";

describe('readonly', () => {
    it('readonly can be get', () => {
        const original = { foo:1,boo:{zoo:2}};
        const wraper = readonly(original);
        expect(wraper).not.toBe(original);
        expect(wraper.foo).toBe(1);

         // 对 isReadonly() 进行测试
        expect(isReadonly(wraper)).toBe(true);
        expect(isReadonly(wraper.boo)).toBe(true);
        expect(isReadonly(original)).toBe(false);
         // 对 isProxy() 进行测试
        expect(isProxy(wraper)).toBe(true);
        expect(isProxy(original)).toBe(false);
    });

    it('warn when call set', () => {
        console.warn = jest.fn();

        const user = readonly({
            age:18
        })
        
        user.age = 23;
        expect(console.warn).toBeCalledTimes(1)
    });
});