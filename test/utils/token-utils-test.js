/**
 * Created by Praveen on 14/12/2015.
 */

import {expect} from 'chai';

import * as ls from 'local-storage';

import * as tokenUtils from '../../js/utils/token-utils';

const STATIC_TOKEN = '1234567890';

describe('Token utils', () => {

    describe('when asked for a token when one is already created', () => {
        it('should return existing token', () => {
            ls.set(tokenUtils.CLIENT_TOKEN_KEY, STATIC_TOKEN);
            expect(tokenUtils.getClientTokenFromLocalStorage()).to.equal(STATIC_TOKEN);

        });

    });

    describe('when asked for a token when not created previously or deleted', () => {
        it('should create a new token and return it', () => {
            ls.remove(tokenUtils.CLIENT_TOKEN_KEY);
            let newToken = tokenUtils.getClientTokenFromLocalStorage();
            console.log(newToken);
            expect(newToken).to.not.equal(STATIC_TOKEN);

        }) ;
    });

});