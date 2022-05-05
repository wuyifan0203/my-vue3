
import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe('effect', () => {

    // 功能1:执行传递的fn函数
    it('should call fn', () => {
        const user = reactive({
            age: 1
        })

        let newAge;
        effect(() => {
            newAge = user.age + 1;
        })

        //fn调用测试
        expect(newAge).toBe(2);
        //updata
        user.age++;
        expect(newAge).toBe(3);

    })

    // 功能2:调用effect 会返回一个函数叫runner， 
    // 同时, 会再次执行传递的fn函数 ，
    // 最后return fn 的返回值；
    it('should return runner when call effect', () => {
        let foo = 1;
        const runner = effect(() => {
            foo++
            return 'foo'
        });

        // 返回函数runner测试
        expect(typeof runner === 'function').toBe(true);
        // 执行fn测试
        expect(foo).toBe(2);
        // fn返回值测试
        expect(runner()).toBe('foo');

    });

    // 功能3:effect第二个参数:scheduler ，scheduler是一个函数
    // 当 effect函数第一执行的时候，会执行fn ，并不会执行scheduler
    // 当 响应式对象 update的时候，会执行scheduler ，不会执行fn
    // 当 执行runner时 ，会触发fn 
    it('scheduler', () => {
        let dummy
        let run: any
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler }
        )
        // 首次执行不会调用scheduler
        expect(scheduler).not.toHaveBeenCalled()
        // 证明fn调用
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        // 响应式对象 update的时候，会执行一次scheduler 
        expect(scheduler).toHaveBeenCalledTimes(1)
        // 证明fn没有调用
        expect(dummy).toBe(1)
        // manually run
        run()
        // 执行runner时 ，会触发fn 
        expect(dummy).toBe(2)
    });

    // 功能4:stop
    // 调用stop函数时effect的fn不会被执行
    // 调用runner时，会触发fn
    it('stop', () => {
        let dummy;
        const obj = reactive({
            foo: 1,
        });
        const runner = effect(() => {
            dummy = obj.foo
        })
        // 只set
        obj.foo = 2;
        expect(dummy).toBe(2);
        stop(runner);
        // 先get，后set
        // get又会触发依赖
        obj.foo++
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    });


    // 功能5:onStop
    // 调用stop函数后，如果有onStop就执行传入的onStope函数
    it('onStop', () => {
        let dummy;
        const obj = reactive({
            foo: 1,
        });
        const onStop = jest.fn()
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            {
                onStop
            })
        stop(runner);
        expect(onStop).toHaveBeenCalledTimes(1)
    });
})