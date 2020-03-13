<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 19/02/20
 * Time: 19:23
 */

namespace App\DataTraitement;


use App\concern\Str_options;
use App\RenderHTML\RenderButton;
use Symfony\Component\DomCrawler\Crawler;

class CrawlerDataSerp
{
    /**
     * @var Crawler
     */
    private $crawler;
    /**
     * @var array
     */
    private $dataRender = [];
    /**
     * @var array
     */
    private $dataRenderExist = [];
    /**
     * @var bool
     */
    private $rankButton;

    /**
     * CrawlerDataSerp constructor.
     * @param Crawler $crawler
     * @param bool $rankButton
     */
    public function __construct(Crawler $crawler, bool $rankButton = false)
    {
        $this->crawler = $crawler;
        $this->rankButton = $rankButton;
    }

    /**
     * @param array $searchElement
     * @return array
     */
    public function dataCrawlerSearch(array $searchElement = []): array
    {
        foreach ($searchElement as $key => $value) {
            if (is_array($value)) {
                // Value Array Data
                if (is_array($value['name'])) {
                    $this->valueCrawlByArray($value, $key);
                }
            } else {
                // Value String Name !!!
                $this->valueCrawlDiv($value, $key);
            }
        }

        $this->dataExistFeature($this->dataRender);

        return $this->dataRenderExist;
    }

    /**
     * @param array $dataRender
     */
    private function dataExistFeature(array $dataRender)
    {
        foreach ($dataRender as $key => $data) {
            $balise = $data['balise'] ?: 'div';
            $keyClass = $data['key'] ?: '';

            $keyClass = (new Str_options())
                ->strReplaceString(' ', '.', $keyClass);
            $htmlCrawler = $this->htmlCrawlerByKey($keyClass, $balise);

            if (!empty($htmlCrawler)) {
                $this->wordArrayHtml($htmlCrawler, $key);
            }
        }
    }

    /**
     * @param string $value
     * @param string $keyClass
     * @return void
     */
    private function valueCrawlDiv(string $value, string $keyClass): void
    {
        $this->setValueButton('Knowledge Panel', 'Knowledge Panel', $value,
            'M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z', $keyClass);

        $this->setValueButton('Knowledge Card', 'Knowledge Card', $value,
            'M9,22V24H7V22H9M13,22V24H11V22H13M17,22V24H15V22H17M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M11,13H9V15H11V13M19,13H13V15H19V13M7,9H5V11H7V9M19,9H9V11H19V9Z', $keyClass);
    }

