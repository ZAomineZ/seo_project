<?php

namespace App\Actions\Url;

use App\concern\Str_options;

class MultiCurl_UrlTrafficAndKeyword
{
    /**
     * @var array
     */
    private $headers = [];

    /**
     * @param $ch
     * @param $typeCurlOpt
     * @param $value
     * @return bool
     */
    private function curlSetopt($ch, $typeCurlOpt, $value)
    {
        return curl_setopt($ch, $typeCurlOpt, $value);
    }

    /**
     * @param string $value
     * @param int $key
     * @return MultiCurl_UrlTrafficAndKeyword
     */
    private function setHeaders(string $value, int $key): self
    {
        $this->headers[$key][] = $value;

        return $this;
    }

    /**
     * @param int $key
     * @return array
     */
    private function getHeaders(int $key): array
    {
        return $this->headers[$key];
    }

    /**
     * @param $ch
     * @param string $domain
     * @param string $sort
     * @param string $mode
     */
    protected function curlUrl($ch, string $domain, ?string $sort = null, ?string $mode = null): void
    {

        if (is_null($sort)) {
            $sort = '';
        }

        if (is_null($mode)) {
            $mode = '';
        }

        $this->CurlSetopt($ch, CURLOPT_URL, 'https://webmeup.com/backlink/backlinks');
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_POSTFIELDS, "url=$domain&mode=2&count=true&perPage=50&sort=$sort&sortAsc=$mode");
        $this->CurlSetopt($ch, CURLOPT_POST, 1);
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('cookie: utmc=176069412; utmz=176069412.1574375066.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ym_uid=1569310247685040912; _ym_d=1574375066; SWIFT_client=a%3A1%3A%7Bs%3A15%3A%22templategroupid%22%3Bs%3A1%3A%221%22%3B%7D; utma=176069412.1723501803.1574375066.1574375066.1574779005.2; utmt_UA-33243258-1=1; _ym_visorc_23767645=w; _ym_isad=2; PHPSESSID=8ld74d8ong0q7mdupmdeflbeq1; 59db1c1865406acf972686b16458e6cd=232b2c83376c46a9af71418e9feb1f247de49bcca%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22479032%22%3Bi%3A1%3Bs%3A11%3A%22Marie+Donna%22%3Bi%3A2%3Bi%3A604800%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; SWIFT_checkStatus=true; __utmb=176069412.7.10.1574779005', 0)
            ->setHeaders('Origin: https://webmeup.com', 0)
            ->setHeaders('Accept-Encoding: gzip, deflate, br', 0)
            ->setHeaders('Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7', 0)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36', 0)
            ->setHeaders('Content-Type: application/x-www-form-urlencoded; charset=UTF-8', 0)
            ->setHeaders('Accept: application/json, text/plain, */*', 0)
            ->setHeaders('Referer: https://webmeup.com/', 0)
            ->setHeaders('Authority: webmeup.com', 0)
            ->setHeaders('X-Requested-With: XMLHttpRequest', 0);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(0));
    }

    /**
     * @param $ch
     * @param string $domain
     */
    protected function curlKeyword($ch, string $domain): void
    {
        $this->curlSetopt($ch, CURLOPT_URL, "https://online.seranking.com/research.organic.html?ajax=Chart&source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&type=keywords_count&line=organic");
        $this->curlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->curlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->curlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('Authority: online.seranking.com', 1)
            ->setHeaders('Cookie: PHPSESSID=muhgsojmhimfe9girmpmsj61rc; _gcl_au=1.1.1854575438.1582024036; _fbp=fb.1.1582024036485.1617622220; _lo_uid=120485-1582024037937-8a50ffd6872d3def; __lotl=https%3A%2F%2Fseranking.com%2F; device-source=https://seranking.com/; _ym_uid=1582024053702245396; _ym_d=1582024053; device-referrer=https://online.seranking.com/research.html?input=coloriages.info&do=find&source=fr&filter=undefined; __lotr=https%3A%2F%2Fwww.google.com%2F; _ga=GA1.3.1250590664.1582024036; UID=647284; visid_incap_2132269=gArv7rYpTCW1Fo3RKYl/SXd7Tl4AAAAAQUIPAAAAAABq/aOolpZvtE9G3spIIu2N; incap_ses_392_2132269=PwOvRmogIm4fuUvK4KpwBXd7Tl4AAAAAuZLaqegnFDHjP4KswdKm3Q==; GKD=%97%B5%A5%D7%94%CF%84r%9D%B9%A1%95%BD%B2%A0%DC%9D%AE%89%B6%95%A8%A9%D8%94%AC%94r%91%B9%AC%CA%B0%D5%A1%CF%9C%98%9Dr%95%B5%B4%A8; s_fid=450D09C5CA180D0A-13881BD90C0E8F88; s_cc=true; helpcrunch.com-seranking-1145-helpcrunch-device={\"id\":25030529,\"secret\":\"9kU1h3INomIvyKoEUVeFTUeAs6tKgyb9qamJtFkRER4juzyGShguw6i+4/7PrAAU5GA8y8OO68rdS7I0fTiVNQ==\",\"sessions\":3}; helpcrunch.com-seranking-166-helpcrunch-device={\"id\":25030531,\"secret\":\"BHgBEqByPmp/TpKyY4+XQH6eaY2cu2bMGahccqPfvLCMq6dPexQgRHra6IrD9wud6u7AEZFvhMe7D/AIO1t0oA==\",\"sessions\":6}; _lo_v=6; _gid=GA1.2.910858634.1582539870; _gid=GA1.3.910858634.1582539870; research_au=eda2428cc66f153da34a7f545e55fc1628b86a; _ym_isad=2; _pk_ref.7.7189=%5B%22%22%2C%22%22%2C1582736984%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.7.7189=1; _ym_visorc_22102555=w; auto_login_cookie=410ac8edb4b0f966f23fe91c65efb50e; _ga_XH80JYLKJ9=GS1.1.1582736983.5.1.1582737752.0; _ga=GA1.2.1250590664.1582024036; _pk_id.7.7189=d52eb2183d610865.1582024036.23.1582737754.1582736984.', 1)
            ->setHeaders('Accept: application/json, text/javascript, */*; q=0.01', 1)
            ->setHeaders('Sec-Fetch-Dest: empty', 1)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36', 1)
            ->setHeaders('Accept: application/json, text/javascript, */*; q=0.01', 1)
            ->setHeaders('Sec-Fetch-Site: same-origin', 1)
            ->setHeaders('Sec-Fetch-Mode: cors', 1)
            ->setHeaders('X-Requested-With: XMLHttpRequest', 1)
            ->setHeaders("Referer: https://online.seranking.com/research.organic.html?source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&page=1&page_size=50&order_field=traffic&order_type=DESC&", 1);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(1));
    }

    /**
     * @param $ch
     * @param string $domain
     */
    protected function curlTraffic($ch, string $domain): void
    {
        $this->curlSetopt($ch, CURLOPT_URL, "https://online.seranking.com/research.organic.html?ajax=Chart&source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&type=traffic_sum&line=both");
        $this->curlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->curlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->curlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('Authority: online.seranking.com', 2)
            ->setHeaders('Accept: application/json, text/javascript, */*; q=0.01', 2)
            ->setHeaders('Sec-Fetch-Dest: empty', 2)
            ->setHeaders('X-Requested-With: XMLHttpRequest', 2)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36', 2)
            ->setHeaders('Sec-Fetch-Site: same-origin', 2)
            ->setHeaders('Sec-Fetch-Mode: cors', 2)
            ->setHeaders("Referer: https://online.seranking.com/research.overview.html?source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=0", 2)
            ->setHeaders('Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7', 2)
            ->setHeaders('Cookie: PHPSESSID=muhgsojmhimfe9girmpmsj61rc; _gcl_au=1.1.1854575438.1582024036; _fbp=fb.1.1582024036485.1617622220; _lo_uid=120485-1582024037937-8a50ffd6872d3def; __lotl=https%3A%2F%2Fseranking.com%2F; device-source=https://seranking.com/; _ym_uid=1582024053702245396; _ym_d=1582024053; device-referrer=https://online.seranking.com/research.html?input=coloriages.info&do=find&source=fr&filter=undefined; __lotr=https%3A%2F%2Fwww.google.com%2F; _ga=GA1.3.1250590664.1582024036; UID=647284; visid_incap_2132269=gArv7rYpTCW1Fo3RKYl/SXd7Tl4AAAAAQUIPAAAAAABq/aOolpZvtE9G3spIIu2N; incap_ses_392_2132269=PwOvRmogIm4fuUvK4KpwBXd7Tl4AAAAAuZLaqegnFDHjP4KswdKm3Q==; GKD=%97%B5%A5%D7%94%CF%84r%9D%B9%A1%95%BD%B2%A0%DC%9D%AE%89%B6%95%A8%A9%D8%94%AC%94r%91%B9%AC%CA%B0%D5%A1%CF%9C%98%9Dr%95%B5%B4%A8; s_fid=450D09C5CA180D0A-13881BD90C0E8F88; s_cc=true; helpcrunch.com-seranking-1145-helpcrunch-device={\"id\":25030529,\"secret\":\"9kU1h3INomIvyKoEUVeFTUeAs6tKgyb9qamJtFkRER4juzyGShguw6i+4/7PrAAU5GA8y8OO68rdS7I0fTiVNQ==\",\"sessions\":3}; helpcrunch.com-seranking-166-helpcrunch-device={\"id\":25030531,\"secret\":\"BHgBEqByPmp/TpKyY4+XQH6eaY2cu2bMGahccqPfvLCMq6dPexQgRHra6IrD9wud6u7AEZFvhMe7D/AIO1t0oA==\",\"sessions\":6}; _lo_v=6; _gid=GA1.2.910858634.1582539870; _gid=GA1.3.910858634.1582539870; research_au=eda2428cc66f153da34a7f545e55fc1628b86a; _ym_isad=2; _pk_ref.7.7189=%5B%22%22%2C%22%22%2C1582736984%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.7.7189=1; _ym_visorc_22102555=w; auto_login_cookie=410ac8edb4b0f966f23fe91c65efb50e; _ga_XH80JYLKJ9=GS1.1.1582736983.5.1.1582737752.0; _ga=GA1.2.1250590664.1582024036; _pk_id.7.7189=d52eb2183d610865.1582024036.23.1582737754.1582736984.', 2);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(2));
    }


    /**
     * @param string $domain
     * @param string|null $mode
     * @param string|null $sort
     * @return array
     */
    public function run(string $domain, ?string $mode = null, ?string $sort = null)
    {
        // Curl Keywords Serp Analysis and Curl surferseo Keywords !!!
        $ch = curl_init();
        $ch2 = curl_init();
        $ch3 = curl_init();

        // Initialised the Curls !!!
        $this->curlUrl($ch, $domain, $sort, $mode);
        $this->curlKeyword($ch2, $domain);
        $this->curlTraffic($ch3, $domain);

        // Create administrator to multi curl !!!
        $multiCurl = curl_multi_init();

        // ADD to two administrators with method add_handle for the Multi Curl !!!
        curl_multi_add_handle($multiCurl, $ch);
        curl_multi_add_handle($multiCurl, $ch2);
        curl_multi_add_handle($multiCurl, $ch3);

        // Running Exec multi curl !!!
        $running = null;
        do {
            // Exec and Select the multi curl for return result too later !!!
            curl_multi_exec($multiCurl, $running);
            curl_multi_select($multiCurl);
        } while ($running > 0);

        // Error $ch verification to URL CURL !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } elseif (curl_errno($ch2)) {
            echo 'Error:' . curl_error($ch2);
        } elseif (curl_errno($ch3)) {
            echo 'Error:' . curl_error($ch3);
        }

        // We recuperated the result to the Curls and pushed the results in the array Data
        $data = [];
        $resultUrlCurl = curl_multi_getcontent($ch);
        $resultKeywordCurl = curl_multi_getcontent($ch2);
        $resultTrafficCurl = curl_multi_getcontent($ch3);

        $data['url'] = $resultUrlCurl;
        $data['keyword'] = $resultKeywordCurl;
        $data['traffic'] = $resultTrafficCurl;

        // Return $data Data[], the informations to the CURL !!!
        return $data;
    }
}
