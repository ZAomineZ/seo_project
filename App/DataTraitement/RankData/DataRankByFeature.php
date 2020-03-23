<?php

namespace App\DataTraitement\RankData;

use App\concern\File_Params;
use App\Model\RankModel;
use Symfony\Component\DomCrawler\Crawler;

class DataRankByFeature
{
    /**
     * @var RankModel
     */
    private $rank;

    /**
     * DataRankByFeature constructor.
     * @param RankModel $rankModel
     */
    public function __construct(RankModel $rankModel)
    {
        $this->rank = $rankModel;
    }

    /**
     * @param string $project
     * @param $auth
     * @param array $keywords
     * @param string $typeFeature
     * @return array
     */
    public function renderData(string $project, $auth, array $keywords = [], string $typeFeature)
    {
        $htmlResult = $this->rank->DataByKeyword($project, $auth, $typeFeature, $keywords);

        $results = $htmlResult['rankResults'] ?: [];
        $website = $htmlResult['website'] ?: '';
        $option = $htmlResult['option'] ?: '';
        $keywords = $htmlResult['keywords'] ?: '';

        $rankDataResult = $this->filterByFeature($typeFeature, $results);

        $dataRank = $this->rank->FormatDataRank($rankDataResult, $website, $option, TRUE);
        return $this->rank->rankFormatTableKeyword($dataRank, $keywords, $rankDataResult, $website);
    }

    /**
     * @param string $typeFeature
     * @param array $htmlResult
     * @return array
     */
    private function filterByFeature(string $typeFeature, array $htmlResult): array
    {
        $dataWebsite = [];

        foreach ($htmlResult as $key => $result) {
            $dirKeyword = $result['dirKeyword'] ?: '';
            $dateData = $result['allDate'] ?: [];
            $dateDataFormat = $result['allDateFormat'] ?: [];

            foreach ($dateData as $k => $item) {
                $file = $dirKeyword . $item . '.html';
                $result = File_Params::OpenFile($file, $dirKeyword, true);

                $crawler = new Crawler($result);
                $typeSelector = $this->selectorFeature($typeFeature);

                if ($typeFeature !== 'images' && $typeFeature !== 'videos') {
                    $itemsRank = $this->rankItemsFeature($crawler, $typeSelector);
                }  else {
                    $extractType = $typeFeature === 'images' ? 'title' : 'href';
                    $itemsRank = $crawler->filter($typeSelector)->extract([$extractType]);
                }

                $dataWebsite[$key]['rank'][$item] = $itemsRank;
                $dataWebsite[$key]['date'] = $dateData;
                $dataWebsite[$key]['date_format'] = $dateDataFormat;
            }
        }

        return $dataWebsite;
    }

    /**
     * @param string $typeFeature
     * @return string
     */
    private function selectorFeature(string $typeFeature): string
    {
        if ($typeFeature === 'images') {
            return 'div.vsqVBf.tapJqb.ivg-i.rg_el > a.bia > g-img.BA0A6c > img';
        } elseif ($typeFeature === 'videos') {
            return 'div.BFJZOc > div.P94G9b > g-inner-card.ZTH1s.cv2VAd > div.y8AWGd.llvJ5e > a';
        } elseif ($typeFeature === 'P0') {
            return 'div.kp-blk.c2xzTb.Wnoohf.OJXvsb > div.xpdopen > div.ifM9O > h2';
        }
        return null;
    }

    /**
     * @param Crawler $crawler
     * @param string $typeSelector
     * @return array
     */
    private function rankItemsFeature(Crawler $crawler, string $typeSelector): array
    {
        $itemsRank = $crawler->filter($typeSelector)->each(function ($node) {
            return $node->html();
        });

        $itemH2 = isset($itemsRank[0]) ? $itemsRank[0] : '';
        if ($itemH2 === 'Extrait optimisé sur le Web') {
            $selectorFeature = 'div.kp-blk.c2xzTb.Wnoohf.OJXvsb > div.xpdopen > div.ifM9O > div > div.g > div.rc > div.r > a';
            $itemsRank = $crawler->filter($selectorFeature)->extract(['href']);

            return $itemsRank;
        }
        return [];
    }
}
