<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/20
 * Time: 16:37
 */

namespace App\DataTraitement\RankData\DataJson;


use App\Model\RankModel;

class RankJson
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
     * RankJson constructor.
     * @param RankModel $rankModel
     * @param array $projects
     */
    public function __construct(RankModel $rankModel, array $projects)
    {
        $this->rankModel = $rankModel;
        $this->projects = $projects;
    }

    /**
     * @param $auth
     * @param bool $update
     */
    public function dataJson($auth, bool $update = false)
    {
        $fileJson = new FileJson($this->rankModel, $auth);
        $fileJson->create($this->projects, $update);
    }

    /**
     * @param $auth
     */
    public function delete($auth)
    {
        $fileJson = new FileJson($this->rankModel, $auth);
        $fileJson->deleteFile($this->projects);
    }

    /**
     * @param $auth
     * @return array
     */
    public function getResultsRank($auth): array
    {
        $fileJson = new FileJson($this->rankModel, $auth);
        $data = $fileJson->openFileProject($this->projects);

        if (!isset($data) || empty($data)) {
            return [];
        }
        $dataResult = (new DataJsonRank())->DataRankTopResult($data);

        return isset($data) ? $dataResult: [];
    }

    /**
     * @param string $project
     * @param $auth
     * @return object|array
     */
    public function getResultsRankProject(string $project, $auth)
    {
        $projects = $this->toProjects($project);
        $fileJson = new FileJson($this->rankModel, $auth);
        $data = $fileJson->openFileProject($projects)[0];

        if (!isset($data) || empty($data)) {
            return [];
        }

        return isset($data) ? $data->{'dataRankTopWithKeywordsAndFeatures'} : [];
    }

    /**
     * @param string $project
     * @return array
     */
    private function toProjects(string $project): array
    {
        $newData = [];
        $newData[] = $project;
        return $newData;
    }
}
