<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/10/19
 * Time: 03:27
 */

namespace App\Controller;

use App\Actions\Cron\CronKeywords;
use App\concern\Ajax;
use App\DataTraitement\RankData\DataJson\RankJson;
use App\DataTraitement\RankData\KeywordsTraitement;
use App\ErrorCode\Exception\NullableException;
use App\Helpers\RenderMessage;
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
     * @throws NullableException
     */
    public function SaveProject(string $project, string $website, string $content, string $keywords, $auth)
    {
        // JSON Decode Auth User !!!
        $auth = \GuzzleHttp\json_decode($auth);
        // Verif Database
        // Project Limit by 5 And if a project existing already !!!
        $this->rankModel->projectExist($auth, $project);
        $this->rankModel->limitProject($auth, 5);
        // Checked if the rate user is exceed !!!
        $keywords !== '' ? (new Ajax())->checkedRateUser((int)$auth->id) : null;

        $dataTraitement = [$project, $website, $content, $auth, null];
        (new KeywordsTraitement($this->rankModel, $keywords))->traitementKeywords($dataTraitement);

        $project = $this->rankTable->selectProject($auth, $project, null, true);
        $projects = [$project];

        $rankJson = new RankJson($this->rankModel, $projects);
        $rankJson->dataJson($auth, $project);
        $dataResult = $rankJson->getResultsRank($auth);

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
     * @throws NullableException
     */
    public function UpdateProject(string $id, string $project, string $website, string $content, string $keywords, $auth)
    {
        // JSON Decode Auth User !!!
        // Verif if a project similar exist already !!!
        $auth = \GuzzleHttp\json_decode($auth);
        $this->rankModel->projectExist($auth, $project, $id);

        $dataTraitement = [$project, $website, $content, $auth, $id];

        $projectStd = $this->rankTable->selectProjectById($auth, $id);
        $dataKeywords = (new KeywordsTraitement($this->rankModel, $keywords))
            ->traitementKeywords($dataTraitement);

        $bddProject = $this->rankTable->selectProjectById($auth, $id);
        $projects = [$bddProject];

        $rankJson = new RankJson($this->rankModel, $projects);
        if ($project !== $projectStd->project) {
            $rankJson->updateNameFile($auth, $projectStd, $bddProject->slug);
        }
        $rankJson->dataJson($auth, $projectStd, $dataKeywords['keywords'] ?: [], $website !== $projectStd->website ? true : false);
        $dataResult = $rankJson->getResultsRank($auth);

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
        $projects = $this->rankModel->AllProject($auth);
        $rankJson = new RankJson($this->rankModel, $projects);

        $cronKeywords = new CronKeywords($this->rankTable, $this->rankModel);
        if ($cronKeywords->cronActive !== true) {
            $rankJson->checkedFilesKeywordsExist($auth);
        }
        $dataResult = $rankJson->getResultsRank($auth);

        echo \GuzzleHttp\json_encode([
            'result' => $this->rankModel->AllProject($auth),
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

        $projects = [$this->rankTable->selectProjectById($auth, (int)$id)];
        $rankJson = new RankJson($this->rankModel, $projects);
        $rankJson->delete($auth);

        $this->rankModel->ProjectDelete($id, $auth);
    }

    /**
     * @param string $project
     * @param $auth
     */
    public function projectData(string $project, $auth)
    {
        // Checked if project exist !!!
        $this->rankModel->findOrFail($project);
        if (is_string($auth)) {
            $auth = \GuzzleHttp\json_decode($auth);
        }
        $projects = $this->rankModel->AllProject($auth);

        $rankJson = new RankJson($this->rankModel, $projects);
        $dataResult = $rankJson->getResultsRankProject($project, $auth);

        echo \GuzzleHttp\json_encode([
            'data' => !empty($dataResult) ? $dataResult->{'data'} : [],
            'dataKeywordsByWebsite' => !empty($dataResult) ? $dataResult->{'dataKeywordsByWebsite'} : [],
            'countKeywords' => !empty($dataResult) ? $dataResult->{'countKeywords'} : []
        ]);
    }

    /**
     * @param string $project
     * @param $auth
     * @param string $typeFeature
     */
    public function getDataByFeature(string $project, $auth, string $typeFeature)
    {
        if (is_string($auth)) {
            $auth = \GuzzleHttp\json_decode($auth);
        }
        $projects = [$this->rankTable->selectProjectBySlug($auth, $project)];
        $rankJson = new RankJson($this->rankModel, $projects);

        $dataResult = $rankJson->getResultRankFeatures($auth, $typeFeature);

        echo \GuzzleHttp\json_encode([
            'success' => true,
            'data' => $dataResult
        ]);
    }
}
