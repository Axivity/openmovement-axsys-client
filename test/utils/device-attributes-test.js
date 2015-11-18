/**
 * Created by Praveen on 12/11/2015.
 */

import {expect} from 'chai';

import * as deviceAttributesHelper from '../../js/utils/device-attributes';

describe('Device attributes', () => {

    describe('when device attributes are not set', () => {

        it('should be possible to get list of devices with attributes not set', () => {

            let devices = [
                {
                    z: 'z',
                    y: 'y',
                    _id: 'path1'

                },
                {
                    z: 'z',
                    y: 'y',
                    _id: 'path2'
                }

            ];


            let deviceAttributes = {
                'path1': {
                    a: 'a',
                    b: 'b'
                },
                'path2': {
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
                                            devices,
                                            deviceAttributes,
                                            attributes,
                                            () => { return 123456780}
            );


            let expectedPath1 = [ { name: 'c', frequency: 0 }, { name: 'd', frequency: 60 } ];
            let expectedPath2 = [ { name: 'd', frequency: 60 } ];

            expect(devicesWithNoAttributes['path1']).to.deep.equal(expectedPath1);
            console.log(devicesWithNoAttributes['path1']);

            expect(devicesWithNoAttributes['path2']).to.deep.equal(expectedPath2);
            console.log(devicesWithNoAttributes['path2']);
        });

        it('should return list of devices when deviceattributes object is empty', () => {

            let devices = [
                {
                    z: 'z',
                    y: 'y',
                    _id: 'path1'

                },
                {
                    z: 'z',
                    y: 'y',
                    _id: 'path2'
                }

            ];


            let deviceAttributes = {};

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
                devices,
                deviceAttributes,
                attributes,
                () => { return 123456780}
            );


            let expectedPath1 = [ { name: 'c', frequency: 0 }, { name: 'd', frequency: 60 } ];
            let expectedPath2 = [ { name: 'c', frequency: 0 }, { name: 'd', frequency: 60 } ];

            expect(devicesWithNoAttributes['path1']).to.deep.equal(expectedPath1);
            console.log(devicesWithNoAttributes['path1']);

            expect(devicesWithNoAttributes['path2']).to.deep.equal(expectedPath2);
            console.log(devicesWithNoAttributes['path2']);
        });

    });

    describe('when findDeviceByPath is called', () => {

        it('should return device which matches the given path', () => {

            let devices = [
                {
                    '_id': 'path1',
                    'a': 'a'
                },
                {
                    '_id': 'path2',
                    'a': 'a'
                }
            ];

            let path = 'path1';

            let expected = {
                '_id': 'path1',
                'a': 'a'
            };

            let device = deviceAttributesHelper.findDeviceByPath(devices, path);

            expect(device).to.deep.equal(expected);

        });

    });

});
