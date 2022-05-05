import { shallowReadonly } from "../reactive";
import { isReadonly } from "../baseHandler";

describe('shallowReeadonly', () => {
    it('shallowReadonly can be get', () => {
        const original = { foo:1,boo:{zoo:2}};
        const wraper = shallowReadonly(original);
        expect(wraper).not.toBe(original);
        expect(wraper.foo).toBe(1);

         // 对 isReadonly() 进行测试
        expect(isReadonly(wraper)).toBe(true);
        expect(isReadonly(wraper.boo)).toBe(false);
    });

    it('warn when call set', () => {
        console.warn = jest.fn();

        const user = shallowReadonly({
            age:18
        })
        
        user.age = 23;
        expect(console.warn).toBeCalledTimes(1)
    });
});

