<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 11/03/20
 * Time: 13:58
 */

namespace App\DataTraitement\RankData;


use App\concern\File_Params;
use App\concern\Str_options;
use App\DataTraitement\CrawlerDataSerp;
use App\Helpers\LoadDom;
use DOMDocument;
use Symfony\Component\DomCrawler\Crawler;

class LoadCrawlerFeatures
{
    /**
     * @var string
     */
    private $keyword;
    /**
     * @var bool|string
     */
    private $keywordOneLetter;
    /**
     * @var bool|string
     */
    private $keywordThreeLetter;

    /**
     * LoadCrawlerFeatures constructor.
     * @param string $keyword
     */
    public function __construct(string $keyword)
    {
        $this->keyword = (new Str_options())->strReplaceString(' ', '-', $keyword);
        $this->keywordOneLetter = strtoupper(substr($this->keyword, 0, 1));
        $this->keywordThreeLetter = strtoupper(substr($this->keyword, 0, 3));
    }

    /**
     * @return array
     */
    public function getFeatures()
    {
        $resultHtml = $this->getFileSerp();

        // Request Html DomCrawler
        $DOMdocument = new DOMDocument();
        $req = (new LoadDom($DOMdocument))->LoadHtmlDom($resultHtml);

        $crawler = new Crawler($req);
        return $this->crawlerFeatures($crawler);
    }

    /**
     * @return mixed
     */
    private function getFileSerp()
    {
        $dir = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'storage/datas/serptime/';
        $underDir = $this->keywordOneLetter . DIRECTORY_SEPARATOR . $this->keywordThreeLetter . DIRECTORY_SEPARATOR . $this->keyword . DIRECTORY_SEPARATOR;

        $file = $dir . $underDir . date('Y-m-d') . '.html';
        return File_Params::OpenFile($file, $dir . $underDir, true);
    }

    /**
     * @param Crawler $crawler
     * @return array
     */
    private function crawlerFeatures(Crawler $crawler)
    {
        return (new CrawlerDataSerp($crawler, true))->dataCrawlerSearch([
            'e2BEnf U7izfe' =>
                [
                    'name' => ['Vidéos', 'À la une', 'Recettes'],
                    'balise' => 'h3'
                ],
            'jOmXmb rhsg4' =>
                [
                    'name' => ['Résultats Shopping'],
                    'balise' => 'h3'
                ],
            'kp-header' => 'Knowledge Panel',

            'a-no-hover-decoration' =>
                [
                    'name' => ['Signaler des images inappropriées'],
                    'balise' => 'a'
                ],
            'ads-visurl' => [
                'name' => ['Annonce'],
                'balise' => 'span'
            ],

            'ifM9O' => [
                'name' => ['Autres questions posées'],
                'balise' => 'h2'
            ],
            'nrgt' => [
                'name' => ['Site Links'],
                'balise' => 'table'
            ],
            'g mnr-c g-blk' => 'Knowledge Card',

            'H93uF' => [
                'name' => ['Autres adresses'],
                'balise' => 'a'
            ],
            'UCu2Hb' => [
                'name' => ['Image map'],
                'balise' => 'img'
            ],
            'a' => [
                'name' => ['À propos des extraits optimisés'],
                'balise' => 'a'
            ]
        ]);
    }
}
