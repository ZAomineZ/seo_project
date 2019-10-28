<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/10/19
 * Time: 03:27
 */

namespace App\Controller;


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
     */
    public function SaveProject(string $project, string $website, string $content, string $keywords, $auth)
    {
        /**
         * @var array
         */
        $keywordsArray = [];

        // JSON Decode Auth User !!!
        $auth = \GuzzleHttp\json_decode($auth);

        // Verif Database !!!
        $this->rankModel->projectExist($auth, $project);
        $this->rankModel->limitProject($auth, 5);

        if ($keywords !== '') {
            $data = $this->rankModel->KeywordsNotEmpty($project, $website, $content, $keywords, $auth);
        } else {
            $data = $this->rankModel->KeywordsEmpty($project, $website, $content, $auth);
        }

        if (strpos($data['keywords'], ',') !== false) {
            $keywordsArray = explode(',', $data['keywords']);
        } else {
            $keywordsArray[] = $data['keywords'];
        }

        $dataResult = $this->rankModel->FormatDataRank(
            $data['data'],
            $website,
            $this->rankTable->selectRank($auth->id, true)->id,
            false,
            $keywordsArray
        );
        echo \GuzzleHttp\json_encode([
            'result' => $this->rankTable->selectRank($auth->id, true),
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
     * @param string $project
     * @param string $website
     * @param string $content
     * @param string $keywords
     * @param $auth
     * @return void
     */
    public function UpdateProject(string $id, string $project, string $website, string $content, string $keywords, $auth)
    {
        $keywordsArray = [];
        $auth = \GuzzleHttp\json_decode($auth);
        $this->rankModel->projectExist($auth, $project, $id);
        if ($keywords !== '') {
            $data = $this->rankModel->KeywordsNotEmpty($project, $website, $content, $keywords, $auth, $id);
        } else {
            $data = $this->rankModel->KeywordsEmpty($project, $website, $content, $auth, $id);
        }
        if (isset($data['keywords']) && strpos($data['keywords'], ',') !== false) {
            $keywordsArray = explode(',', $data['keywords']);
        } else {
            $keywordsArray[] = $data['keywords'];
        }
        $dataResult = $this->rankModel->FormatDataRank(
            isset($data['data']) ? $data['data'] : [],
            $website,
            $this->rankTable->selectRank($id)->id,
            false,
            $keywordsArray);
        echo \GuzzleHttp\json_encode([
            'result' => $this->rankTable->selectRank($id),
            $dataResult
        ]);
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
     * @param array $dataRankByKeyword
     * @return array
     */
    private function renderDataKeywordsEmptyData(array $dataRankByKeyword): array
    {
        $dataRank = [];
        foreach ($dataRankByKeyword as $k => $v) {
            if ($v['url'] === 'Not Found') {
                $dataRank[$k]['keyword'] = $v['keyword'];
                $dataRank[$k]['rank'] = 'Not Found';
                $dataRank[$k]['url'] = 'Not Found';
                $dataRank[$k]['date'] = 'Not Found';
                $dataRank[$k]['diff'] = 'Not Found';
                $dataRank[$k]['volume'] = 'Not Found';
                $dataRank[$k]['chart'] = 'Not Found';
            } else {
                $dataRank[$k]['keyword'] = $v['keyword'];
                $dataRank[$k]['rank'] = $v['rank'];
                $dataRank[$k]['url'] = $v['url'];
                $dataRank[$k]['date'] = $v['date'];
                $dataRank[$k]['diff'] = $v['diff'];
                $dataRank[$k]['volume'] = $v['volume'];
                $dataRank[$k]['chart'] = $v['chart'];
            }
        }
        return $dataRank;
    }
}
