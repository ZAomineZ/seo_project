<?php
namespace App\Controller;

use App\concern\Str_options;
use App\Model\Correlation;
use App\Model\RankModel;

class CorrelationController
{
    /**
     * @var Correlation
     */
    private $correlation;
    /**
     * @var Str_options
     */
    private $str;
    /**
     * @var RankModel
     */
    private $rankModel;

    /**
     * CorrelationController constructor.
     * @param Correlation $correlation
     * @param Str_options $str
     * @param RankModel $rankModel
     */
    public function __construct(Correlation $correlation, Str_options $str, RankModel $rankModel)
    {
        $this->correlation = $correlation;
        $this->str = $str;
        $this->rankModel = $rankModel;
    }

    /**
     * @param string $keyword
     * @param $auth
     * @throws \Exception
     */
    public function dataCorrelation(string $keyword, $auth)
    {
        // Format Keyword Value And Recuperate value default keyword !!!
        $keywordStringValue = $this->str->strReplaceString(' ', '-', $keyword);
        $keywordDefaultValue = $keyword;

        // Recuperate All webSite to Keyword !!!
        $dataSerp = $this->rankModel->SerpResultKeywords($keywordDefaultValue, $auth)[0]['rank'];
        $dataTitle = $this->rankModel->SerpResultKeywords($keywordDefaultValue, $auth)[0]['title'];
        $dataResult = $this->correlation->CreateOrOpenFile($dataSerp, $dataTitle, $keywordDefaultValue);

        // Format Array Data Stats And Traffic !!!
        $dtCorrelationAverage = $this->correlation->correlationAverage(
            $this->correlation->dataFormatCorrelation($dataResult)
        );

        // Array Website With Stats by Top 3, Top 5 And Top 10 !!!
        $dtDataWebisteByTop = $this->correlation->dataTopByWebsite(
            $this->correlation->dataFormatCorrelation($dataResult)
        );

        // Return Response Data !!!
        echo \GuzzleHttp\json_encode([
            'dataTopAverage' => $dtCorrelationAverage,
            'dataWebsiteStats' => $dtDataWebisteByTop
        ]);
    }
}
