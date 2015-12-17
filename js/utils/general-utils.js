/**
 * Created by Praveen on 16/12/2015.
 */


export function itemPresentAlready(listOfObjects, item, itemKey) {
    for(let i=0; i<listOfObjects.length; i++) {
        let obj = listOfObjects[i];
        if(obj[itemKey]) {
            if(obj[itemKey] === item[itemKey]) {
                return true;
            }
        }
    }
    return false;
}