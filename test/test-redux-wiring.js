/**
 * Created by Praveen on 11/09/2015.
 */

import { createStore } from 'redux';
import deviceReducer from '../js/reducers/reducers';
import { addDevice } from '../js/actions/actionCreators';

let store = createStore(deviceReducer);

console.log(store.getState());

store.subscribe(() =>
    console.log(store.getState())
);

store.dispatch(addDevice({ 'id': 1, 'name': 'Name' }));
store.dispatch(addDevice({ 'id': 2, 'name': 'Name2' }));