    /**
     * @param array $values
     * @param string $keyClass
     * @return void
     */
    private function valueCrawlByArray(array $values, string $keyClass): void
    {
        $this->setValuesButton('Vidéos', 'Video box', $values,
            'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z', $keyClass);

        $this->setValuesButton('À la une', 'News box', $values,
            'M4 7V19H19V21H4C2 21 2 19 2 19V7H4M6 3V15C6 17 8 17 8 17H21C23 17 23 15 23 15V3H6M13 12H9V6H13V12M20 12H15V10H20V12M20 8H15V6H20V8Z', $keyClass);

        $this->setValuesButton('Recettes', 'Recipe box', $values,
            'M12.5,1.5C10.73,1.5 9.17,2.67 8.67,4.37C8.14,4.13 7.58,4 7,4A4,4 0 0,0 3,8C3,9.82 4.24,11.41 6,11.87V19H19V11.87C20.76,11.41 22,9.82 22,8A4,4 0 0,0 18,4C17.42,4 16.86,4.13 16.33,4.37C15.83,2.67 14.27,1.5 12.5,1.5M12,10.5H13V17.5H12V10.5M9,12.5H10V17.5H9V12.5M15,12.5H16V17.5H15V12.5M6,20V21A1,1 0 0,0 7,22H18A1,1 0 0,0 19,21V20H6Z', $keyClass);

        $this->setValuesButton('Résultats Shopping', 'Shopping Results', $values,
            'M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z', $keyClass);

        $this->setValuesButton('Autres adresses', 'Local pack', $values,
            'M15.5,4.5C15.5,5.06 15.7,5.54 16.08,5.93C16.45,6.32 16.92,6.5 17.5,6.5C18.05,6.5 18.5,6.32 18.91,5.93C19.3,5.54 19.5,5.06 19.5,4.5C19.5,3.97 19.3,3.5 18.89,3.09C18.5,2.69 18,2.5 17.5,2.5C16.95,2.5 16.5,2.69 16.1,3.09C15.71,3.5 15.5,3.97 15.5,4.5M22,4.5C22,5.5 21.61,6.69 20.86,8.06C20.11,9.44 19.36,10.56 18.61,11.44L17.5,12.75C17.14,12.38 16.72,11.89 16.22,11.3C15.72,10.7 15.05,9.67 14.23,8.2C13.4,6.73 13,5.5 13,4.5C13,3.25 13.42,2.19 14.3,1.31C15.17,0.44 16.23,0 17.5,0C18.73,0 19.8,0.44 20.67,1.31C21.55,2.19 22,3.25 22,4.5M21,11.58V19C21,19.5 20.8,20 20.39,20.39C20,20.8 19.5,21 19,21H5C4.5,21 4,20.8 3.61,20.39C3.2,20 3,19.5 3,19V5C3,4.5 3.2,4 3.61,3.61C4,3.2 4.5,3 5,3H11.2C11.08,3.63 11,4.13 11,4.5C11,5.69 11.44,7.09 12.28,8.7C13.13,10.3 13.84,11.5 14.41,12.21C15,12.95 15.53,13.58 16.03,14.11L17.5,15.7L19,14.11C20.27,12.5 20.94,11.64 21,11.58M9,14.5V15.89H11.25C11,17 10.25,17.53 9,17.53C8.31,17.53 7.73,17.28 7.27,16.78C6.8,16.28 6.56,15.69 6.56,15C6.56,14.31 6.8,13.72 7.27,13.22C7.73,12.72 8.31,12.47 9,12.47C9.66,12.47 10.19,12.67 10.59,13.08L11.67,12.05C10.92,11.36 10.05,11 9.05,11H9C7.91,11 6.97,11.41 6.19,12.19C5.41,12.97 5,13.91 5,15C5,16.09 5.41,17.03 6.19,17.81C6.97,18.59 7.91,19 9,19C10.16,19 11.09,18.63 11.79,17.91C12.5,17.19 12.84,16.25 12.84,15.09C12.84,14.81 12.83,14.61 12.8,14.5H9Z', $keyClass);

        $this->setValuesButton('À propos des extraits optimisés', 'Featured Snippet', $values,
            'M11.43,3.23L12,4L12.57,3.23V3.24C13.12,2.5 14,2 15,2A3,3 0 0,1 18,5C18,5.35 17.94,5.69 17.83,6H20A2,2 0 0,1 22,8V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8A2,2 0 0,1 4,6H6.17C6.06,5.69 6,5.35 6,5A3,3 0 0,1 9,2C10,2 10.88,2.5 11.43,3.24V3.23M4,8V20H11A1,1 0 0,1 12,19A1,1 0 0,1 13,20H20V8H15L14.9,8L17,10.92L15.4,12.1L12.42,8H11.58L8.6,12.1L7,10.92L9.1,8H9L4,8M9,4A1,1 0 0,0 8,5A1,1 0 0,0 9,6A1,1 0 0,0 10,5A1,1 0 0,0 9,4M15,4A1,1 0 0,0 14,5A1,1 0 0,0 15,6A1,1 0 0,0 16,5A1,1 0 0,0 15,4M12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16M12,13A1,1 0 0,1 13,14A1,1 0 0,1 12,15A1,1 0 0,1 11,14A1,1 0 0,1 12,13M12,10A1,1 0 0,1 13,11A1,1 0 0,1 12,12A1,1 0 0,1 11,11A1,1 0 0,1 12,10Z', $keyClass);

        $this->setValuesButton('Site Links', 'Site Links', $values,
            'M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.94,14.81L11.73,17C11.08,17.67 10.22,18 9.36,18C8.5,18 7.64,17.67 7,17C5.67,15.71 5.67,13.58 7,12.26L8.35,10.9L8.34,11.5C8.33,12 8.41,12.5 8.57,12.94L8.62,13.09L8.22,13.5C7.91,13.8 7.74,14.21 7.74,14.64C7.74,15.07 7.91,15.47 8.22,15.78C8.83,16.4 9.89,16.4 10.5,15.78L12.7,13.59C13,13.28 13.18,12.87 13.18,12.44C13.18,12 13,11.61 12.7,11.3C12.53,11.14 12.44,10.92 12.44,10.68C12.44,10.45 12.53,10.23 12.7,10.06C13.03,9.73 13.61,9.74 13.94,10.06C14.57,10.7 14.92,11.54 14.92,12.44C14.92,13.34 14.57,14.18 13.94,14.81M17,11.74L15.66,13.1V12.5C15.67,12 15.59,11.5 15.43,11.06L15.38,10.92L15.78,10.5C16.09,10.2 16.26,9.79 16.26,9.36C16.26,8.93 16.09,8.53 15.78,8.22C15.17,7.6 14.1,7.61 13.5,8.22L11.3,10.42C11,10.72 10.82,11.13 10.82,11.56C10.82,12 11,12.39 11.3,12.7C11.47,12.86 11.56,13.08 11.56,13.32C11.56,13.56 11.47,13.78 11.3,13.94C11.13,14.11 10.91,14.19 10.68,14.19C10.46,14.19 10.23,14.11 10.06,13.94C8.75,12.63 8.75,10.5 10.06,9.19L12.27,7C13.58,5.67 15.71,5.68 17,7C17.65,7.62 18,8.46 18,9.36C18,10.26 17.65,11.1 17,11.74Z', $keyClass);

        $this->setValuesButton('Annonce', 'Adwords', $values,
            'M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.9 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.1 4 20 4M15 10H11V11H14C14.55 11 15 11.45 15 12V15C15 15.55 14.55 16 14 16H13V17H11V16H9V14H13V13H10C9.45 13 9 12.55 9 12V9C9 8.45 9.45 8 10 8H11V7H13V8H15V10Z', $keyClass);

        $this->setValuesButton('Autres questions posées', 'People also ask', $values,
            'M13,8A4,4 0 0,1 9,12A4,4 0 0,1 5,8A4,4 0 0,1 9,4A4,4 0 0,1 13,8M17,18V20H1V18C1,15.79 4.58,14 9,14C13.42,14 17,15.79 17,18M20.5,14.5V16H19V14.5H20.5M18.5,9.5H17V9A3,3 0 0,1 20,6A3,3 0 0,1 23,9C23,9.97 22.5,10.88 21.71,11.41L21.41,11.6C20.84,12 20.5,12.61 20.5,13.3V13.5H19V13.3C19,12.11 19.6,11 20.59,10.35L20.88,10.16C21.27,9.9 21.5,9.47 21.5,9A1.5,1.5 0 0,0 20,7.5A1.5,1.5 0 0,0 18.5,9V9.5Z', $keyClass);

        $this->setValuesButton('Signaler des images inappropriées', 'Image box', $values,
            'M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6', $keyClass);

        $this->setValuesButton('Image map', 'Local Teaser Pack', $values,
            'M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M14,6.11L8,4V15.89L9,16.24V16.5C9,17.14 9.09,17.76 9.26,18.34L8,17.9L2.66,19.97L2.5,20A0.5,0.5 0 0,1 2,19.5V4.38C2,4.15 2.15,3.97 2.36,3.9L8,2L14,4.1L19.34,2H19.5A0.5,0.5 0 0,1 20,2.5V11.81C18.83,10.69 17.25,10 15.5,10C15,10 14.5,10.06 14,10.17V6.11Z', $keyClass);
    }

