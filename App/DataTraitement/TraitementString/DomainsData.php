<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 04/03/20
 * Time: 18:26
 */

namespace App\DataTraitement\TraitementString;


use App\concern\Str_options;
use App\DataTraitement\KeywordsCsv;
use App\Table\Website;

class DomainsData
{
    /**
     * @var array
     */
    private $domainsData = [];
    /**
     * @var KeywordsCsv
     */
    private $keywordsCsv;
    /**
     * @var Website
     */
    private $website;

    /**
     * DomainsData constructor.
     * @param KeywordsCsv $keywordsCsv
     * @param Website $website
     */
    public function __construct(KeywordsCsv $keywordsCsv, Website $website)
    {
        $this->keywordsCsv = $keywordsCsv;
        $this->website = $website;
    }

    /**
     * @param string $domains
     * @return array
     */
    public function split(string $domains): array
    {
        $this->domainsData[] = explode('&', $domains);

        return $this->domainsData;
    }

    /**
     * @return array
     * @throws \League\Csv\Exception
     */
    public function dataKeywords()
    {
        $dataKeywords = [];
        $dataDomains = $this->domainsData[0] ?: [];

        if (!empty($dataDomains)) {
            foreach ($dataDomains as $domain) {
                $domainWeb = (new Str_options())->strReplaceString('-', '.', $domain);
                $website = $this->website->SelectToken($domainWeb);
                $filename = 'keywords-' . $website->token . '.csv';

                $keywords = $this->keywordsCsv->getKeywords($domain, $filename, $website);

                $dataKeywords[$domain] = $keywords;
            }

            return $this->toArrayKeywords($dataKeywords);
        }
    }

    /**
     * @param array $dataKeywords
     * @return array
     */
    private function toArrayKeywords(array $dataKeywords): array
    {
        $data = [];

        foreach ($dataKeywords as $key => $keywords) {
            foreach ($keywords as $k => $keyword) {
                $domain = (new Str_options())->strReplaceString('-', '.', $key);
                $data[$domain][$k]['domain'] = $domain;
                $data[$domain][$k]['keyword'] = $keyword['Mot-clé'] ?: '';
                $data[$domain][$k]['rank'] = $keyword['Position'] ?: '';
                $data[$domain][$k]['search_volume'] = $keyword['Volume de recherche.'] ?: '';
                $data[$domain][$k]['url'] = $keyword['URL'] ?: '';
                $data[$domain][$k]['traffic'] = $keyword['Trafic'] ?: '';
            }
        }

        return $data;
    }
}
