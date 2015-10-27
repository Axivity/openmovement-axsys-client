/**
 * Created by Praveen on 21/10/2015.
 */

import {expect} from 'chai';

import {DeviceQueue, END_OF_LINE} from '../../js/utils/device-queue';

describe('With Device Queue', () => {

    describe('when data is received in callback', () => {

        let q = new DeviceQueue('serial://sample-path', {
            // this is a mock to get around replacing data listener
            'replaceDataListener': () => {console.log('Called replace')}

        }, (response) => {
            // this is a mock data listener function
            console.log(response);
        });

        it('should add data to the data buffer ', () => {
            let dataArr = ['b', 'o', 'o'].map((s) => {
                return s.charCodeAt(0);
            });
            let arr = new Uint8Array(dataArr);

            q._addDataToBuffer(arr);
            expect(q.dataBuffer.length).to.equal(3);

        });

        it('should append data to the data buffer when data is already present in data buffer', () => {
            let dataArr = ['f', 'o', 'o'].map((s) => {
                return s.charCodeAt(0);
            });
            let arr = new Uint8Array(dataArr);

            q._addDataToBuffer(arr);
            expect(q.dataBuffer.length).to.equal(6);

        });

        it('should clear data buffer once carriage return or EOL is received', () => {
            let dataArr = ['\r', '\n'].map((s) => {
                return s.charCodeAt(0);
            });

            let response = {
                buffer: {
                    data: dataArr
                }
            };

            q.wrappedDataListener(response);
            expect(q.dataBuffer.length).to.equal(0);

        });

    });

} );