    /**
     * @param string $searchNeedle
     * @param string $name
     * @param array $values
     * @param string $path
     * @param string $keyClass
     * @return void
     */
    protected function setValuesButton(string $searchNeedle, string $name, array $values, string $path, string $keyClass): void
    {
        if (in_array($searchNeedle, $values['name'])) {
            $this->dataRender[$searchNeedle]['button'] = (new RenderButton())->buttonWithPathSvg($name, $path, $this->rankButton);
            $this->dataRender[$searchNeedle]['key'] = $keyClass;
            $this->dataRender[$searchNeedle]['balise'] = $values['balise'];
        }
    }

    /**
     * @param string $searchNeedle
     * @param string $name
     * @param string $value
     * @param string $path
     * @param string $keyClass
     */
    protected function setValueButton(string $searchNeedle, string $name, string $value, string $path, string $keyClass): void
    {
        if ($value === $searchNeedle) {
            $this->dataRender[$searchNeedle]['button'] = (new RenderButton())->buttonWithPathSvg($name, $path, $this->rankButton);
            $this->dataRender[$searchNeedle]['key'] = $keyClass;
            $this->dataRender[$searchNeedle]['balise'] = 'div';
        }
    }

    /**
     * @param array $htmlWords
     * @param string $key
     * @return void
     */
    protected function wordArrayHtml(array $htmlWords, string $key): void
    {
        $html = array_map(function ($word) {
            if (is_array($word)) {
                return utf8_decode($word[0]);
            }
            return utf8_decode($word);
        }, $htmlWords) ?: [];

        $elementFirst = $html[0] ?: '';

        if (
            strpos($elementFirst, 'img id="dimg') !== false ||
            strpos($elementFirst, 'Résultat du Knowledge') !== false ||
            strpos($elementFirst, 'rllag') !== false ||
            strpos($elementFirst, 'map image') !== false ||
            strpos($elementFirst, 'Annonce') !== false
        ) {
            $this->dataRenderExist[] = $this->dataRender[$key]['button'];
        }

        foreach ($html as $word) {
            if ($word === $key) {
                $this->dataRenderExist[] = $this->dataRender[$key]['button'];
            }
        }
    }

    /**
     * @param string $keyClass
     * @param string $balise
     * @return array
     */
    protected function htmlCrawlerByKey(string $keyClass, string $balise): array
    {
        $selector = "div.{$keyClass} > {$balise}";

        if ($keyClass === "ads-visurl") {
            $selector = "div.{$keyClass} > {$balise}.VqFMTc.p8AiDd";
        } elseif ($keyClass === 'a-no-hover-decoration') {
            $selector = "{$balise}.{$keyClass}";
        }

        $htmlCrawler = $this->crawler->filter($selector)->each(function ($node) use ($keyClass) {
            if ($keyClass === 'H93uF') {
                return $node->extract([('href')]);
            } elseif ($keyClass === 'UCu2Hb') {
                return $node->extract([('alt')]);
            }
            return $node->html();
        });

        return $htmlCrawler;
    }
}
