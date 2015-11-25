/**
 * Created by Praveen on 20/10/2015.
 *
 * @flow
 */

import moment from 'moment';

import * as binUtils from './binutils';
import * as stringUtils from './string-utils';

//const TIMEOUT_IN_SECONDS = 10;
//
//const WRITTEN = Symbol();
//
//const WRITTEN_AND_READ = Symbol();

// TODO: This constant should probably live in a separate constants module!
export const END_OF_LINE = '\r\n';

export class CommandOptions {
    constructor(options: object, callback: (param: T) => any) {
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


export class DeviceCommandQueue {
    constructor(devicePath:string,
                api:object,
                dataListener: (obj: {buffer: ArrayBuffer; updatedEpoch: number}) => void) {
        this.devicePath = devicePath;
        this.commands = [];
        this.api = api;
        this.checkFrequencyInMilliSeconds = 1000;
        this.dataListener = dataListener;
        //this.checker = null;
        this.dataBuffer = new ArrayBuffer(0);
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

    addCommand(commandWithOptions:CommandOptions) {
        this.commands.push(commandWithOptions);
    }

    isEmpty() {
        return (this.commands.length === 0);
    }

    _addDataToBuffer(buffer) {
        let temp = new Uint8Array(this.dataBuffer.byteLength + buffer.byteLength);
        temp.set(new Uint8Array(this.dataBuffer));
        temp.set(new Uint8Array(buffer), this.dataBuffer.byteLength);
        this.dataBuffer = temp.buffer;
    }

    wrappedDataListener (response) {
        if(response) {
            let chunk = response.buffer.data;

            let indexPositionCRLFStart = binUtils.findEOLStartIndex(chunk);
            // These must be continuous
            let indexPositionCRLFEnd = indexPositionCRLFStart + 1;

            if(indexPositionCRLFStart > -1) {
                // CRLF is in chunk
                let dataBuffTillCRLF = binUtils.getDataTillIndexPosition(chunk, indexPositionCRLFStart);
                let dataBuffFromCRLF = binUtils.getDataFromIndexPosition(chunk, indexPositionCRLFEnd);

                this._addDataToBuffer(dataBuffTillCRLF);

                // TODO: Need to handle carriage return and line feed characters sent in different chunks

                // set the buffer to dataBuffer
                response.buffer = this.dataBuffer;

                // reinit dataBuffer
                this.dataBuffer = new ArrayBuffer(0);
                this.dataBuffer = dataBuffFromCRLF;

                // call the original listener with full data till end of line
                this.dataListener(response);
            }

        }
    }

    // NB: No check needed for timeout - checked with @Dan
    //ifCommandHasNotReturnedWithinTimeOutMarkAsDone() {
    //    let endTime = moment().add(TIMEOUT_IN_SECONDS, 'second');
    //    this.checker = setInterval(() => {
    //        if(this.writingCommand) {
    //            let current = moment();
    //            if (current >= endTime) {
    //                console.warn('Command did not finish execution within timeout on ' +  this.devicePath);
    //
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