<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 24/03/20
 * Time: 13:33
 */

namespace App\DataTraitement\SerpData;


use App\concern\Str_options;
use App\Model\Serp;

class SerpFile
{
    /**
     * @var Serp
     */
    private $serp;

    /**
     * SerpFile constructor.
     * @param Serp $serp
     */
    public function __construct(Serp $serp)
    {
        $this->serp = $serp;
    }


    /**
     * @param array $dataSerp
     * @param string $keyword
     * @return array
     */
    public function checkRank(array $dataSerp, string $keyword): array
    {
        $rank = array_filter($dataSerp, function ($item) {
            return $item === [];
        });

        return $this->rankEmpty($rank, $keyword);
    }

    /**
     * @param array $rank
     * @param string $keyword
     * @return array
     */
    public function rankEmpty(array $rank, string $keyword): array
    {
        $rankDates = Str_options::toArrayKey($rank);
        $this->serp->deleteFileRankEmpty($rankDates, $keyword);

        $dir = $this->serp->DIRLoad($keyword);
        $resultsDate = scandir($dir);
        return $this->serp->DataDateRank($resultsDate, $dir);
    }
}
