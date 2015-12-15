/**
 * Created by Praveen on 22/10/2015.
 */

/*

 The returned string is $TIME=2015/12/05,12:20:47
 device-command-queue.js:179 The returned string is RATE=74,100
 device-command-queue.js:179 The returned string is SESSION=1
 device-command-queue.js:179 The returned string is HIBERNATE=2015/12/06,00:00:00
 device-command-queue.js:179 The returned string is STOP=2015/12/13,00:00:00
 device-command-queue.js:179 The returned string is FORMAT: Delayed activation.
 device-command-queue.js:179 The returned string is $BATT=715,4189,mV,96,1
 device-command-queue.js:179 The returned string is ID=CWA,17,44,13385,1

 */


import * as attributeNames from './attributeNames';

// Battery command returns with $BATT=
export const BATTERY_RESPONSE_STARTS_WITH = '$BATT=';

// ID Command returns with ID=...
export const ID_RESPONSE_STARTS_WITH = 'ID=';

// Error in response starts with ERROR=...
export const ERROR_RESPONSE_STARTS_WITH = 'ERROR=';

export const TIME_RESPONSE_STARTS_WITH = '$TIME=';

export const RATE_RESPONSE_STARTS_WITH = 'RATE=';

export const SESSION_RESPONSE_STARTS_WITH = 'SESSION';

export const HIBERNATE_RESPONSE_STARTS_WITH = 'HIBERNATE';

export const STOP_RESPONSE_STARTS_WITH = 'STOP';

export const FORMAT_RESPONSE_STARTS_WITH = 'FORMAT';

export const DOWNLOADING_RESPONSE_STARTS_WITH = 'Downloading';

export const MAP_RESPONSES_TO_ATTRIBUTE_NAMES = {

    [ID_RESPONSE_STARTS_WITH]: attributeNames.VERSION,

    [BATTERY_RESPONSE_STARTS_WITH]: attributeNames.BATTERY,

    [TIME_RESPONSE_STARTS_WITH]: attributeNames.TIME,

    [RATE_RESPONSE_STARTS_WITH]: attributeNames.RATE,

    [SESSION_RESPONSE_STARTS_WITH]: attributeNames.SESSION,

    [HIBERNATE_RESPONSE_STARTS_WITH]: attributeNames.HIBERNATE,

    [STOP_RESPONSE_STARTS_WITH]: attributeNames.STOP,

    [FORMAT_RESPONSE_STARTS_WITH]: attributeNames.FORMAT,

    [DOWNLOADING_RESPONSE_STARTS_WITH]: attributeNames.STATUS

};

export function checkResponse (returnedString) {
    let response = null;
    for(let prop in MAP_RESPONSES_TO_ATTRIBUTE_NAMES) {
        if(MAP_RESPONSES_TO_ATTRIBUTE_NAMES.hasOwnProperty(prop)) {
            if(returnedString && returnedString.startsWith(prop)) {
                response = MAP_RESPONSES_TO_ATTRIBUTE_NAMES[prop];
            }
        }
    }
    return response;
}


