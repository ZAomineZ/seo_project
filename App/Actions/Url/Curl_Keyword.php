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
        $headers[] = "cookie: __cfduid=deeec7758e2037c5181d963bc5b6561321560777092; ref_code=__default__; _ga=GA1.2.1768315721.1560777094; _fbp=fb.1.1560777094707.651669042; marketing=%7B%22user_cmp%22%3A%22%22%2C%22user_label%22%3A%22%22%7D; db_date=current; userdata=%7B%22tz%22%3A%22GMT+2%22%2C%22ol%22%3A%22fr%22%7D; visit_first=1560777094000; utz=Europe%2FLuxembourg; tracker_ai_user=F1GDl|2019-06-18T08:13:43.429Z; mindboxDeviceUUID=201d293c-7a9d-4031-aba9-f39ad7a8ca47; directCrm-session=%7B%22deviceGuid%22%3A%22201d293c-7a9d-4031-aba9-f39ad7a8ca47%22%7D; cookies_notification=accepted; confirmation_back_url=https%3A%2F%2Ffr.semrush.com%2Ffr%2Finfo%2Fcoloori.com; __zlcmid=tFiNfpkrfqvpnS; localization=%7B%22locale%22%3A%22fr%22%2C%22db%22%3A%22fr%22%7D; _ga=GA1.3.1768315721.1560777094; _gcl_au=1.1.2094215161.1568923276; n_userid=LuWkzV2R37qXxwAMCHvZAg==; community_layout=cf5feufjqtjj13nb88tn47agd5; uvts=c37710e8-3786-40c8-4029-d7e09340e176; db=fr; semrush_counter_cookie=deleted; io=abqmwQRkHUKdI397ABtb; __upin=1bMf8GpExQatTtKkxoaqaw; __insp_uid=1943962101; _gac_UA-6197637-22=1.1571468198.CjwKCAjwxaXtBRBbEiwAPqPxcBm9j2so4TjcA9DaMeCa06MnbIu73vRfUjWEgRjpjz6yb1ASZYZVshoCzGAQAvD_BwE; _gcl_aw=GCL.1571468198.CjwKCAjwxaXtBRBbEiwAPqPxcBm9j2so4TjcA9DaMeCa06MnbIu73vRfUjWEgRjpjz6yb1ASZYZVshoCzGAQAvD_BwE; referer_purchase=https%3A%2F%2Fwww.google.com%2F; _derived_epik=dj0yJnU9cGZEQThqSWtwVXdDZXJ5VFU5NEdoR3hSNnRKcS1nbmMmbj0zZG9aNzlHcVJEMzZPVHNXb19qbXFRJm09MSZ0PUFBQUFBRjJxczZjJnJtPTEmcnQ9QUFBQUFGMnFzNmM; __cflb=3437946050; _gid=GA1.2.984140224.1572276039; _gat=1; XSRF-TOKEN=vk6xeSgdC8N8PcSTtKz0NUbxHlJ1ml0Y2LkUE94G; blog_split=C; __insp_wid=1764246400; __insp_nv=false; __insp_targlpu=aHR0cHM6Ly9mci5zZW1ydXNoLmNvbS9mci9pbmZvL2NvbG9vcmkuY29t; __insp_targlpt=Y29sb29yaS5jb20gLSBSYXBwb3J0IGdsb2JhbCBkdSBkb21haW5l; __insp_norec_howoften=true; __insp_norec_sess=true; PHPSESSID=wlsoqbn40fokr16j39sn4yhklvbpd71m; SSO-JWT=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ3bHNvcWJuNDBmb2tyMTZqMzlzbjR5aGtsdmJwZDcxbSIsImlhdCI6MTU3MjI3NjA1MSwiaXNzIjoic3NvIiwidWlkIjoyNjE2MjI4fQ.3hSOOdBQ_kcL2UoNzQEKoGgrH-VqxMzHTjJmjrHEySYE8XIdzP7cSvYJxS4NWZJeCKl2cmuaauZHq0l_CKBa4g; sso_token=8f5760a2f3e329219f0041d71598659385c5a54e29d7e8d7ceb8ad032b3c3718; usertype=Free-User; _derived_epik=dj0yJnU9T3BYT3lnWHBiU2ZLUmtvelA2MFdxU09HaDdfb3dHYkUmbj1zOTE2bzBmVTd0Z0JZV0pTd1BTQVlBJm09MSZ0PUFBQUFBRjIzQjFZJnJtPTEmcnQ9QUFBQUFGMjNCMVk; __insp_slim=1572276054505; community-semrush=7bZoyABlSrUo0rOLLnKTxFWgpsnoSyHfTGOcYSXK";
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
