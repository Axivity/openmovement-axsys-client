/**
 * Created by Praveen on 13/11/2015.
 * @flow
 */

import {expect} from 'chai';
import * as binUtils from '../../js/utils/binutils';


describe('When binUtils.containsEOL function is called', () => {

    it('should return true if buffer contains CR/LF in sequence', () => {
        let buffer = new ArrayBuffer(16);
        let dataView = new Uint8Array(buffer);

        dataView[0] = 13;
        dataView[1] = 10;

        console.log(dataView);
        let doesContain1 = binUtils.containsEOL(dataView[0], 0, dataView);
        expect(doesContain1).to.equal(false);

        let doesContain2 = binUtils.containsEOL(dataView[1], 1, dataView);
        expect(doesContain2).to.equal(true);

    });

    it('should return false if buffer does not contain CR/LF in sequence', () => {
        let buffer2 = new ArrayBuffer(16);
        let dataView2 = new Uint8Array(buffer2);
        dataView2[1] = 13;
        dataView2[3] = 10;

        let doesContain2 = binUtils.containsEOL(dataView2[1], 1, dataView2);
        expect(doesContain2).to.equal(false);

    });

    it('should return false if buffer does not contain CR/LF characters at all', () => {
        let buffer2 = new ArrayBuffer(16);
        let dataView2 = new Uint8Array(buffer2);

        let doesContain2 = binUtils.containsEOL(dataView2[1], 1, dataView2);
        expect(doesContain2).to.equal(false);

    });

});

describe('When binUtils.findEOLStartIndex is called', () => {

    it('should get the index of EOL character', () => {
        let buffer = new ArrayBuffer(16);
        let dataView = new Uint8Array(buffer);

        dataView[0] = 13;
        dataView[1] = 10;

        let eolIndex = binUtils.findEOLStartIndex(buffer);
        expect(eolIndex).to.equal(0);
    });

    it('should not get the index of EOL character if buffer does not have CR/LF', () => {
        let buffer = new ArrayBuffer(16);
        //let dataView = new Uint8Array(buffer);

        //dataView[0] = 13;
        //dataView[1] = 10;

        let eolIndex = binUtils.findEOLStartIndex(buffer);
        expect(eolIndex).to.equal(-1);
    });

});

describe('When binUtils.getDataTillIndexPosition is called with index position 6 ', () => {

    it('should copy up to position 5 into buffer and return that buffer', () => {

        let copyFromBuffer = new ArrayBuffer(16);
        let dataView = new Uint8Array(copyFromBuffer);
        for(let i=0; i<6; i++) {
            dataView[i] = i + 65;
        }

        dataView[6] = 13;
        dataView[7] = 10;

        let copyToBuffer = binUtils.getDataTillIndexPosition(copyFromBuffer, 6);
        expect(copyToBuffer.byteLength).to.equal(6);

        let copyToDataView = new Uint8Array(copyToBuffer);
        console.log(copyToDataView);

        for(let j=0; j<copyToDataView.length; j++) {
            expect(copyToDataView[j]).to.equal(dataView[j]);
        }

    });

    it('should get an empty buffer back if index position sent is 0', () => {

        let copyFromBuffer = new ArrayBuffer(16);
        let dataView = new Uint8Array(copyFromBuffer);

        dataView[0] = 13;
        dataView[1] = 10;

        let copyToBuffer = binUtils.getDataTillIndexPosition(copyFromBuffer, 0);
        expect(copyToBuffer.byteLength).to.equal(0);

    });

});

describe('When binUtils.getDataFromIndexPosition is called with index position 7', () => {

    it('should copy from position 8 when index position is 7, up to index position 15 into buffer and return buffer', () => {
        let copyFromBuffer = new ArrayBuffer(16);
        let dataView = new Uint8Array(copyFromBuffer);
        dataView[6] = 13;
        dataView[7] = 10;

        for(let i=8; i<dataView.length; i++) {
            dataView[i] = i + 65;
        }

        let copyToBuffer = binUtils.getDataFromIndexPosition(copyFromBuffer, 7);
        expect(copyToBuffer.byteLength).to.equal(8);

        let copyToDataView = new Uint8Array(copyToBuffer);
        console.log(copyToDataView);

        for(let j=0; j<copyToDataView.length; j++) {
            expect(copyToDataView[j]).to.equal(dataView[j + 8]);
        }

    });

});