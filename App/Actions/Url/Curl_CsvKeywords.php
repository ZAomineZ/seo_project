<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 27/09/19
 * Time: 03:00
 */

namespace App\Actions\Url;


class Curl_CsvKeywords
{
    /**
     * @param $ch
     * @param $option
     * @param $value
     * @return bool
     */
    private function CurlSetopt($ch, $option, $value)
    {
        return curl_setopt($ch, $option, $value);
    }

    /**
     * @param $ch
     * @param string $domain
     */
    private function getCurlSetopt($ch, string $domain)
    {
        $this->CurlSetopt($ch, CURLOPT_URL, "https://online.seranking.com/research.organic.html?ajax=exportKeywordsTable&source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&order_field=traffic&order_type=DESC&type_export=csv&");
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    }

    /**
     * @param array $headers
     * @param string $domain
     * @return array
     */
    private function getHeaders(array $headers = [], string $domain): array
    {
        $headers[] = 'Authority: online.seranking.com';
        $headers[] = 'Accept: application/json, text/javascript, */*; q=0.01';
        $headers[] = 'Sec-Fetch-Dest: empty';
        $headers[] = 'X-Requested-With: XMLHttpRequest';
        $headers[] = 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36';
        $headers[] = 'Sec-Fetch-Site: same-origin';
        $headers[] = 'Sec-Fetch-Mode: cors';
        $headers[] = "Referer: https://online.seranking.com/research.organic.html?source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&page=1&page_size=50&order_field=traffic&order_type=DESC&";
        $headers[] = 'Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7';
        $headers[] = "Cookie: PHPSESSID=muhgsojmhimfe9girmpmsj61rc; _gcl_au=1.1.1854575438.1582024036; _fbp=fb.1.1582024036485.1617622220; _lo_uid=120485-1582024037937-8a50ffd6872d3def; __lotl=https%3A%2F%2Fseranking.com%2F; device-source=https://seranking.com/; _ym_uid=1582024053702245396; _ym_d=1582024053; device-referrer=https://online.seranking.com/research.html?input=$domain&do=find&source=fr&filter=undefined; __lotr=https%3A%2F%2Fwww.google.com%2F; _ga=GA1.3.1250590664.1582024036; UID=647284; visid_incap_2132269=gArv7rYpTCW1Fo3RKYl/SXd7Tl4AAAAAQUIPAAAAAABq/aOolpZvtE9G3spIIu2N; incap_ses_392_2132269=PwOvRmogIm4fuUvK4KpwBXd7Tl4AAAAAuZLaqegnFDHjP4KswdKm3Q==; GKD=%97%B5%A5%D7%94%CF%84r%9D%B9%A1%95%BD%B2%A0%DC%9D%AE%89%B6%95%A8%A9%D8%94%AC%94r%91%B9%AC%CA%B0%D5%A1%CF%9C%98%9Dr%95%B5%B4%A8; s_fid=450D09C5CA180D0A-13881BD90C0E8F88; s_cc=true; helpcrunch.com-seranking-1145-helpcrunch-device={\"id\":25030529,\"secret\":\"9kU1h3INomIvyKoEUVeFTUeAs6tKgyb9qamJtFkRER4juzyGShguw6i+4/7PrAAU5GA8y8OO68rdS7I0fTiVNQ==\",\"sessions\":3}; helpcrunch.com-seranking-166-helpcrunch-device={\"id\":25030531,\"secret\":\"BHgBEqByPmp/TpKyY4+XQH6eaY2cu2bMGahccqPfvLCMq6dPexQgRHra6IrD9wud6u7AEZFvhMe7D/AIO1t0oA==\",\"sessions\":6}; _lo_v=6; _gid=GA1.2.910858634.1582539870; _gid=GA1.3.910858634.1582539870; research_au=a1730f2ec8460d0c89c3be190e7b53a7578d04; _pk_ref.7.7189=%5B%22%22%2C%22%22%2C1582811985%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.7.7189=1; _dc_gtm_UA-48138194-1=1; _ym_visorc_22102555=w; _ym_isad=2; auto_login_cookie=8f2ecd0db03c101a63e2df28412cacf6; _pk_id.7.7189=d52eb2183d610865.1582024036.25.1582812023.1582811985.; _ga=GA1.1.1250590664.1582024036; _ga_XH80JYLKJ9=GS1.1.1582811984.8.1.1582812022.0; _gat_UA-48138194-1=1; _gali=r2";
        return $headers;
    }

    /**
     * @param string $domain
     * @return bool|string
     */
    public function run(string $domain)
    {
        // Start Curl With curl_init
        $ch = curl_init();

        // We defined our options with CurlSetopt
        $this->getCurlSetopt($ch, $domain);

        // Header Curl
        $headers = [];
        $headers = $this->getHeaders($headers, $domain);
        $this->CurlSetopt($ch, CURLOPT_HTTPHEADER, $headers);

        // Enjoy the result json if not error detected !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        return curl_exec($ch);
    }
}
