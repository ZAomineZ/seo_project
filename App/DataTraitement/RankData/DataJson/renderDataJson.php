<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/20
 * Time: 17:01
 */

namespace App\DataTraitement\RankData\DataJson;

use App\DataTraitement\RankData\DataRankKeywords;
use App\Model\PDO_Model;
use App\Model\RankModel;
use App\Table\Auth\LogIn;

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
     * @param int|object|string $auth
     */
    public function __construct(RankModel $rankModel, array $projects, $auth)
    {
        $this->rankModel = $rankModel;
        $this->projects = $projects;
        $this->auth = $auth;
    }

    /**
     * @param string $project
     * @param array $keywords
     * @param bool $noDataKeywords
     * @return array
     */
    public function render(string $project, array $keywords = [], bool $noDataKeywords = false): array
    {
        // Verif if the property auth is to type string, int or object
        $this->authToObject();

        $dataResult = $this->rankModel->DataAllProjectRank($this->projects, $this->auth, [], $keywords);

        $this->auth = !is_string($this->auth) ? \GuzzleHttp\json_encode($this->auth) : $this->auth;
        $dataResultWithKeywordsAndFeatures = $this->dataRankTopWithKeywordsAndFeatures($project, $keywords, $noDataKeywords);
        $dataResultRankFeatures = !$noDataKeywords ? $this->dataRankTopFeatures($project, $keywords) : [];

        return [
            'dataRankTopByDate' => $dataResult,
            'dataRankTopWithKeywordsAndFeatures' => $dataResultWithKeywordsAndFeatures,
            'dataRankTopFeatures' => $dataResultRankFeatures
        ];
    }

    /**
     * @param string $project
     * @param array $keywords
     * @return array
     */
    private function dataRankTopFeatures(string $project, array $keywords = []): array
    {
        $dataRankFormatEmptyKeyword = (new DataJsonRank($this->rankModel))->dataJsonRankFeatures($project, $this->auth, $keywords);
        $dataRankFormatEmptyKeyword = (new DataRankKeywords())->dataRenderFormatKeywordByFeatures($dataRankFormatEmptyKeyword);

        return [
            'data' => $dataRankFormatEmptyKeyword
        ];
    }

    /**
     * @param string $project
     * @param array $keywords
     * @param bool $noDataKeywords
     * @return array
     */
    private function dataRankTopWithKeywordsAndFeatures(string $project, array $keywords = [], bool $noDataKeywords = false): array
    {
        // Recuperate Result Project By User
        // Create Data Array RANK by Day
        // Format this Data in Data Rank Top 100 by Day !!!
        $result = $this->rankModel->projectUser($project, $this->auth, $keywords);
        $dataRankByDay = $this->rankModel->DataFormatRankByDay($result['dataResult'], 'top100', 'top10', 'top3');

        if (!$noDataKeywords) {
            // Create data Array by Keyword and by URL Website !!!
            $dataRankByKeyword = $this->rankModel->DataByKeyword($project, $this->auth, null, $keywords);

            // Format Array Rank If result keywords not found !!!
            $dataRankFormatEmptyKeyword = (new DataRankKeywords())->renderDataKeywords($dataRankByKeyword);
        }

        return [
            'data' => $dataRankByDay,
            'dataKeywordsByWebsite' => !$noDataKeywords ? $dataRankFormatEmptyKeyword : [],
            'countKeywords' => $result['countKeywords']
        ];
    }

    /**
     * If the property is a string or a int then we recupered User with userID in $this->auth
     */
    private function authToObject()
    {
        if (is_string($this->auth) || is_int($this->auth)) {
            $pdo = new PDO_Model();
            $user = (new LogIn($pdo))->SelectUserByID((int)$this->auth);
            $this->auth = $user;
        }
    }
}
