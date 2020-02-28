<?php

namespace App\Actions\Url;

use App\concern\Str_options;

class MultiCurl_VolumeResult
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
     * @return MultiCurl_VolumeResult
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
     * @param string $keywords
     */
    protected function curlSurferSeoKeywords($ch, string $keywords): void
    {
        $this->curlSetopt($ch, CURLOPT_URL, 'https://db.surferseo.com/keywords');
        $this->curlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->curlSetopt($ch, CURLOPT_POST, 1);
        $this->curlSetopt($ch, CURLOPT_POSTFIELDS, "[\"$keywords\"]");
        $this->curlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('Authority: db.surferseo.com', 0)
            ->setHeaders('Origin: https://www.google.com', 0)
            ->setHeaders('X-Recaptcha-Token: ', 0)
            ->setHeaders('Sec-Fetch-Dest: empty', 0)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36', 0)
            ->setHeaders('Content-Type: text/plain;charset=UTF-8', 0)
            ->setHeaders('Accept: */*', 0)
            ->setHeaders('Sec-Fetch-Site: cross-site', 0)
            ->setHeaders('Sec-Fetch-Mode: cors', 0)
            ->setHeaders('Referer: https://www.google.com/', 0)
            ->setHeaders('Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7', 0);
        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(0));
    }

    /**
     * @param $ch
     * @param string $keyword
     */
    protected function curlSerpAnalysis($ch, string $keyword): void
    {
        $this->curlSetopt($ch, CURLOPT_URL, "https://keywords.cognitiveseo.com/index/ajax-api-call/context/serp_analysis?keyword={$keyword}&locale=fr-FR&selocation=&mobile=no&show=20");
        $this->curlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->curlSetopt($ch, CURLOPT_POST, 1);
        $this->curlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('Connection: keep-alive', 1)
            ->setHeaders('Content-Length: 0', 1)
            ->setHeaders('Origin: https://keywords.cognitiveseo.com', 1)
            ->setHeaders('Sec-Fetch-Dest: empty', 1)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36', 1)
            ->setHeaders('Content-Type: application/x-www-form-urlencoded', 1)
            ->setHeaders('Sec-Fetch-Site: same-origin', 1)
            ->setHeaders('Sec-Fetch-Mode: cors', 1)
            ->setHeaders("Referer: https://keywords.cognitiveseo.com/?k={$keyword}&mobile=no&selocation=&locale=fr-FR", 1)
            ->setHeaders('Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7', 1)
            ->setHeaders("Cookie: _ga=GA1.2.1273699008.1581967541; _gid=GA1.2.781972947.1581967541; _fbp=fb.1.1581967541213.392203617; intercom-id-dib24pab=121b8478-4961-428e-8d7d-a05e22c40999; intercom-session-dib24pab=; cookie_consent=1; sc_is_visitor_unique=rx6949961.1581967557.C62FA315A90C4F98EB3B227BB517698D.1.1.1.1.1.1.1.1.1; rcookies=67; mktz_sess=sess.2.546280329.1581967566175; SESS_ID=rkjl8h0018h8emsp92msg0ir79; mktz_client=%7B%22is_returning%22%3A0%2C%22uid%22%3A%221374559277689754502%22%2C%22session%22%3A%22sess.2.546280329.1581967566175%22%2C%22views%22%3A2%2C%22referer_url%22%3A%22https%3A//cognitiveseo.com/keyword-tool/%22%2C%22referer_domain%22%3A%22cognitiveseo.com%22%2C%22referer_type%22%3A%22refferal%22%2C%22visits%22%3A1%2C%22landing%22%3A%22https%3A//keywords.cognitiveseo.com/%3Fk%3D{$keyword}%26mobile%3Dno%26selocation%3D%26locale%3Dfr-FR%22%2C%22enter_at%22%3A%222020-02-17%7C20%3A26%3A6%22%2C%22first_visit%22%3A%222020-02-17%7C20%3A26%3A6%22%2C%22last_visit%22%3A%222020-02-17%7C20%3A26%3A6%22%2C%22last_variation%22%3A%22%22%2C%22utm_source%22%3Afalse%2C%22utm_term%22%3Afalse%2C%22utm_campaign%22%3Afalse%2C%22utm_content%22%3Afalse%2C%22utm_medium%22%3Afalse%2C%22consent%22%3A%22%22%7D; mp_f916a448081159f1b1046b2b9c6fa158_mixpanel=%7B%22distinct_id%22%3A%20%22170549d19cb34b-075af03d6a0023-24414032-1fa400-170549d19cc631%22%2C%22%24device_id%22%3A%20%22170549d19cb34b-075af03d6a0023-24414032-1fa400-170549d19cc631%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fcognitiveseo.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22cognitiveseo.com%22%7D; sc_is_visitor_unique=rx6949961.1581967709.C62FA315A90C4F98EB3B227BB517698D.1.1.1.1.1.1.1.1.1; _gat=1", 1);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(1));
    }


    /**
     * @param string $keyword
     * @return array
     */
    public function run(string $keyword)
    {
        // Curl Keywords Serp Analysis and Curl surferseo Keywords !!!
        $ch = curl_init();
        $ch2 = curl_init();

        // Initialised the Curls !!!
        $keyword = (new Str_options())->strReplaceString('-', ' ', $keyword);
        $this->curlSerpAnalysis($ch, $keyword);
        $this->curlSurferSeoKeywords($ch2, $keyword);

        // Create administrator to multi curl !!!
        $multiCurl = curl_multi_init();

        // ADD to two administrators with method add_handle for the Multi Curl !!!
        curl_multi_add_handle($multiCurl, $ch);
        curl_multi_add_handle($multiCurl, $ch2);

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
        }

        // We recuperated the result to the Curls and pushed the results in the array Data
        $data = [];
        $resultSerpAnalysis = curl_multi_getcontent($ch);
        $resultSurferSeoKeywords = curl_multi_getcontent($ch2);

        $data['serpAnalysis'] = $resultSerpAnalysis;
        $data['seoKeywords'] = $resultSurferSeoKeywords;

        // Return $data Data[], the informations to the CURL !!!
        return $data;
    }
}
