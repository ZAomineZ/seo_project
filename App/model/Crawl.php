<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 03/04/19
 * Time: 02:15
 */

namespace App\Model;


class Crawl
{
    public function DupArrValues (array $item, string $key) : array
    {
        $title_arr = [];
        $duppli = [];
        foreach ($item as $dt) {
            if (in_array($dt[$key], $title_arr)) {
                $duppli[] = [$key => $dt[$key], 'url' => $dt['uri'], 'location' => $dt['location']];
            }
            $title_arr[] = $dt[$key];
        }
        return $duppli;
    }
}
