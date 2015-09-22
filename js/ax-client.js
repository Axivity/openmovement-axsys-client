/**
 * Created by Praveen on 09/09/2015.
 */

export default class AXApi {
    constructor(onDeviceAdded,
                onDeviceRemoved,
                onConnected,
                onDisconnected) {

        this.api = new AX.API(
            onDeviceAdded,
            onDeviceRemoved,
            onConnected,
            onDisconnected);
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

}


