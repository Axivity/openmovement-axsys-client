/**
 * Created by Praveen on 15/12/2015.
 *
 * @flow
 */

import {getUniqueKeyFromString} from './utils/token-utils';
import AXApi from './ax-client';

export class ProcessOptions {
    constructor(name:string, args:Array<string>, key:string, devicePath:string) {
        this.name = name;
        this.args = args;
        this.key = key;
        this.path = devicePath;
    }
}


/**
 *
 * @param name
 * @param args
 * @param devicePath
 * @returns {string}
 */
export function getUniqueKey(name: string, args: Array<string>, devicePath:string) : string {
    let str = name;

    args.forEach((arg) => {
        str += arg;
    });

    if(devicePath !== undefined) {
        str += devicePath;
    }

    return getUniqueKeyFromString(str);
}


/**
 *
 * @param options
 * @param api
 */
export function createProcess(options: ProcessOptions, api: AXApi) {
    api.createProcess(options, (data) => {
        console.log('Created Process');
        console.log(data);
    })

}


/**
 *
 */
function onProcessUpdated() {
    // TODO: Make this as a global listener for processes.
}