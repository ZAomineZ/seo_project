<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/20
 * Time: 16:37
 */

namespace App\DataTraitement\RankData\DataJson;

use App\Model\PDO_Model;
use App\Model\RankModel;
use App\Table\Rank;

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
     * @param $auth = null
     * @param \stdClass|bool $project
     * @param array $keywordsNew
     * @param bool $newCreationData
     * @return null
     */
    public function dataJson($auth = null, $project, array $keywordsNew = [], bool $newCreationData = false)
    {
        $dataKeywords = explode(',', $project->keywords);
        if (!is_null($auth) && $dataKeywords === $keywordsNew) {
            return null;
        }
        if ($newCreationData) {
            $this->createProject($auth, [], $keywordsNew);
        }

        if (!empty($keywordsNew) && isset($keywordsNew[0]) && $keywordsNew[0] !== '') {
            if ($project->keywords !== $keywordsNew) {
                $deleteAction = $this->removeKeywords($dataKeywords, $keywordsNew, $auth);
                if ($deleteAction === null) {
                    $this->createProject($auth, $keywordsNew, $dataKeywords);
                }
                return $deleteAction;
            }
        }

        if (is_null($auth)) {
            $this->updateRank($project);
            $this->createProject($auth, [], $dataKeywords);
        } else {
            $this->createProject($auth, $keywordsNew, $dataKeywords);
        }
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

        return isset($data) ? $dataResult : [];
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
        $dataFile = $fileJson->openFileProject($projects);
        $data = !empty($dataFile) ? $dataFile[0] : [];

        if (!isset($data) || empty($data)) {
            return [];
        }

        return isset($data) ? $data->{'dataRankTopWithKeywordsAndFeatures'} : [];
    }

    /**
     * @param $auth
     * @param string $typeFeature
     * @return array|object
     */
    public function getResultRankFeatures($auth, string $typeFeature)
    {
        $fileJson = new FileJson($this->rankModel, $auth);
        $data = $fileJson->openFileProject($this->projects)[0];

        if (!isset($data) || empty($data)) {
            return [];
        }
        $data = $data->{'dataRankTopFeatures'}->{'data'}->{$typeFeature};

        return isset($data) ? $data : [];
    }

    /**
     * @param $auth
     */
    public function checkedFilesKeywordsExist($auth): void
    {
        foreach ($this->projects as $project) {
            (new FileJson($this->rankModel, $auth))->checkedFileExist($project);
        }
        $this->projects = $this->rankModel->AllProject($auth);
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

    /**
     * @param null $auth
     * @param array $keywordsNew
     * @param array $dataKeywords
     */
    private function createProject(
        $auth = null,
        array $keywordsNew = [],
        array $dataKeywords = []
    ): void
    {
        (new FileJson($this->rankModel, $auth, $dataKeywords))
            ->create($this->projects, !empty($keywordsNew) ? true : false);
    }

    /**
     * @param array $dataKeywords
     * @param array $newKeywords
     * @param null $auth
     * @return bool
     */
    private function removeKeywords(
        array $dataKeywords,
        array $newKeywords,
        $auth = null
    ): ?bool
    {
        if (count($newKeywords) < count($dataKeywords)) {
            (new FileJson($this->rankModel, $auth, $newKeywords))->deleteDataKeywords($this->projects);
            return true;
        }
        return null;
    }

    /**
     * @param \stdClass $item
     * @return bool
     */
    private function updateRank(\stdClass $item)
    {
        $PDO = new PDO_Model();
        return (new Rank($PDO))->UpdateCreated((int)$item->id);
    }
}
