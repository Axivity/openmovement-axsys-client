/**
 * Created by Praveen on 21/10/2015.
 */

import {expect} from 'chai';

import {DeviceCommandQueue, END_OF_LINE} from '../../js/utils/device-command-queue';

describe('With Device Queue', () => {

    describe('when data is received in callback', () => {

        let q = new DeviceCommandQueue('serial://sample-path', {
            // this is a mock to get around replacing data listener
            'replaceDataListener': () => {console.log('Called replace')}

        }, (response) => {
            // this is a mock data listener function
            console.log(response);
        });

        it('should add data to the data buffer ', () => {
            let str = 'boo';
            let dataBuff = new ArrayBuffer(3);
            let dataView = new Uint8Array(dataBuff);
            dataView[0] = str.charCodeAt(0);
            dataView[1] = str.charCodeAt(1);
            dataView[2] = str.charCodeAt(2);

            q._addDataToBuffer(dataBuff);
            expect(q.dataBuffer.byteLength).to.equal(3);
            console.log(q.dataBuffer);

            let dataView2 = new Uint8Array(q.dataBuffer);
            expect(dataView2[0]).to.equal(98) ;
            expect(dataView2[1]).to.equal(111) ;
            expect(dataView2[2]).to.equal(111) ;

        });

        it('should append data to the data buffer when data is already present in data buffer', () => {
            let str = 'boo';
            let dataBuff = new ArrayBuffer(3);
            let dataView = new Uint8Array(dataBuff);
            dataView[0] = str.charCodeAt(0);
            dataView[1] = str.charCodeAt(1);
            dataView[2] = str.charCodeAt(2);

            q._addDataToBuffer(dataBuff);
            expect(q.dataBuffer.byteLength).to.equal(6);

            let dataView2 = new Uint8Array(q.dataBuffer);
            expect(dataView2[0]).to.equal(98) ;
            expect(dataView2[1]).to.equal(111) ;
            expect(dataView2[2]).to.equal(111) ;
            expect(dataView2[3]).to.equal(98) ;
            expect(dataView2[4]).to.equal(111) ;
            expect(dataView2[5]).to.equal(111) ;

        });

        it('should clear data buffer once carriage return or EOL is received', () => {
            let dataBuff = new ArrayBuffer(5);
            let dataView = new Uint8Array(dataBuff);
            let str = '\r\nboo';
            dataView[0] = str.charCodeAt(0);
            dataView[1] = str.charCodeAt(1);
            dataView[2] = str.charCodeAt(2);
            dataView[3] = str.charCodeAt(3);
            dataView[4] = str.charCodeAt(4);

            let response = {
                buffer: {
                    data: dataBuff
                }
            };

            q.wrappedDataListener(response);
            expect(q.dataBuffer.byteLength).to.equal(3);
            let dataView2 = new Uint8Array(q.dataBuffer);
            expect(dataView2[0]).to.equal(98) ;
            expect(dataView2[1]).to.equal(111) ;
            expect(dataView2[2]).to.equal(111) ;

        });

    });

} );