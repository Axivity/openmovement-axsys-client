/**
 * Created by Praveen on 11/12/2015.
 */

import * as actionTypes from '../constants/actionTypes';

/*
 let notifications = [
 {
 id: 1,
 title: 'Info',
 message: 'Upgraded system software version',
 timeOut: 1000,
 type: 'info'

 },
 {
 id: 2,
 title: 'Success',
 message: '14666 - Device Configured ',
 timeOut: 2000,
 type: 'success'
 },
 {
 id: 3,
 title: 'Success',
 message: '16746 - Device Configured ',
 timeOut: 1000,
 type: 'success'
 },
 {
 id: 4,
 title: 'Warning',
 message: '17383 - Device is already stopped ',
 timeOut: 3000,
 type: 'warning'
 },
 {
 id: 5,
 title: 'Error',
 message: '17383 - Device cannot be reached, please plug it out and try again',
 timeOut: 1000,
 type: 'error'
 }

 ];

 let handleRequestHide = (notification) => {
 notifications = notifications.filter(n => n.id !== notification.id);
 };
 */

export function notifications(state = [], action = null) {
    switch (action.type) {
        case actionTypes.ADD_NOTIFICATION:
            return [...state, action.notification];

        case actionTypes.REMOVE_NOTIFICATION:
            let filteredNotifications = state.filter(n => n.id !== action.notification.id);
            return filteredNotifications;

        default:
            return state;
    }
}