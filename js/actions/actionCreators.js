/**
 * Created by Praveen on 11/09/2015.
 */

import { ADD_DEVICE } from '../constants/actionTypes';


export function addDevice(device) {
    return {
        type: ADD_DEVICE,
        device
    };

}