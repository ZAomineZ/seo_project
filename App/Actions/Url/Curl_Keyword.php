<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/04/19
 * Time: 20:30
 */

namespace App\Actions\Url;

class Curl_Keyword
{

    /**
     * @param $ch
     * @param $mode
     * @param string $value
     * @return bool
     */
    private function CurlSetopt ($ch, $mode, $value) : bool
    {
        return curl_setopt($ch, $mode, $value);
    }

    /**
     * @param $ch
     * @param string $domain
     */
    private function CurlSet ($ch, string $domain)
    {
        $this->CurlSetopt($ch, CURLOPT_URL, "http://api.scraperapi.com/?api_key=dbb9dfa69dd802f374bb567981665ddb&url=https://fr.semrush.com/fr/info/$domain&keep_headers=true");
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
        $this->CurlSetopt($ch, CURLOPT_HEADER, FALSE);
    }

    /**
     * @param array $headers
     * @param string $domain
     * @return array
     */
    private function CurlSetHeaders(array $headers = [], string $domain) : array
    {
        $headers[] = 'Authority: fr.semrush.com';
        $headers[] = 'X-MyHeader: 123';
        $headers[] = 'Cache-Control: max-age=0';
        $headers[] = 'Upgrade-Insecure-Requests: 1';
        $headers[] = 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36';
        $headers[] = 'Accept: application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3';
        $headers[] = 'Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7';
        $headers[] = "cookie: __cfduid=deeec7758e2037c5181d963bc5b6561321560777092; ref_code=__default__; _ga=GA1.2.1768315721.1560777094; _fbp=fb.1.1560777094707.651669042; marketing=%7B%22user_cmp%22%3A%22%22%2C%22user_label%22%3A%22%22%7D; db_date=current; userdata=%7B%22tz%22%3A%22GMT+2%22%2C%22ol%22%3A%22fr%22%7D; visit_first=1639898147; utz=Europe%2FLuxembourg; tracker_ai_user=F1GDl|2019-06-18T08:13:43.429Z; mindboxDeviceUUID=201d293c-7a9d-4031-aba9-f39ad7a8ca47; directCrm-session=%7B%22deviceGuid%22%3A%22201d293c-7a9d-4031-aba9-f39ad7a8ca47%22%7D; cookies_notification=accepted; confirmation_back_url=https%3A%2F%2Ffr.semrush.com%2Ffr%2Finfo%2F$domain; __zlcmid=tFiNfpkrfqvpnS; localization=%7B%22locale%22%3A%22fr%22%2C%22db%22%3A%22fr%22%7D; _ga=GA1.3.1768315721.1560777094; _gcl_au=1.1.2094215161.1568923276; n_userid=LuWkzV2R37qXxwAMCHvZAg==; community_layout=cf5feufjqtjj13nb88tn47agd5; uvts=c37710e8-3786-40c8-4029-d7e09340e176; db=fr; semrush_counter_cookie=deleted; usertype=Free-User; io=abqmwQRkHUKdI397ABtb; blog_split=C; sso_token=a02c2ffa58d0c37db14b03c88bfe527502292f8ecc782f74c949c7e2b2263f11; __upin=1bMf8GpExQatTtKkxoaqaw; __insp_uid=1943962101; __cflb=1796434593; PHPSESSID=kzzv7l1kcp0xyf3v0fsnesj03iv6ugt9; SSO-JWT=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJrenp2N2wxa2NwMHh5ZjN2MGZzbmVzajAzaXY2dWd0OSIsImlhdCI6MTU3MTQ2ODE5NiwiaXNzIjoic3NvIiwidWlkIjoyNjE2MjI4fQ.aJfhKCfhlfkYTCnSaNsVLQzgYJS9XdrJh4QcVm8BRHWELUObaBIIipq93eDn3p7BZ73GyzAmbVse-mk5hOFuxQ; _gid=GA1.2.550279540.1571468198; _gac_UA-6197637-22=1.1571468198.CjwKCAjwxaXtBRBbEiwAPqPxcBm9j2so4TjcA9DaMeCa06MnbIu73vRfUjWEgRjpjz6yb1ASZYZVshoCzGAQAvD_BwE; _gcl_aw=GCL.1571468198.CjwKCAjwxaXtBRBbEiwAPqPxcBm9j2so4TjcA9DaMeCa06MnbIu73vRfUjWEgRjpjz6yb1ASZYZVshoCzGAQAvD_BwE; referer_purchase=https%3A%2F%2Fwww.google.com%2F; _derived_epik=dj0yJnU9cGZEQThqSWtwVXdDZXJ5VFU5NEdoR3hSNnRKcS1nbmMmbj0zZG9aNzlHcVJEMzZPVHNXb19qbXFRJm09MSZ0PUFBQUFBRjJxczZjJnJtPTEmcnQ9QUFBQUFGMnFzNmM; lux_uid=157146820545507152; community-semrush=V7smLTAWfJFzNy9N47cHPuJTl5T8zu2QdTkXoUfy; webinars_session=lrgLHu2DjdrVDGeD7LxdxJr8dnfy6i8KCQNvKVIM; _gat=1; _derived_epik=dj0yJnU9Vkc2ekNJRy1ObER6eE1QOHUyamFUWDJnRzJkUkMyZ3Mmbj1PTFI0bHEzaGwtWnZNVTJmdGlaNzV3Jm09MSZ0PUFBQUFBRjJxdG04JnJtPTEmcnQ9QUFBQUFGMnF0bTg; XSRF-TOKEN=G3EFk6IBc0WBQvO01UU7Ihj7BdJ8eRCW46339SIi; __insp_wid=1764246400; __insp_nv=false; __insp_targlpu=aHR0cHM6Ly9mci5zZW1ydXNoLmNvbS9mci9pbmZvL2NvbG9vcmkuY29t; __insp_targlpt=Y29sb29yaS5jb20gLSBSYXBwb3J0IGdsb2JhbCBkdSBkb21haW5l; __insp_pad=1; __insp_sid=2661729222; __insp_slim=1571468915062; __insp_mslc=1325";
        return $headers;
    }

    /**
     * @param string $domain
     * @return mixed
     */
    public function Curl (string $domain)
    {
        // Init Curl and Use Method CurlSet for CURL an URL with the options !!!
        $ch = curl_init();
        $this->CurlSet($ch, $domain);

        // Initialise the header to CURL !!!
        $header = [];
        $this->CurlSetHeaders($header, $domain);

        // Use CurlSetHearder Method with the mode CurlSetopt CURLOPT_HTTPHEADER
        // and return the headers in the request !!!
        $this->CurlSetopt($ch,CURLOPT_HTTPHEADER, $this->CurlSetHeaders($header, $domain));

        //Error $ch verification to URL CURL !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }

        //Execute the CURL !!!
        return curl_exec($ch);
    }
}
