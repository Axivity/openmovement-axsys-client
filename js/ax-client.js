/**
 * Created by Praveen on 09/09/2015.
 *
 * This is a facade for Axsys API - you could add any internal transformations required for the app here.
 */

export default class AXApi {
    constructor(onDeviceAdded,
                onDeviceRemoved,
                onConnected,
                onDisconnected,
                onAttributesDataPublished) {

        this.api = new AX.API(
            onDeviceAdded,
            onDeviceRemoved,
            onConnected,
            onDisconnected,
            onAttributesDataPublished);
    }

    getDevices(callback) {
        this.api.getDevices((payload) => {
            callback(payload)
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

    publish(options, callback) {
        this.api.publish(options, (data) => {
            callback(data);
        });
    }

    getServerTimeFunction() {
        let self = this;
        return () => {
            return self.api.getCurrentTime();
        }
    }

    addDataListenerForDevice(devicePath, cb) {
        // This will replace any existing listeners as well
        this.api.addDataListenerForDevice(devicePath, cb);
    }

}


