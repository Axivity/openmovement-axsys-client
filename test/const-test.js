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
            let count = 0;
            let runner = setInterval(() => {
                console.log(COMMANDS.command);

                console.log(COMMANDS.command() + " ");
                console.log(count);
                if(count > 2) {
                    done();
                    clearInterval(runner);
                }
                count += 1;

            }, 500);
        });

    });

});