/* eslint-disable */

export default class Cookie
{
    /**
     * Create cookie User Auth If We reseted The Cookie in progress !!!
     * @param name_cookie
     * @param value_cookie
     * @param expire_days
     * @returns {string}
     * @constructor
     */
    static SetCookie (name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    /**
     * Recuperate Cookie User
     * @param name_cookie
     * @returns {string}
     */
   static getCookie = name_cookie => {
        let name = `${name_cookie}=`;
        let cookie = document.cookie.split(';');

        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i].trimStart();
            while (cook.charAt(0) === ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) === 0) {
                return cook.substring(name.length, cook.length);
            }
        }
    };

    /**
     * Reset Cookie User When Invalid Token found in the Request Ajax with Axios
     * @param token
     * @param id
     * @constructor
     */
    static CookieReset(token, id) {
        if (Cookie.getCookie('remember_me_auth')) {
            Cookie.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            Cookie.SetCookie('auth_today', token + '__' + id, 1)
        }
    }
}
