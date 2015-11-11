/**
 * Created by Praveen on 09/09/2015.
 */

export default class AXApi {
    constructor(onDeviceAdded,
                onDeviceRemoved,
                onConnected,
                onDisconnected,
                onDataReceived,
                onAttributesDataPublished) {

        this.api = new AX.API(
            onDeviceAdded,
            onDeviceRemoved,
            onConnected,
            onDisconnected,
            onDataReceived,
            onAttributesDataPublished);
    }

    getDevices(callback) {
        this.api.getDevices((devices) => {
            callback({
                devices
            })
        });
    }

    connect(options, callback) {
        this.api.connect(options, (payload) => {
            callback(payload);
        });
    }

    write(options, callback) {
        this.api.write(options, (payload) => {
            callback(payload);
        });
    }

    disconnect(options, callback) {
        this.api.disconnect(options, (payload) => {
            callback(payload);
        });
    }

    replaceDataListener(fn) {
        this.api.replaceDataListener(fn);
    }

}


