/**
 * Created by Praveen on 04/12/2015.
 */

import {expect} from 'chai';

class Test {
    constructor() {}

    add() {
        this.constructor.boo += 1;
    }
}
Test.boo = 1;


describe("In JS class", () => {

    describe("when using statics", () => {

        it("behaves same as java statics", () => {
            let obj1 = new Test();
            obj1.add();
            expect(2).to.equal(obj1.constructor.boo);

            let obj2 = new Test();
            expect(2).to.equal(obj2.constructor.boo);
        });

        it("works even if obj1 and obj2 gets gc'd", () => {
            let obj3 = new Test();
            expect(2).to.equal(obj3.constructor.boo);
        })
    })

});