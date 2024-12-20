<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/19
 * Time: 18:33
 */

namespace App\concern;

class Date_Format
{
    /**
     * @param $date
     * @param $format = null
     * @return array
     */
    public static function DateDayAndMonth ($date, $format = null) : array
    {
        $date_format_end = [];
        foreach ($date as $dt) {
            $dt_time = $dt;
            if ($format) {
                $date_format_end[] =  date($format, strtotime($dt_time));
            } else {
                $date_format_end[] =  date('F j', strtotime($dt_time));
            }
        }
        return $date_format_end;
    }

    /**
     * @param $date
     * @param $format
     * @param bool $strtotime
     * @return false|string
     */
    public static function DateFormatReq ($date, $format, bool $strtotime = true)
    {
        $dt_time = $strtotime !== false ? strtotime($date) : $date;
        return date($format, $dt_time);
    }
}
