/**
 * Created by Praveen on 14/12/2015.
 */

import * as crypto from 'crypto';
import * as ls from 'local-storage';

export const CLIENT_TOKEN_KEY = 'client-token';

/**
 *
 * @returns {string}
 */
export function createClientToken(text) : string {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 *
 * @returns {*}
 */
export function getClientTokenFromLocalStorage() : string {
    let token = ls.get(CLIENT_TOKEN_KEY);

    if(token !== null) {
        return token;

    } else {
        let newToken = createClientToken(Date.now().toString());
        ls.set(newToken);
        return newToken;

    }
}