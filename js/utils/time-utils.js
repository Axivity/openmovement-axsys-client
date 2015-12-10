/**
 * Created by Praveen on 25/11/2015.
 */
import moment from 'moment';

export const UK_DATE_FORMAT = "DD-MM-YYYY";
export const TIME_FORMAT = "HH:mm:ss";

export const DATE_TIME_FORMAT_IN_DEVICE = "YYYY/MM/DD,HH:mm:ss";
export const DATE_TIME_MIDNIGHT_FORMAT = "YYYY/MM/DD,00:00:00";

export function getFormattedCurrentDateTime(format) {
    let givenDateTime = moment();
    let f = format || DATE_TIME_FORMAT_IN_DEVICE;
    return givenDateTime.format(f);
}

export function getNextDayAtMidnightFromGiven(format) {
    return getMidnightFromNowAndNumberOfDays(1);
}

export function getMidnightFromNowAndNumberOfDays(numberOfDays, format) {
    var givenDateTime = moment();
    var f = format || DATE_TIME_MIDNIGHT_FORMAT;
    return givenDateTime.add(numberOfDays, 'days').format(f);
}

export function getNextHourFromGivenDateAndTime(format) {
    var givenDateTime = moment();
    var f = format || DATE_TIME_FORMAT_IN_DEVICE;
    return givenDateTime.add(1, 'hours').format(f);
}

export function getNextTwoHoursFromGivenDateAndTime(format) {
    var givenDateTime = moment();
    var f = format || DATE_TIME_FORMAT_IN_DEVICE;
    return givenDateTime.add(2, 'hours').format(f);
}

export function getCurrentDateUKLocale() {
    return moment().format(UK_DATE_FORMAT);
}

export function getCurrentTime() {
    return moment().format(TIME_FORMAT);
}