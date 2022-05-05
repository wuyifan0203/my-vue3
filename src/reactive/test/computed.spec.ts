import { computed } from "../computed";
import { reactive } from "../reactive";

describe('computed', () => {
    it('happy path', () => {
        const user = reactive({
            age:23,
        });
        const age = computed(()=>{
            return user.age;
        });
        expect(age.value).toBe(23);
    });

    it('lazyly', () => {
        const value = reactive({
            foo:1
        });

        const getter = jest.fn(() => {
            return value.foo;
        });
        const computedValue = computed(getter);

        // test 懒执行 
        expect(getter).not.toHaveBeenCalled();
        expect(computedValue.value).toBe(1); 
        expect(getter).toBeCalledTimes(1);

        // test 缓存
        computedValue.value // 触发get
        expect(getter).toBeCalledTimes(1);

        // test should not computed until need
        value.foo = 2; 
        // trigger -> effect -> run 执行了getter
        expect(getter).toBeCalledTimes(1);

        // now it should be computed
        expect(computedValue.value).toBe(2);
        // 先走scheduler 改变dirty再执行了_effect.run() 去执行getter
        expect(getter).toBeCalledTimes(2);
    

        // should not compute again 
        computedValue.value // get
        expect(getter).toBeCalledTimes(2);
    
    });
    
});