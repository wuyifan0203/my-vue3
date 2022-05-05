import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe('ref', () => {
    it('happy path', () => {
        const a = ref(1);
        expect(a.value).toBe(1);
    });

    it('should be ref', () => {
        const a = ref(1);
        let dummy = 1;
        let count = 0;
        effect(()=>{
            count++;
            dummy = a.value;
        })
        expect(count).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(count).toBe(2);
        expect(dummy).toBe(2);
        // same value should not be trigger
        a.value = 2;
        expect(count).toBe(2);
        expect(dummy).toBe(2);
    });

    it('should make nestd properties reactive', () => {
        const a = ref({
            count :1
        })
        let dummy;
        effect(()=>{
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
        
    });
    
    //功能 ：判断是否为ref对象
    it('isRef', () => {
        const a = ref(1);
        const b =  reactive({
            age:1
        });
        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(b)).toBe(false);
    });

     //功能 ：如果为ref，返回value，如果不是则返回本身
    it('unRef', () => {
        const a = ref(1);
        expect(unRef(a)).toBe(1);
        expect(unRef(1)).toBe(1);
    });
    
    //功能：使用ref对象不用.value
    //用于在template中使用ref对象
    it('proxyRefs', () => {
        const user = {
            age:ref(24),
            name:'Wu'
        }
        const proxyUser = proxyRefs(user);
        // test get
        expect(user.age.value).toBe(24);
        expect(proxyUser.age).toBe(24);
        expect(proxyUser.name).toBe('Wu'); 

        // test set
        proxyUser.age = 20;
        expect(proxyUser.age).toBe(20);
        expect(user.age.value).toBe(20);

        proxyUser.age = ref(23);
        expect(proxyUser.age).toBe(23);
        expect(user.age.value).toBe(23);
    });
    
});
