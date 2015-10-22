/**
 * Created by Praveen on 22/10/2015.
 */

import * as attributeNames from './attributeNames';

export const RESPONSES_START_WITH_STRING = {

    // ID Command returns with ID=...
    'ID=': attributeNames.VERSION,

    // Battery command returns with $BATT=
    '$BATT=': attributeNames.BATTERY
};
