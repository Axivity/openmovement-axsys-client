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


export const MAP_RESPONSES_TO_ATTRIBUTE_NAMES = {

    [ID_RESPONSE_STARTS_WITH]: attributeNames.VERSION,


    [BATTERY_RESPONSE_STARTS_WITH]: attributeNames.BATTERY
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

//export const ATTRIBUTES_PARSER_USING_NAME = {
//
//    [ID_RESPONSE_STARTS_WITH]: (versionType) => {
//        return (data) => {
//            if(versionType === 'hardware') {
//                return data.split(',')[1];
//            } else {
//                return data.split(',')[2];
//            }
//
//        }
//    }
//
//};
