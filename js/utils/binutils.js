/**
 * Created by Praveen on 21/10/2015.
 */


export function bufferToString(buff) {
    // buff.data is websocket dependent!!
    return String.fromCharCode.apply(null, new Uint8Array(buff));
}
