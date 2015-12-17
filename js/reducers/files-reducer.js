/**
 * Created by Praveen on 16/12/2015.
 */

import * as actionTypes from '../constants/actionTypes';

import {itemPresentAlready} from '../utils/general-utils';

export function files(state = [], action = null) {
    switch (action.type) {
        case actionTypes.ADD_FILE:
            return [...state, action.file];

        default:
            return state;
    }
}


export function selectedFiles(state=[], action=null) {
    switch (action.type) {
        case actionTypes.SELECT_FILE:
            let presentAlready = itemPresentAlready(state, action.file, 'name');
            //console.log('Present already: ' + presentAlready);
            // add device to list of devices in selected state
            if(presentAlready) {
                // TODO: do we replace item or just ignore??
                // For now I'll ignore if it's present already as it
                // is only applicable for selections- but may need
                // revisiting.
                return state;

            } else {
                return [
                    ...state,
                    action.file
                ];
            }

        case actionTypes.DESELECT_FILE:
            // remove device from selected list of devices in state
            return state.filter(file =>
                file.name !== action.file.name
            );

        default:
            return state;
    }
}
