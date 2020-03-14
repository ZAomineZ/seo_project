<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/10/19
 * Time: 03:27
 */

namespace App\Controller;

use App\DataTraitement\RankData\DataRankByFeature;
use App\DataTraitement\RankData\DataRankKeywords;
use App\DataTraitement\RankData\KeywordsTraitement;
use App\DataTraitement\RankData\LoadCrawlerFeatures;
use App\Model\RankModel;
use App\Table\Rank;

class RankController
{
    /**
     * @var RankModel
     */
    private $rankModel;
    /**
     * @var Rank
     */
    private $rankTable;

    /**
     * RankController constructor.
     * @param RankModel $rankModel
     * @param Rank $rankTable
     */
    public function __construct(RankModel $rankModel, Rank $rankTable)
    {
        $this->rankModel = $rankModel;
        $this->rankTable = $rankTable;
    }

    /**
     * @param string $project
     * @param string $website
     * @param string $content
     * @param string $keywords
     * @param $auth
     * @throws \App\ErrorCode\Exception\NullableException
     */
    public function SaveProject(string $project, string $website, string $content, string $keywords, $auth)
    {
        // JSON Decode Auth User !!!
        $auth = \GuzzleHttp\json_decode($auth);

        // Verif Database
        // Project Limit by 5 And if a project existing already !!!
        $this->rankModel->projectExist($auth, $project);
        $this->rankModel->limitProject($auth, 5);

        $dataTraitement = [$project, $website, $content, $auth, null];
        $keywordsTraitement = (new KeywordsTraitement($this->rankModel, $keywords))
            ->traitementKeywords($dataTraitement);

        $keywords = isset($keywordsTraitement['keywords']) ? $keywordsTraitement['keywords'] : [];
        $data = isset($keywordsTraitement['data']) ? $keywordsTraitement['data']['data'] : [];

        $dataResult = $this->rankModel
            ->FormatDataRank($data, $website, $this->rankTable->selectRank($auth->id, true)->id, false, $keywords);
        echo \GuzzleHttp\json_encode([
            'result' => $this->rankTable->selectRank($auth->id, true),
            $dataResult
        ]);
    }

    /**
     * @param string $id
     * @param string $project
     * @param string $website
     * @param string $content
     * @param string $keywords
     * @param $auth
     * @return void
     * @throws \App\ErrorCode\Exception\NullableException
     */
    public function UpdateProject(string $id, string $project, string $website, string $content, string $keywords, $auth)
    {
        // JSON Decode Auth User !!!
        $auth = \GuzzleHttp\json_decode($auth);

        // Verif if a project similar exist already !!!
        $this->rankModel->projectExist($auth, $project, $id);

        $dataTraitement = [$project, $website, $content, $auth, $id];
        $keywordsTraitement = (new KeywordsTraitement($this->rankModel, $keywords))
            ->traitementKeywords($dataTraitement);

        $keywords = isset($keywordsTraitement['keywords']) ? $keywordsTraitement['keywords'] : [];
        $data = isset($keywordsTraitement['data']) ? $keywordsTraitement['data']['data'] : [];

        $dataResult = $this->rankModel
            ->FormatDataRank($data, $website, $this->rankTable->selectRank($id)->id, false, $keywords);
        echo \GuzzleHttp\json_encode([
            'result' => $this->rankTable->selectRank($id),
            $dataResult
        ]);
    }

    /**
     * @param $auth
     */
    public function ProjectAllUsers($auth)
    {
        if (is_string($auth)) {
            $auth = \GuzzleHttp\json_decode($auth);
        }
        $data = $this->rankModel->AllProject($auth);
        $dataResult = $this->rankModel->DataAllProjectRank($data, $auth);

        echo \GuzzleHttp\json_encode([
            'result' => $data,
            $dataResult
        ]);
    }

    /**
     * @param string $id
     */
    public function DataIdProject(string $id)
    {
        $data = $this->rankTable->selectRank($id);
        echo \GuzzleHttp\json_encode($data);
    }

    /**
     * @param string $id
     * @param $auth
     */
    public function deleteProject(string $id, $auth)
    {
        $auth = \GuzzleHttp\json_decode($auth);
        $this->rankModel->ProjectDelete($id, $auth);
    }

    /**
     * @param string $project
     * @param $auth
     */
    public function projectData(string $project, $auth)
    {
        // Recuperate Result Project By User
        // Create Data Array RANK by Day
        // Format this Data in Data Rank Top 100 by Day !!!
        $result = $this->rankModel->projectUser($project, $auth);
        $dataRankByDay = $this->rankModel->DataFormatRankByDay($result['dataResult'], 'top100', 'top10');

        // Create data Array by Keyword and by URL Website !!!
        $dataRankByKeyword = $this->rankModel->DataByKeyword($project, $auth);

        // Format Array Rank If result keywords not found !!!
        $dataRankFormatEmptyKeyword = $this->renderDataKeywordsEmptyData($dataRankByKeyword);

        echo \GuzzleHttp\json_encode([
            'data' => $dataRankByDay,
            'dataKeywordsByWebsite' => $dataRankFormatEmptyKeyword,
            'countKeywords' => $result['countKeywords']
        ]);
    }

    /**
     * @param string $project
     * @param $auth
     * @param string $typeFeature
     */
    public function getDataByFeature(string $project, $auth, string $typeFeature)
    {
        $dataRankByFeature = new DataRankByFeature($this->rankModel);
        $dataRank = $dataRankByFeature->renderData($project, $auth, $typeFeature);

        // Format Array Rank If result keywords not found !!!
        $dataRankFormatEmptyKeyword = $this->renderDataKeywordsEmptyData($dataRank);

        echo \GuzzleHttp\json_encode([
            'success' => true,
            'data' => $dataRankFormatEmptyKeyword
        ]);
    }

    /**
     * @param array $dataRankByKeyword
     * @return array
     */
    private function renderDataKeywordsEmptyData(array $dataRankByKeyword): array
    {
        return (new DataRankKeywords())->renderDataKeywords($dataRankByKeyword);
    }
}
