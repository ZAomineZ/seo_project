/* eslint-disable */

import Cookie from "./Cookie";

export default class ResponseAjax
{
    /**
     * @param {object} response
     * @constructor
     */
    static ForbiddenResponse(response) {
        if (response.data.error) {
            const token = response.data.token;
            const userID = response.data.id;
            return Cookie.CookieReset(token, userID)
        }
    }
}
