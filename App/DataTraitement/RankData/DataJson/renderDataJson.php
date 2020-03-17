<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/20
 * Time: 17:01
 */

namespace App\DataTraitement\RankData\DataJson;


use App\DataTraitement\RankData\DataRankKeywords;
use App\Model\RankModel;

class renderDataJson
{
    /**
     * @var RankModel
     */
    private $rankModel;
    /**
     * @var array
     */
    private $projects;
    /**
     * @var
     */
    private $auth;

    /**
     * renderDataJson constructor.
     * @param RankModel $rankModel
     * @param array $projects
     * @param $auth
     */
    public function __construct(RankModel $rankModel, array $projects, $auth)
    {
        $this->rankModel = $rankModel;
        $this->projects = $projects;
        $this->auth = $auth;
    }

    /**
     * @param string $project
     * @return array
     */
    public function render(string $project): array
    {
        $dataResult = $this->rankModel->DataAllProjectRank($this->projects, $this->auth);

        $this->auth = \GuzzleHttp\json_encode($this->auth);
        $dataResultWithKeywordsAndFeatures = $this->dataRankTopWithKeywordsAndFeatures($project);

        return [
            'dataRankTopByDate' => $dataResult,
            'dataRankTopWithKeywordsAndFeatures' => $dataResultWithKeywordsAndFeatures
        ];
    }

    /**
     * @param string $project
     * @return array
     */
    private function dataRankTopWithKeywordsAndFeatures(string $project): array
    {
        // Recuperate Result Project By User
        // Create Data Array RANK by Day
        // Format this Data in Data Rank Top 100 by Day !!!
        $result = $this->rankModel->projectUser($project, $this->auth);
        $dataRankByDay = $this->rankModel->DataFormatRankByDay($result['dataResult'], 'top100', 'top10', 'top3');

        // Create data Array by Keyword and by URL Website !!!
        $dataRankByKeyword = $this->rankModel->DataByKeyword($project, $this->auth);

        // Format Array Rank If result keywords not found !!!
        $dataRankFormatEmptyKeyword = (new DataRankKeywords())->renderDataKeywords($dataRankByKeyword);

        return [
            'data' => $dataRankByDay,
            'dataKeywordsByWebsite' => $dataRankFormatEmptyKeyword,
            'countKeywords' => $result['countKeywords']
        ];
    }
}
