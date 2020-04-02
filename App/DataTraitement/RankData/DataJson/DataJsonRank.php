<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/20
 * Time: 18:00
 */

namespace App\DataTraitement\RankData\DataJson;


use App\concern\File_Params;
use App\DataTraitement\RankData\DataRankByFeature;
use App\Model\RankModel;

class DataJsonRank
{
    /**
     * @var RankModel
     */
    private $rankModel;

    /**
     * DataJsonRank constructor.
     * @param RankModel $rankModel
     */
    public function __construct(?RankModel $rankModel = null)
    {
        $this->rankModel = $rankModel;
    }

    /**
     * @param array $projects
     * @param $auth
     * @return array
     */
    public function dataJson(array $projects, $auth): array
    {
        $dataJson = [];

        foreach ($projects as $project) {
            if (is_string($project)) {
                $slugProject = $project;
                $userProject = $auth->id;
            } else {
                $slugProject = $project->{'slug'};
                $userProject = $project->{'user_id'};
            }

            $directory = dirname(__DIR__, 4) . DIRECTORY_SEPARATOR . 'storage/datas/rankTo/';
            $file = $directory . $slugProject . '-' . $userProject . '.json';

            $dataJson[] = File_Params::OpenFile($file, $directory);
        }

        return $dataJson;
    }

    /**
     * @param array $results
     * @return array
     */
    public function DataRankTopResult(array $results): array
    {
        $dataResult = [];

        foreach ($results as $key => $result) {
            $item = $result->{'dataRankTopByDate'} ?: null;

            if (is_array($item) && isset($item[0])) {
                $dataResult[] = $item[0];
            } else {
                $dataResult[] = $item;
            }
        }

        return $dataResult;
    }

    /**
     * @param string $project
     * @param $auth
     * @param array $keywords
     * @return array
     */
    public function dataJsonRankFeatures(string $project, $auth, array $keywords = []): array
    {
        $dataRankFeatures = [];

        $dataRankByFeature = new DataRankByFeature($this->rankModel);
        $dataRankFeatures['images'] = $dataRankByFeature->renderData($project, $auth, $keywords, 'images');
        $dataRankFeatures['videos'] = $dataRankByFeature->renderData($project, $auth, $keywords, 'videos');
        $dataRankFeatures['P0'] = $dataRankByFeature->renderData($project, $auth, $keywords, 'P0');

        return $dataRankFeatures;
    }

    /**
     * @param object $data
     * @param array $json
     * @return array
     */
    public function newDataJson(object $data, array $json): array
    {
        $dataRankTop = $this->NewdataRankTop((array)$data->{'dataRankTopWithKeywordsAndFeatures'}->{'data'}, $json['dataRankTopWithKeywordsAndFeatures']['data']);
        $dataKeywordsByWebsite = !empty($json['dataRankTopWithKeywordsAndFeatures']['dataKeywordsByWebsite']) ?
            array_merge(
                (array)$data->{'dataRankTopWithKeywordsAndFeatures'}->{'dataKeywordsByWebsite'},
                $json['dataRankTopWithKeywordsAndFeatures']['dataKeywordsByWebsite']
            ) : [];
        $countKeywords = $json['dataRankTopWithKeywordsAndFeatures']['countKeywords'] ?: 0;

        $dataRankTopWithKeywordsAndFeatures['data'] = $dataRankTop;
        $dataRankTopWithKeywordsAndFeatures['dataKeywordsByWebsite'] = $dataKeywordsByWebsite;
        $dataRankTopWithKeywordsAndFeatures['countKeywords'] = $countKeywords;

        $images = !empty($json['dataRankTopFeatures']['data']['images']) ?
            array_merge(
                (array)$data->{'dataRankTopFeatures'}->{'data'}->{'images'}, $json['dataRankTopFeatures']['data']['images']
            ) : [];
        $videos = !empty($json['dataRankTopFeatures']['data']['videos']) ?
            array_merge(
                (array)$data->{'dataRankTopFeatures'}->{'data'}->{'videos'},
                $json['dataRankTopFeatures']['data']['videos']
            ) : [];
        $P0 = !empty($json['dataRankTopFeatures']['data']['P0']) ? array_merge(
            (array)$data->{'dataRankTopFeatures'}->{'data'}->{'P0'},
            $json['dataRankTopFeatures']['data']['P0']
        ) : [];

        $dataRankTopFeatures['data']['images'] = $images;
        $dataRankTopFeatures['data']['videos'] = $videos;
        $dataRankTopFeatures['data']['P0'] = $P0;

        return [
            'dataRankTopByDate' => $json['dataRankTopByDate'],
            'dataRankTopWithKeywordsAndFeatures' => $dataRankTopWithKeywordsAndFeatures,
            'dataRankTopFeatures' => $dataRankTopFeatures
        ];
    }

