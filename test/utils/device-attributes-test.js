/**
 * Created by Praveen on 12/11/2015.
 */

import {expect} from 'chai';

import * as deviceAttributesHelper from '../../js/utils/device-attributes';

describe('Device attributes', () => {

    describe('when device attributes are not set', () => {

        it('should be possible to get list of devices with attributes not set', () => {

            let devices = {
                path1: {
                    a: 'a',
                    b: 'b'
                },
                path2: {
                    a: 'a',
                    b: 'b',
                    c: {
                        updatedEpoch: 123456789
                    }
                }
            };

            let attributes = [
                {
                    name: 'c',
                    frequency: 0

                },
                {
                    name: 'd',
                    frequency: 60
                }
            ];

            let devicesWithNoAttributes = deviceAttributesHelper.getDevicesWithAttributesNotSet(
                                            devices, attributes, () => { return 123456780});


            let expectedPath1 = [ { name: 'c', frequency: 0 }, { name: 'd', frequency: 60 } ];
            let expectedPath2 = [ { name: 'd', frequency: 60 } ];

            expect(devicesWithNoAttributes['path1']).to.equal(expectedPath1);
            console.log(devicesWithNoAttributes['path1']);

            expect(devicesWithNoAttributes['path2']).to.equal(expectedPath2);
            console.log(devicesWithNoAttributes['path2']);
        });

    });

});
