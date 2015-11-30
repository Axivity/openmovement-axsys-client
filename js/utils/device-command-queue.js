/**
 * Created by Praveen on 20/10/2015.
 *
 * @flow
 */

import moment from 'moment';

import * as binUtils from './binutils';
import * as stringUtils from './string-utils';
import {checkResponse} from '../constants/commandResponseTypes';
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

// TODO: Hate how this has become a god class - can we just refactor it into plain functions?
export class DeviceCommandQueue {
    constructor(devicePath:string,
                api:object,
                commandOptions: Array<CommandOptions>,
                dataListener: (obj: {buffer: ArrayBuffer; updatedEpoch: number}) => void) {
        this.devicePath = devicePath;
        this.commands = [];
        this.commandsAwaitingResponse = [];
        this.api = api;
        this.checkFrequencyInMilliSeconds = 1000;
        this.dataListener = dataListener;
        this.dataBuffer = new ArrayBuffer(0);
        // replacing ondatareceived data listener
        this.api.addDataListenerForDevice(this.devicePath, this.wrappedDataListener.bind(this));
        this.runner = null;
        this.checker = null;
        this.connected = false;
        this.commandOptions = commandOptions;
        this.commandsResponded = [];

        this.connectToDevice(() => {
            this.addAllCommands();
        });
    }

    start() {
        this.runner = setInterval(() => {
            this.run();
        }, this.checkFrequencyInMilliSeconds);
    }

    addAllCommands() {
        this.commandOptions.map((command) => {
            this.addCommand(command);
        });

    }

    connectToDevice(cb) {
        var self = this;
        let options = {};
        options.path = this.devicePath;
        this.api.connect(options, () => {
            console.log('Connected to device');
            self.connected = true;
            cb();
        });
    }

    run() {
        if (this.connected && !this.isEmpty()) {
            let commandOptions = this.commands.pop();
            let options = commandOptions.options;

            // Write command
            this.api.write(options, () => {
                console.log('Written command' + commandOptions);
                // NB: mark the command written and keep a check
                // on whether response has come back
                this.commandsAwaitingResponse.push(commandOptions);
                if(this.allCommandsWritten()) {
                    this.checkForResponsesAndCloseConnection();
                }
                commandOptions.callback();
            });
        }
    }

    allCommandsWritten() {
        return (this.commandsAwaitingResponse.length === this.commandOptions.length);
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
        console.log('Called wrapped data listener');
        console.log(response);
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

                let returnedString = binUtils.bufferToString(response.buffer);
                let matchedResponseType = checkResponse(returnedString);

                response.response = matchedResponseType;
                response.string = returnedString;

                if(matchedResponseType!==null) {
                    console.log(this.commandsAwaitingResponse);
                    this.addCommandToRespondedList(matchedResponseType);
                }

                // call the original listener with full data till end of line
                this.dataListener(response);

            }

        }
    }

    addCommandToRespondedList(responseType){
        this.commandsResponded.push(responseType);
    }

    allCommandsResponded() {
        return (this.commandsResponded.length === this.commandsAwaitingResponse.length);
    }

    checkForResponsesAndCloseConnection() {
        this.checker = setInterval(() => {
            let options = {};
            options.path = this.devicePath;

            console.log(this.devicePath);
            console.log(this.commandsAwaitingResponse);
            console.log(this.commandsResponded);
            if(this.connected && this.allCommandsResponded()) {
                clearInterval(this.checker);
                this.api.disconnect(options, () => {
                    console.log('Closed connection to device ' + this.devicePath);
                });
            }
        }, 1000);
    }

}

