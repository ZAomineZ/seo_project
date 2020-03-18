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
     * FileJson constructor.
     * @param RankModel $rankModel
     * @param $auth = null
     */
    public function __construct(RankModel $rankModel, $auth = null)
    {
        $this->rankModel = $rankModel;
        $this->auth = $auth;
    }

    /**
     * @param array $projects
     * @param bool $update
     */
    public function create(array $projects, bool $update = false)
    {
        $this->initializedFile($projects);
        if ($update) {
            $this->deleteFile($projects);
        }
        $this->createdFile();
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
        $this->initializedFile($projects);

        if (file_exists($this->file)) {
            unlink($this->file);
        }
    }

    /**
     * @return void
     */
    private function createdFile()
    {
        if (!is_dir($this->directory) || !file_exists($this->directory)) {
            mkdir($this->directory, 0777, true);
        }

        if (!file_exists($this->file)) {
            $file = $this->file;
            $json = \GuzzleHttp\json_encode($this->json);

            File_Params::CreateParamsFile($file, $this->directory, $json, true);
        }
    }

    /**
     * @param array $projects
     * @param string $project
     */
    private function toJson(array $projects, string $project): void
    {
        $renderDataJson = new renderDataJson($this->rankModel, $projects, $this->auth);
        $this->json = $renderDataJson->render($project);
    }

    /**
     * @param array $projects
     */
    private function initializedFile(array $projects)
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

            $this->toJson($projects, $slugProject);
        }
    }
}
