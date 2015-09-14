/**
 * Created by Praveen on 09/09/2015.
 */

export default class AXApi {
    constructor() {
        this.api = new AX.API();
    }

    getDevices(callback) {
        this.api.getDevices((devices) => {
            callback({
                devices
            })
        });
    }
}