    /**
     * @param array $newJson
     * @param array $oldJson
     * @param array $keywords
     * @return array
     */
    public function dataJsonFilter(array $newJson, array $oldJson, array $keywords): array
    {
        $dataRankTop = $newJson['dataRankTopWithKeywordsAndFeatures']['data'];
        $dataKeywordsByWebsite = $this->filterDataWithKeywords((array)$oldJson['dataRankTopWithKeywordsAndFeatures']->{'dataKeywordsByWebsite'}, $keywords);
        $countKeywords = $newJson['dataRankTopWithKeywordsAndFeatures']['countKeywords'] ?: 0;

        $dataRankTopWithKeywordsAndFeatures['data'] = $dataRankTop;
        $dataRankTopWithKeywordsAndFeatures['dataKeywordsByWebsite'] = $dataKeywordsByWebsite;
        $dataRankTopWithKeywordsAndFeatures['countKeywords'] = $countKeywords;

        $images = $this->filterDataForFeatures((array)$oldJson['dataRankTopFeatures']->{'data'}->{'images'}, $keywords);
        $videos = $this->filterDataForFeatures((array)$oldJson['dataRankTopFeatures']->{'data'}->{'videos'}, $keywords);
        $P0 = $this->filterDataForFeatures((array)$oldJson['dataRankTopFeatures']->{'data'}->{'P0'}, $keywords);

        $dataRankTopFeatures['data']['images'] = $images;
        $dataRankTopFeatures['data']['videos'] = $videos;
        $dataRankTopFeatures['data']['P0'] = $P0;

        return [
            'dataRankTopByDate' => $newJson['dataRankTopByDate'],
            'dataRankTopWithKeywordsAndFeatures' => $dataRankTopWithKeywordsAndFeatures,
            'dataRankTopFeatures' => $dataRankTopFeatures
        ];
    }

    /**
     * @param array $paramOld
     * @param array $paramNew
     * @return array
     */
    private function NewdataRankTop(array $paramOld, array $paramNew): array
    {
        $data = [];

        if (!empty($paramNew)) {
            if (empty($paramOld)) {
                return $paramNew;
            }

            foreach ($paramOld as $key => $item) {
                if (isset($paramNew[$key])) {
                    $itemOld = $paramOld[$key];
                    $itemNew = $paramNew[$key];

                    $data[$key]['top100'] = ($itemOld->{'top100'} + $itemNew['top100']);
                    $data[$key]['top3'] = ($itemOld->{'top3'} + $itemNew['top3']);
                    $data[$key]['top10'] = ($itemOld->{'top10'} + $itemNew['top10']);
                    $data[$key]['volume'] = ($itemOld->{'volume'} + $itemNew['volume']);
                    $data[$key]['date'] = ($itemNew['date']);
                    $data[$key]['dateUsort'] = ($itemNew['dateUsort']);
                } else {
                    $data[$key] = $item;
                }
            }
        }

        return $data;
    }

    /**
     * @param array $dataFeatures
     * @param array $keywords
     * @return array
     */
    private function filterDataForFeatures(array $dataFeatures, array $keywords): array
    {
        return $this->filterDataWithKeywords($dataFeatures, $keywords);
    }

    /**
     * @param array $oldJson
     * @param array $keywords
     * @return array
     */
    private function filterDataWithKeywords(array $oldJson, array $keywords): array
    {
        $dataKeywords = [];

        foreach ($oldJson as $key => $item) {
            $keyword = $item->{'keyword'} ?: '';
            if (in_array($keyword, $keywords)) {
                $dataKeywords[] = $item;
            }
        }

        return $dataKeywords;
    }
}
