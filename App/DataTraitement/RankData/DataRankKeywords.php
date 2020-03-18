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
                $dataRank[$k]['diff'] = $v['diff'];
                $dataRank[$k]['volume'] = $v['volume'];
                $dataRank[$k]['chart'] = $v['chart'];
            }
        }
        return $dataRank;
    }
}
