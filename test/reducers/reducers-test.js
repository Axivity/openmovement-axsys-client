/**
 * Created by Praveen on 21/10/2015.
 */

import chai_shallow_deep_equal from 'chai-shallow-deep-equal';
import chai from 'chai';
chai.use(chai_shallow_deep_equal);

import {expect} from 'chai';

import reducer from '../../js/reducers/reducers';
import * as actions from '../../js/actions/actionCreators';


describe('reducers', () => {
    describe('when deviceattribute is passed', () => {
        it('should return new state with deviceattribute assigned for right path', () => {
            let expectedState = {
                'devices': [],
                'deviceAttributes': {
                    'blah://blah': {
                        'boo': 'ID=123,123,922,55'
                    }
                }
            };

            let deviceAttribute = {
                'path': 'blah://blah',
                'attribute': 'boo',
                'value': 'ID=123,123,922,55'
            };

            let currentState = {}; // initial state
            let nextState = reducer(currentState,
                actions.addDataAttributeForDevicePath(deviceAttribute));

            console.log(nextState);
            expect(nextState).to.shallowDeepEqual(expectedState);
        });

        it('should update attribute value in new state for right path', () => {
            let expectedState = {
                'devices': [],
                'deviceAttributes': {
                    'blah://blah': {
                        'boo': 'ID=123,123,922,58'
                    }
                }
            };

            let deviceAttribute1 = {
                'path': 'blah://blah',
                'attribute': 'boo',
                'value': 'ID=123,123,922,55'
            };
            let currentState = {}; // initial state
            let nextState1 = reducer(currentState,
                actions.addDataAttributeForDevicePath(deviceAttribute1));

            let deviceAttribute2 = {
                'path': 'blah://blah',
                'attribute': 'boo',
                'value': 'ID=123,123,922,58'
            };
            let nextState = reducer(nextState1,
                actions.addDataAttributeForDevicePath(deviceAttribute2));

            console.log(nextState);
            expect(nextState).to.shallowDeepEqual(expectedState);

        });

        it('should create new attribute in new state holding to attributes present already for right path', () => {
            let expectedState = {
                'devices': [],
                'deviceAttributes': {
                    'blah://blah': {
                        'boo': 'ID=123,123,922,55',
                        'foo': '$BATT=123,122,100mV,1'
                    }
                }
            };

            let deviceAttribute1 = {
                'path': 'blah://blah',
                'attribute': 'boo',
                'value': 'ID=123,123,922,55'
            };
            let currentState = {}; // initial state
            let nextState1 = reducer(currentState,
                actions.addDataAttributeForDevicePath(deviceAttribute1));

            let deviceAttribute2 = {
                'path': 'blah://blah',
                'attribute': 'foo',
                'value': '$BATT=123,122,100mV,1'
            };
            let nextState = reducer(nextState1,
                actions.addDataAttributeForDevicePath(deviceAttribute2));

            console.log(nextState);
            expect(nextState).to.shallowDeepEqual(expectedState);

        });

        it('should create new path in state if not present already for given path', () => {
            let expectedState = {
                'devices': [],
                'deviceAttributes': {
                    'blah://blah': {
                        'boo': 'ID=123,123,922,55',
                        'foo': '$BATT=123,122,100mV,1'
                    },
                    'blah://blah2': {
                        'boo': 'ID=123,123,922,55',
                        'foo': '$BATT=123,122,100mV,1'
                    }
                }
            };

            let deviceAttribute1 = {
                'path': 'blah://blah',
                'attribute': 'boo',
                'value': 'ID=123,123,922,55'
            };
            let currentState = {}; // initial state
            let nextState1 = reducer(currentState,
                actions.addDataAttributeForDevicePath(deviceAttribute1));

            let deviceAttribute2 = {
                'path': 'blah://blah',
                'attribute': 'foo',
                'value': '$BATT=123,122,100mV,1'
            };

            let nextState2 = reducer(nextState1,
                actions.addDataAttributeForDevicePath(deviceAttribute2));

            let deviceAttribute3 = {
                'path': 'blah://blah2',
                'attribute': 'boo',
                'value': 'ID=123,123,922,55'
            };

            let nextState3 = reducer(nextState2,
                actions.addDataAttributeForDevicePath(deviceAttribute3));

            let deviceAttribute4 = {
                'path': 'blah://blah2',
                'attribute': 'foo',
                'value': '$BATT=123,122,100mV,1'
            };

            let nextState = reducer(nextState3,
                actions.addDataAttributeForDevicePath(deviceAttribute4));


            console.log(nextState);
            expect(nextState).to.shallowDeepEqual(expectedState);

        });

    });

    describe('when selectedDevices is passed', () => {
        it('should return new state with new object', () => {
            let expectedState = {
                'devices': [],
                'deviceAttributes': {},
                'selectedDevices': [
                    { '_id': 'serial://123456', 'mountPoint': 'D:/' }
                ]
            };

            let selectedDevice = {
                '_id': 'serial://123456',
                'mountPoint': 'D:/'
            };

            let initialState = [];
            let nextState = reducer(initialState, actions.selectDevice(selectedDevice));
            console.log(nextState);
            expect(nextState).to.shallowDeepEqual(expectedState);

        });

        it('should return new state without altering state if object present already', () => {
            let expectedState = {
                'devices': [],
                'deviceAttributes': {},
                'selectedDevices': [
                    { '_id': 'serial://123456', 'mountPoint': 'D:/' }
                ]
            };

            let selectedDevice1 = {
                '_id': 'serial://123456',
                'mountPoint': 'D:/'
            };

            let initialState = [];
            let nextState1 = reducer(initialState, actions.selectDevice(selectedDevice1));
            expect(nextState1).to.shallowDeepEqual(expectedState);

            let selectedDevice2 = {
                '_id': 'serial://123456',
                'mountPoint': 'D:/'
            };

            let nextState2 = reducer(nextState1, actions.selectDevice(selectedDevice2));
            console.log(nextState2);
            expect(nextState2).to.shallowDeepEqual(expectedState);

        });


    });
});

