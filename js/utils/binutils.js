/**
 * Created by Praveen on 21/10/2015.
 *
 * @flow
 */

const ASCII_CODE_FOR_LF = 10;
const ASCII_CODE_FOR_CR = 13;


/**
 *
 * @param buff
 * @returns {string}
 */
export function bufferToString(buff) {
    // buff.data is websocket dependent!!
    return String.fromCharCode.apply(null, new Uint8Array(buff));
}


/**
 *
 * @param element
 * @param index
 * @param array
 * @returns {boolean}
 */
export function containsEOL(element: any, index: number, array: Uint8Array){
    if(element === ASCII_CODE_FOR_LF) {
        if(index !==0 && array[index-1]===ASCII_CODE_FOR_CR) {
            return true;
        }
    }
    return false;
}


/**
 *
 * @param buffer
 * @returns {number}
 */
export function findEOLStartIndex(buffer: ArrayBuffer) : number {
    let dataView = new Uint8Array(buffer);

    for(let i=0; i<dataView.length; i++) {
        let doesContain = containsEOL(dataView[i], i, dataView);
        if(doesContain) {
            return (i - 1);
        }
    }

    return -1;
}


/**
 *
 * @param copyFromBuffer
 * @param indexPosition - This is assumed to be same index position as start of the EOL index
 * @returns {ArrayBuffer}
 */
export function getDataTillIndexPosition(copyFromBuffer: ArrayBuffer, indexPosition: number) : ArrayBuffer {
    let copyToBuffer = new ArrayBuffer(indexPosition);

    let copyFromDataView = new Uint8Array(copyFromBuffer);
    let copyToDataView = new Uint8Array(copyToBuffer);

    for(let i=0; i<indexPosition; i++) {
        copyToDataView[i] = copyFromDataView[i];
    }
    return copyToBuffer;
}


/**
 *
 * @param copyFromBuffer
 * @param indexPosition
 */
export function getDataFromIndexPosition(copyFromBuffer: ArrayBuffer, indexPosition: number) : ArrayBuffer {
    let indexOffset = indexPosition + 1; // index is 0 based, length is not
    let copyToSize = copyFromBuffer.byteLength - (indexOffset);
    let copyToBuffer = new ArrayBuffer(copyToSize);

    let copyFromDataView = new Uint8Array(copyFromBuffer);
    let copyToDataView = new Uint8Array(copyToBuffer);

    for(let i=0; i < copyToSize; i++) {
        copyToDataView[i] = copyFromDataView[i + indexOffset];
    }

    return copyToBuffer;
}