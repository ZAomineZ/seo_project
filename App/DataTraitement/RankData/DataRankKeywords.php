<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 14/03/20
 * Time: 14:20
 */

namespace App\DataTraitement\RankData;


class DataRankKeywords
{
    /**
     * @param array $dataRankByKeyword
     * @param bool $noFeatures
     * @return array
     */
    public function renderDataKeywords(array $dataRankByKeyword, bool $noFeatures = false): array
    {
        $dataRank = [];

        foreach ($dataRankByKeyword as $k => $v) {
            if ($v['url'] === 'Not Found') {
                $dataRank[$k]['keyword'] = $v['keyword'];
                $dataRank[$k]['rank'] = 'Not Found';
                $dataRank[$k]['url'] = 'Not Found';

                if (!$noFeatures) {
                    $dataRank[$k]['features'] = [];
                }
                $dataRank[$k]['date'] = 'Not Found';
                $dataRank[$k]['diff'] = 'Not Found';
                $dataRank[$k]['volume'] = 'Not Found';
                $dataRank[$k]['chart'] = 'Not Found';
            } else {
                $dataRank[$k]['keyword'] = $v['keyword'];
                $dataRank[$k]['rank'] = $v['rank'];
                $dataRank[$k]['url'] = $v['url'];

                if (!$noFeatures) {
                    $dataRank[$k]['features'] = (new LoadCrawlerFeatures($v['keyword']))->getFeatures();
                }
                $dataRank[$k]['date'] = $v['date'];
                $dataRank[$k]['diff'] =  $v['rank'] !== 0 ? $v['diff'] : 0;
                $dataRank[$k]['volume'] = $v['volume'];
                $dataRank[$k]['chart'] = $v['chart'];
            }
        }

        $dataRank = $this->filterDataKeywordRank($dataRank);

        return $dataRank;
    }

    /**
     * @param array $data
     * @return array
     */
    public function dataRenderFormatKeywordByFeatures(array $data)
    {
        $dataKeywordsByFeatures = [];

        if (!empty($data)) {
            $dataKeywordsByFeatures['images'] = $this->renderDataKeywords($data['images']);
            $dataKeywordsByFeatures['videos'] = $this->renderDataKeywords($data['videos']);
            $dataKeywordsByFeatures['P0'] = $this->renderDataKeywords($data['P0']);
        }
        return $dataKeywordsByFeatures;
    }

    /**
     * @param array $dataRank
     * @return array
     */
    private function filterDataKeywordRank(array $dataRank): array
    {
        $dataKeywords = [];

        foreach ($dataRank as $key => $item) {
            $dataKeywords[] = $item['keyword'] ?: '';
        }

        $countArray = array_count_values($dataKeywords);
        foreach ($dataRank as $key => $item) {
            foreach ($countArray as $keyword => $value) {
                if ($value >= 2) {
                    if ($item['keyword'] === $keyword && $item['rank'] === 0) {
                        unset($dataRank[$key]);
                    }
                }
            }
        }

        $dataRank = array_values($dataRank);

        return $dataRank;
    }
}
