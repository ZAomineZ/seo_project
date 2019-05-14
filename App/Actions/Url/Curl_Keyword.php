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
    private function CurlSetopt ($ch, $mode, $value)
    {
        return curl_setopt($ch, $mode, $value);
    }

    /**
     * @param $ch
     * @param string $domain
     */
    private function CurlSet ($ch, string $domain)
    {
        $this->CurlSetopt($ch, CURLOPT_URL, 'https://fr.semrush.com/fr/info/' . $domain);
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    }

    /**
     * @param array $headers
     * @param string $domain
     * @return array
     */
    private function CurlSetHeaders(array $headers = [], string $domain)
    {
        $headers[] = 'Authority: fr.semrush.com';
        $headers[] = 'Cache-Control: max-age=0';
        $headers[] = 'Upgrade-Insecure-Requests: 1';
        $headers[] = 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36';
        $headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3';
        $headers[] = 'Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7';
        $headers[] = "Cookie: ref_code=15200283; marketing=%7B%22user_cmp%22%3A%22%22%2C%22user_label%22%3A%22%22%7D; db_date=current; visit_first=1536183951000; firstVisitLangPopover=1539848670872; insp_uid=2599517799; cfduid=d87ec02def0fa0f3fc23b959207c7098d1541534908; _ga=GA1.2.1436480744.1541534910; userdata=%7B%22tz%22%3A%22GMT+1%22%2C%22ol%22%3A%22fr%22%7D; cookies_notification=accepted; sem_user_voice=min; referer_url=https%3A%2F%2Fwww.google.fr%2F; zlcmid=pUhoDyGLsEAOML; _gcl_au=1.1.1933707709.1549380294; _fbp=fb.1.1549380295283.270533753; insp_ss=1550397568906; db=fr; auth_token=4oTCXbSXK71gnUHs8BncLXtSwK2GMDu3qaEtpx2VXod0MSCKlN8t9ZcAl4XK; usertype=Free-User; _ga=GA1.3.1436480744.1541534910; PHPSESSID=llgwlgx0n7b90qfnd2rcx3k9qjtyy17q; n_userid=LuWkzVy0dWwBTQAoBrIsAg==; _gid=GA1.2.1541287717.1555330417; community_layout=hi94f34uaue88m7d4k998mu2e2; XSRF-TOKEN=pklR9SMtayeuxE4lSDpv97bLrsHImkMG6zj6kkhV; community-semrush=PvcNgPPARWIVnRL3u2enMLBfBYvkA42WTCVCscrS; insp_wid=206492775; insp_nv=false; insp_targlpu=aHR0cHM6Ly9mci5zZW1ydXNoLmNvbS9mci9pbmZvL2NvbG9vcmkuY29t; confirmation_back_url=https%3A%2F%2Ffr.semrush.com%2Ffr%2Finfo%2F$domain; insp_slim=1555332039602";
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
