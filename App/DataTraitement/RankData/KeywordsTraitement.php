<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 13/03/20
 * Time: 17:58
 */

namespace App\DataTraitement\RankData;


use App\concern\Str_options;
use App\ErrorCode\Exception\NullableException;
use App\Model\RankModel;
use stdClass;

class KeywordsTraitement
{
    /**
     * @var string
     */
    private $keywords;
    /**
     * @var RankModel
     */
    private $rankModel;

    /**
     * KeywordsTraitement constructor.
     * @param RankModel $rankModel
     * @param string $keywords
     */
    public function __construct(RankModel $rankModel, string $keywords)
    {
        $this->rankModel = $rankModel;
        $this->keywords = $keywords;
    }

    /**
     * @param array $data
     * @return array
     * @throws NullableException
     */
    public function traitementKeywords(array $data): array
    {
        /**
         * @var array
         */
        $keywordsArray = [];
        [$project, $website, $content, $auth, $id] = $data;

        if ($this->keywords !== '') {
            $data = $this->rankModel->KeywordsNotEmpty($project, $website, $content, $this->keywords, $auth, $id);
        } else {
            $data = $this->rankModel->KeywordsEmpty($project, $website, $content, $auth, $id);
        }

        if (isset($data['keywords']) && strpos($data['keywords'], ',') !== false) {
            $keywordsArray = explode(',', $data['keywords']);
        } else {
            $keywordsArray[] = trim($this->keywords);
        }

        return [
            'keywords' => $keywordsArray,
        ];
    }

    /**
     * @param stdClass|boolean $request
     * @return string
     */
    public function formatKeywords($request)
    {
        $keywords = $this->keywords;

        if (strpos($keywords, "\n") !== false) {
            $keywords = Str_options::KeywordsInput($keywords, "\n");

            $this->isKeywordsExisting($request, $keywords);
        } elseif (strpos($keywords, ",") !== false) {
            $keywords = Str_options::KeywordsInput($keywords, ",");

            $this->isKeywordsExisting($request, $keywords);
        } elseif (strpos($keywords, ' ') !== false) {
            $keywords = Str_options::KeywordsInput($keywords, ",");

            $this->isKeywordsExisting($request, $keywords);
        }

        return $keywords;
    }

    /**
     * @param stdClass|boolean $request
     * @param string $keywords
     */
    private function isKeywordsExisting($request, string $keywords)
    {
        if ($request) {
            RankModel::keywordExist($keywords, $request->keywords);
        }
    }
}
