import { isProxy, isReactive } from "../baseHandler";
import { reactive } from "../reactive"

describe('reactive', () => {
    it('happy path', () => {
        const original = {
            foo: 1
        }
        const observed = reactive(original);

        expect(original).not.toBe(observed)

        expect(observed.foo).toBe(1);
        // 对 isReactive() 进行测试
        expect(isReactive(original)).toBe(false);
        expect(isReactive(observed)).toBe(true);
         // 对 isProxy() 进行测试
        expect(isProxy(original)).toBe(false);
        expect(isProxy(observed)).toBe(true);

    });

    //功能2:循环嵌套转化为reactive对象
    it('nested reactive', () => {
        const original = {
            nested:{
                foo:1
            },
            array:[{boo:2}]
        };
        const observed = reactive(original);
       
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);


    });
})