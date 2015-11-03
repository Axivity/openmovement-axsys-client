/**
 * Created by Praveen on 20/10/2015.
 */

import moment from 'moment';

import * as binUtils from './binutils';

const TIMEOUT_IN_SECONDS = 10;

const WRITTEN = Symbol();

const WRITTEN_AND_READ = Symbol();

// TODO: This constant should probably live in a separate module constant!
export const END_OF_LINE = '\r\n';

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
        this.dataListener = dataListener;
        //this.checker = null;

        this.dataBuffer = new Uint8Array(0);
        // replacing ondatareceived data listener
        this.api.replaceDataListener(this.wrappedDataListener.bind(this));
    }

    start() {
        setInterval(() => {
            if (!this.isEmpty()) {
                let commandOptions = this.commands.pop();

                // Write command
                this.api.write(commandOptions.options, () => {
                    commandOptions.callback();
                });
            }
        }, this.checkFrequencyInMilliSeconds);
    }

    addCommand(commandWithOptions) {
        this.commands.push(commandWithOptions);
    }

    isEmpty() {
        return (this.commands.length === 0);
    }

    _addDataToBuffer(buffer) {
        let temp = new Uint8Array(this.dataBuffer.length + buffer.length);
        temp.set(this.dataBuffer);
        temp.set(buffer, this.dataBuffer.length);
        this.dataBuffer = temp;
    }

    wrappedDataListener (response) {
        if(response) {
            let chunk = response.buffer.data;
            this._addDataToBuffer(chunk);

            let data = binUtils.bufferToString(this.dataBuffer);
            //console.log(data);

            // TODO: Check with Dan if this approach will work.
            // Wait till all data is received
            if(data.endsWith(END_OF_LINE)) {
                // set the buffer to dataBuffer
                response.buffer = this.dataBuffer;

                // reinit dataBuffer
                this.dataBuffer = new Uint8Array(0);

                // call the original listener with full data till end of line
                this.dataListener(response);
            }

        }
    }

    //ifCommandHasNotReturnedWithinTimeOutMarkAsDone() {
    //    let endTime = moment().add(TIMEOUT_IN_SECONDS, 'second');
    //    this.checker = setInterval(() => {
    //        if(this.writingCommand) {
    //            let current = moment();
    //            if (current >= endTime) {
    //                console.warn('Command did not finish execution within timeout on ' +  this.devicePath);
    //                // TODO: Check with @Dan if retrying is a valid thing to do? -
    //                this.writingCommand = false;
    //                clearInterval(this.checker);
    //            }
    //
    //        } else {
    //            // No command running so clear this checker
    //            clearInterval(this.checker);
    //        }
    //
    //    }, this.checkFrequencyInMilliSeconds);
    //}


}