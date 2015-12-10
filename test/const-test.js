/**
 * Created by Praveen on 07/12/2015.
 */

function appendNew() {
    return "boo=" + new Date();
}

const COMMANDS = {
    command: appendNew
};


describe("const keyword variables", () => {

    describe("when used with dynamic values returned by a function execution", () => {

        it("will change the value each time the const variable is accessed?", (done) => {
            console.log(COMMANDS.command());
            let runner = setTimeout(() => {
                console.log(COMMANDS.command() + " ");
                clearTimeout(runner);
                done();
            }, 500);
        });

    });

});