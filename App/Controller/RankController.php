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

        if (strpos($keywords, ',') !== false) {
            $keywordsArray = explode(',', $keywords);
        } else {
            $keywordsArray[] = $keywords;
        }

        $dataResult = $this->rankModel->FormatDataRank(
            $data,
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
        if (strpos($keywords, ',') !== false) {
            $keywordsArray = explode(',', $keywords);
        } else {
            $keywordsArray[] = $keywords;
        }
        $dataResult = $this->rankModel->FormatDataRank(
            $data,
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
        $dataRankByDay = $this->rankModel->DataFormatRankByDay($result['dataResult'], 'top100');

        // Create data Array by Keyword and by URL Website !!!
        $dataRankByKeyword = $this->rankModel->DataByKeyword($project, $auth);

        // Format Array Rank If result keywords not found !!!
        $dataRankFormatEmptyKeyword = $this->renderDataKeywordsEmptyData($dataRankByKeyword, $result['arrayKeywords']);
        echo \GuzzleHttp\json_encode([
            'data' => $dataRankByDay,
            'dataKeywordsByWebsite' => $dataRankFormatEmptyKeyword,
            'countKeywords' => $result['countKeywords']
        ]);
    }

    /**
     * @param array $dataRankByKeyword
     * @param array $arrayKeywords
     * @return array
     */
    private function renderDataKeywordsEmptyData(array $dataRankByKeyword, array $arrayKeywords): array
    {
        $dataRank = [];
        $d = 0;
        foreach ($arrayKeywords as $key => $item) {
            $i = 0;
            $d++;
            if (isset($dataRankByKeyword[$key + 1])) {
                foreach ($dataRankByKeyword as $k => $v) {
                    $i++;
                    $dataRank[$i]['keyword'] = $v['keyword'];
                    $dataRank[$i]['rank'] = $v['rank'];
                    $dataRank[$i]['url'] = $v['url'];
                    $dataRank[$i]['date'] = $v['date'];
                    $dataRank[$i]['diff'] = $v['diff'];
                    $dataRank[$i]['volume'] = $v['volume'];
                    $dataRank[$i]['chart'] = $v['chart'];
                }
            } else {
                $dataRank[$d]['keyword'] = $item;
                $dataRank[$d]['rank'] = 'Not Found';
                $dataRank[$d]['url'] = 'Not Found';
                $dataRank[$d]['date'] = 'Not Found';
                $dataRank[$d]['diff'] = 'Not Found';
                $dataRank[$d]['volume'] = 'Not Found';
                $dataRank[$d]['chart'] = 'Not Found';
            }
        }
        return $dataRank;
    }
}
