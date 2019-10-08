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
       $auth = \GuzzleHttp\json_decode($auth);
       $this->rankModel->projectExist($auth, $project);
       $this->rankModel->limitProject($auth, 5);
       if ($keywords !== '') {
           $data = $this->rankModel->KeywordsNotEmpty($project, $website, $content, $keywords, $auth);
       } else {
          $data = $this->rankModel->KeywordsEmpty($project, $website, $content, $auth);
       }
        $dataResult = $this->rankModel->FormatDataRank($data, $website, $this->rankTable->selectRank($auth->id, true)->id);
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
        if (is_string($auth))  {
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
        $auth = \GuzzleHttp\json_decode($auth);
        $this->rankModel->projectExist($auth, $project, $id);
        if ($keywords !== '') {
            $data = $this->rankModel->KeywordsNotEmpty($project, $website, $content, $keywords, $auth, $id);
        } else {
            $data = $this->rankModel->KeywordsEmpty($project, $website, $content, $auth, $id);
        }
        $dataResult = $this->rankModel->FormatDataRank($data, $website, $this->rankTable->selectRank($id)->id);
        echo \GuzzleHttp\json_encode([
            'result' => $this->rankTable->selectRank($id),
            $dataResult
        ]);
    }

    public function deleteProject(string $id, $auth)
    {
        $auth = \GuzzleHttp\json_decode($auth);
        $this->rankModel->ProjectDelete($id, $auth);
    }
}
