<?php
namespace App\concern;

class Str_options
{
    /**
     * @param string $cralw_string
     * @return mixed
     */
    public function str_replace_crawl (string $cralw_string)
    {
        $chaine = str_replace("\n","", $cralw_string);
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
}
