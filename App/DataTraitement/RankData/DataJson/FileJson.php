<?php
namespace App\DataTraitement\RankData\DataJson;


use App\concern\File_Params;
use App\Model\RankModel;

class FileJson
{
    /**
     * @var RankModel
     */
    private $rankModel;
    /**
     * @var $auth
     */
    private $auth;
    /**
     * @var string
     */
    private $directory = '';
    /**
     * @var string
     */
    private $file = '';
    /**
     * @var array
     */
    private $json = [];
    /**
     * @var array
     */
    private $keywords;

    /**
     * FileJson constructor.
     * @param RankModel $rankModel
     * @param $auth = null
     * @param array $keywords
     */
    public function __construct(RankModel $rankModel, $auth = null, array $keywords = [])
    {
        $this->rankModel = $rankModel;
        $this->auth = $auth;
        $this->keywords = $keywords;
    }

    /**
     * @param array $projects
     * @param bool $update
     */
    public function create(array $projects, bool $update = false)
    {
        $this->initializedFile($projects);
        if ($update) {
            $this->updateFile();
        } else {
            $this->createdFile();
        }
    }

    /**
     * @param array $projects
     * @return array
     */
    public function openFileProject(array $projects): array
    {
        return (new DataJsonRank())->dataJson($projects, $this->auth);
    }

    /**
     * @param array $projects
     * @return void
     */
    public function deleteFile(array $projects): void
    {
        $this->initializedFile($projects, false, true);

        if (file_exists($this->file)) {
            unlink($this->file);
        }
    }

    /**
     * @param array $projects
     */
    public function deleteDataKeywords(array $projects = []): void
    {
        $this->initializedFile($projects, true);

        $file = $this->file;
        $json = $this->json;

        $data = File_Params::OpenFile($file, $this->directory);
        $newData = (new DataJsonRank())->dataJsonFilter($json, (array)$data, $this->keywords);

        if (file_exists($file)) {
            unlink($file);
        }

        $newData = \GuzzleHttp\json_encode($newData);
        File_Params::CreateParamsFile($file, $this->directory, $newData, true);
    }

    /**
     * @return void
     */
    private function createdFile()
    {
        if (!is_dir($this->directory) || !file_exists($this->directory)) {
            mkdir($this->directory, 0777, true);
        }

        $file = $this->file;
        $json = \GuzzleHttp\json_encode($this->json);

        File_Params::CreateParamsFile($file, $this->directory, $json, true);
    }

    /**
     * Update File RankTo Project !!!
     */
    private function updateFile()
    {
        $file = $this->file;
        $json = $this->json;

        $data = File_Params::OpenFile($file, $this->directory);
        $newData = (new DataJsonRank())->newDataJson($data, $json);

        if (file_exists($file)) {
            unlink($file);
        }

        $newData = \GuzzleHttp\json_encode($newData);
        File_Params::CreateParamsFile($file, $this->directory, $newData, true);
    }

    /**
     * @param array $projects
     * @param string $project
     * @param bool $noDataKeyword
     */
    private function toJson(array $projects, string $project, bool $noDataKeyword = false): void
    {
        $renderDataJson = new renderDataJson($this->rankModel, $projects, $this->auth);
        $this->json = $renderDataJson->render($project, $this->keywords, $noDataKeyword);
    }

    /**
     * @param array $projects
     * @param bool $noKeywordData
     * @param bool $deleteFile
     */
    private function initializedFile(array $projects, bool $noKeywordData = false, bool $deleteFile = false)
    {
        foreach ($projects as $project) {
            if (is_string($project)) {
                $slugProject = $project;
                $userProject = $this->auth->{'id'};
            } else {
                $slugProject = $project->{'slug'};
                $userProject = $project->{'user_id'};

                if (is_null($this->auth)) {
                    $this->auth = $project->{'user_id'};
                }
            }

            $this->directory = dirname(__DIR__, 4) . DIRECTORY_SEPARATOR . 'storage/datas/rankTo/';
            $this->file = $this->directory . $slugProject . '-' . $userProject . '.json';

            $deleteFile === false ? $this->toJson($projects, $slugProject, $noKeywordData) : null;
        }
    }
}
