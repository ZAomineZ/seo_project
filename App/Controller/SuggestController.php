<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 11/04/19
 * Time: 00:01
 */

namespace App\Controller;


use App\Actions\Suggest_Data;
use App\DataTraitement\TraitementCsv\RenderCsvSuggest;

class SuggestController
{
    /**
     * @var Suggest_Data
     */
    private $json;

    /**
     * CONST QUESTIONS DATA KEYWORD GOOGLE
     */
    CONST QUESTIONS = [
        'que' => 'que',
        'ou' => 'ou',
        'quelle' => 'quelle',
        'laquelle' => 'laquelle',
        'pourquoi' => 'pourquoi',
        'qu\'est-ce' => 'qu-est-ce',
        'qui' => 'qui',
        'lequel' => 'lequel',
        'quand' => 'quand',
        'quel' => 'quel',
        'quoi' => 'quoi'
    ];
    /**
     * CONST PREPOSITIONS DATA KEYWORD GOOGLE
     */
    CONST PREPOSITIONS = [
        'au' => 'au',
        'avec' => 'avec',
        'comme' => 'comme',
        'pour' => 'pour',
        'pres' => 'pres',
        'pres de' => 'pres-de',
        'sans' => 'sans'

    ];
    /**
     * CONST COMPARISONS DATA KEYWORD GOOGLE
     */
    CONST COMPARISONS = [
        'contre' => 'contre',
        'et' => 'et',
        'ou' => 'ou',
        'vs' => 'vs'
    ];
    /**
     * CONST ALPHA DATA KEYWORD GOOGLE
     */
    CONST ALPHA = [
        'a' => 'a',
        'b' => 'b',
        'c' => 'c',
        'd' => 'd',
        'e' => 'e',
        'f' => 'f',
        'g' => 'g',
        'h' => 'h',
        'i' => 'i',
        'j' => 'j',
        'k' => 'k',
        'l' => 'l',
        'm' => 'm',
        'n' => 'n',
        'o' => 'o',
        'p' => 'p',
        'q' => 'q',
        'r' => 'r',
        's' => 's',
        't' => 't',
        'u' => 'u',
        'v' => 'v',
        'w' => 'w',
        'x' => 'x',
        'y' => 'y',
        'z' => 'z'
    ];

    /**
     * SuggestController constructor.
     * @param Suggest_Data $json
     */
    public function __construct(Suggest_Data $json)
    {
        $this->json = $json;
    }

    /**
     * @param string $keyword
     * Echo Json Encode, Return ARRAY Result for React Component !!!
     */
    protected function ArrayData (string $keyword)
    {
        echo \GuzzleHttp\json_encode($this->arrayTo($keyword));
    }

    /**
     * @param string $keyword
     * @return array
     */
    private function arrayTo(string $keyword)
    {
        return [
            'current' => $this->json->ReqSuggest($keyword),
            'questions' => $this->json->ReqSuggest($keyword, self::QUESTIONS),
            'prepositions' => $this->json->ReqSuggest($keyword, self::PREPOSITIONS),
            'comparisons' => $this->json->ReqSuggest($keyword, self::COMPARISONS),
            'alpha' => $this->json->ReqSuggest($keyword, self::ALPHA, TRUE)
        ];
    }

    /**
     * @param string $keyword
     */
    public function JsonData (string $keyword)
    {
        return $this->ArrayData($keyword);
    }

    /**
     * @param array $request
     */
    public function suggestCSV(array $request)
    {
        $keyword = $request['keyword'] ?? null;
        $data = $this->arrayTo($keyword) ?? [];

        (new RenderCsvSuggest($data, $keyword))->renderCSV();
    }
}
