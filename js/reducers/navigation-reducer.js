/**
 * Created by Praveen on 14/12/2015.
 */

import * as actionTypes from '../constants/actionTypes';

export const CURRENT_VIEW_KEY = 'currentView';

const defaultState = {
    [CURRENT_VIEW_KEY] : 'Devices'
};

export function navigation(state = defaultState, action = null) {
    switch (action.type) {
        case actionTypes.SELECT_NAVIGATION_ITEM:
            return {
                [CURRENT_VIEW_KEY]: action.navigationItemName
            };

        default:
            return state;
    }
}
