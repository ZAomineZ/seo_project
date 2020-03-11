<?php
namespace App\Controller;

use App\concern\Str_options;
use App\DataTraitement\CorrelationData\WebsitesData;
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

        // All lists of websites
        $listWebsites = $this->correlation->allWebsites($dtDataWebisteByTop);

        // Return Response Data !!!
        echo \GuzzleHttp\json_encode([
            'dataTopAverage' => $dtCorrelationAverage,
            'dataWebsiteStats' => $dtDataWebisteByTop,
            'listsOfWebsites' => $listWebsites
        ]);
    }

    /**
     * @param string $websites
     * @param string $keyword
     * @param $auth
     */
    public function getDataWithWebsites(string $websites, string $keyword, $auth)
    {
       $websites = \GuzzleHttp\json_decode($websites);
       $websitesData = new WebsitesData($websites);
       $newWebsites = $websitesData->newDataWebsites();

        // Data Title and Rank by website !!!
        $dataSerp = $this->rankModel->SerpResultKeywords($keyword, $auth)[0]['rank'];
        $dataTitle = $this->rankModel->SerpResultKeywords($keyword, $auth)[0]['title'];

        $dataResult = $this->correlation->getDataByWebsites($newWebsites, $dataSerp, $dataTitle, $keyword);

        // Format Array Data Stats And Traffic !!!
        $dtCorrelationAverage = $this->correlation->correlationAverage(
            $this->correlation->dataFormatCorrelation($dataResult)
        );

        // Array Website With Stats by Top 3, Top 5 And Top 10 !!!
        $dtDataWebisteByTop = $this->correlation->dataTopByWebsite(
            $this->correlation->dataFormatCorrelation($dataResult)
        );

        // All lists of websites
        $listWebsites = $this->correlation->allWebsites($dtDataWebisteByTop);

        // Return Response Data !!!
        echo \GuzzleHttp\json_encode([
            'dataTopAverage' => $dtCorrelationAverage,
            'dataWebsiteStats' => $dtDataWebisteByTop,
            'listsOfWebsites' => $listWebsites
        ]);
    }
}
