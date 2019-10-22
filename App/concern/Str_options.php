<?php
namespace App\concern;

use App\Model\RankModel;

class Str_options
{
    /**
     * @param string $keywords
     * @param string $search
     * @return string
     */
    public static function KeywordsInput(string $keywords, string $search): string
    {
        $kArray = explode($search, $keywords);
        $arrayKeywords = array_map('trim', $kArray);
        $arrayKeywords = array_filter($arrayKeywords, function ($value) {return $value !== '';});
        $keywords = implode(',', $arrayKeywords);
        return $keywords;
    }

    /**
     * @param string $name
     * @return array
     */
    public static function TransformUrlToDomain(string $name): array
    {
        $nameDomain = '';
        $nameExplodeUrl = explode('/', $name);
        foreach ($nameExplodeUrl as $item) {
            if (strpos($item, 'www.') !== false) {
                $url = explode('www.', $item);
                $nameDomain .= $url[count($url) - 1];
            }
        }
        if (empty($nameDomain)) {
            $nameDomain .= $nameExplodeUrl[2];
        }
        return [
            'defaultValue' => $nameDomain,
            'valueWebsite' => self::str_replace_domain($nameDomain)
        ];
    }

    /**
     * @param string $crawl_string
     * @return mixed
     */
    public function str_replace_crawl (string $crawl_string)
    {
        $chaine = str_replace("\n","", $crawl_string);
        $chaine_mi = str_replace("\r","", $chaine);
        $chaine_end = str_replace("\t","", $chaine_mi);
        return $chaine_end;
    }

    /**
     * @param string $domain
     * @return mixed
     */
    public static function str_replace_domain (string $domain)
    {
        return str_replace('.', '-', $domain);
    }

    /**
     * @param string $search
     * @param string $replace
     * @param string $subject
     * @return mixed
     */
    public function strReplaceString(string $search, string $replace, string $subject)
    {
        return str_replace($search, $replace, $subject);
    }

    /**
     * @param string $subject
     * @param int $start
     * @param int $end
     * @param bool $maj
     * @return bool|string
     */
    public function str_substr (string $subject, int $start, int $end, bool $maj = false)
    {
        if ($maj) {
            return substr($subject, $start, $end);
        }
        return strtoupper(substr($subject, $start, $end));
    }

    /**
     * @param string $needle
     * @param array $haystack
     * @return bool|int|string
     */
    public function array_find (string $needle, array $haystack)
    {
        foreach ($haystack as $key => $value) {
            if (stripos($value, $needle) !== false) {
                return $key;
            }
        }
        return false;
    }

    /**
     * Search if a string exist many to two times !!!
     * @param string $search
     * @param string $currentDomain
     * @return string
     */
    public function searchDoubleString (string $search, string $currentDomain) : string
    {
        if (substr_count($currentDomain, $search) > 1) {
          $explode_string = explode('.', $currentDomain);
          return $explode_string[count($explode_string) - 2] . '.' . $explode_string[count($explode_string) - 1];
        }
        return $currentDomain;
    }

    /**
     * Search if a string exist many to two times !!!
     * @param string $search
     * @param string $currentDomain
     * @return string
     */
    public function searchDoubleStringDomainNotExist (string $search, string $currentDomain) : string
    {
        if (substr_count($currentDomain, $search) > 1) {
          $explode_string = explode('.', $currentDomain);
          $string = join('-', $explode_string);
          return substr_replace($string, '.', strrpos($string, '-')) . $explode_string[count($explode_string) - 1];
        }
        return $currentDomain;
    }
}
