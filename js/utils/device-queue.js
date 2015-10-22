/**
 * Created by Praveen on 20/10/2015.
 */

import moment from 'moment';

import * as binUtils from './binutils';

const TIMEOUT_IN_SECONDS = 30;

const WRITTEN = Symbol();

const WRITTEN_AND_READ = Symbol();

const END_OF_LINE = '\r\n';

export class CommandOptions {
    constructor(options, callback) {
        /**
         * Options for holding command and extra attributes for command
         * */
        this.options = options;
        /**
         * Callback should follow node style (err, data) => {} convention
         * for function arguments.
         */
        this.callback = callback;
    }
}


export class DeviceQueue {
    constructor(devicePath, api, dataListener) {
        this.devicePath = devicePath;
        this.commands = [];
        this.api = api;
        this.checkFrequencyInMilliSeconds = 1000;
        this.commandRunning = false;
        this.currentCommand = null;
        this.dataListener = dataListener;
        this.checker = null;
        // replacing ondatareceived data listener
        this.api.replaceDataListener(this.wrappedDataListener.bind(this));
    }

    start() {
        setInterval(() => {
            if (!this.commandRunning && !this.isEmpty()) {
                let commandOptions = this.commands.pop();
                this.currentCommand = commandOptions.options;
                this.api.write(commandOptions.options, () => {
                    commandOptions.callback();
                });
                this.commandRunning = true;
                // No timeout for now
                // TODO: Check with @Dan if timing out is an option and how we handle it?
                this.checkIfCommandHasNotReturnedWithinTimeOutAndMarkAsDone();
            }
        }, this.checkFrequencyInMilliSeconds);
    }

    addCommand(commandWithOptions) {
        this.commands.push(commandWithOptions);
    }

    isEmpty() {
        return (this.commands.length === 0);
    }

    wrappedDataListener (response) {
        if(response) {
            let chunk = response.buffer;
            let data = binUtils.bufferToString(chunk);
            // amend current command options to make any decisions later
            response.commandOptions = this.currentCommand;
            console.log(data);
            if(this.commandRunning) {
                if(data.endsWith(END_OF_LINE)) {
                    if(this.checker) {
                        clearInterval(this.checker);
                    }
                    this.commandRunning = false;
                    //this.currentCommand = null;
                }
            }
            // call the original listener
            this.dataListener(response);
        }
    }

    checkIfCommandHasNotReturnedWithinTimeOutAndMarkAsDone() {
        let endTime = moment().add(TIMEOUT_IN_SECONDS, 'second');
        this.checker = setInterval(() => {
            if(this.commandRunning) {
                if (moment() >= endTime) {
                    console.warn('Command did not finish execution within timeout on ' +  this.devicePath);
                    // We just assume at this point if the command did not return any data
                    // then we just move on to sending next command? What are the possible paths from here??
                    // I can just disconnect the device and pass an error to user!
                    // TODO: Check with @Dan if retrying is a valid thing to do? -
                    this.commandRunning = false;
                    //this.currentCommand = null;
                    //
                    clearInterval(this.checker);
                }

            } else {
                // No command running so clear this checker
                clearInterval(this.checker);
            }

        }, this.checkFrequencyInMilliSeconds);
    }


}