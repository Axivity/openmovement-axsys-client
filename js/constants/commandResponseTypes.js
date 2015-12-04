/**
 * Created by Praveen on 22/10/2015.
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

export const MAP_RESPONSES_TO_ATTRIBUTE_NAMES = {

    [ID_RESPONSE_STARTS_WITH]: attributeNames.VERSION,

    [BATTERY_RESPONSE_STARTS_WITH]: attributeNames.BATTERY,

    [TIME_RESPONSE_STARTS_WITH]: attributeNames.TIME,

    [RATE_RESPONSE_STARTS_WITH]: attributeNames.RATE,

    [SESSION_RESPONSE_STARTS_WITH]: attributeNames.SESSION,

    [HIBERNATE_RESPONSE_STARTS_WITH]: attributeNames.HIBERNATE,

    [STOP_RESPONSE_STARTS_WITH]: attributeNames.STOP,

    [FORMAT_RESPONSE_STARTS_WITH]: attributeNames.FORMAT

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


