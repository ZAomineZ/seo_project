<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 14/03/19
 * Time: 15:49
 */

namespace App\concern;

class Img_Params
{
    /**
     * @param string $aPath
     * @param bool $aShort
     * @param bool $aCheckIfFileExist
     * @return int|string
     */
    public static function FileGetSize($aPath = '', $aShort = true, $aCheckIfFileExist = true)
    {
        if ($aCheckIfFileExist && !file_exists($aPath)) return 0;
        $size = filesize($aPath);
        if (empty($size)) return '0';
        $l = [];
        $l[] = ['name' => 'octets', 'abbr' => 'o', 'size' => 1];
        foreach ($l as $k => $v) {
            if ($size < $v['size']) {
                return round($size / $l[$k - 1]['size'], 2) . ' ' . ($aShort ? $l[$k - 1]['abbr'] : $l[$k - 1]['name']);
            }
        }
        $l = end($l);
        return (string)round($size / $l['size'], 2);
    }

    /**
     * @param string $size
     * @return float|int
     */
    public static function PowerImg (string $size)
    {
        $google = self::FileGetSize(dirname(__DIR__, 2) . '/' . 'storage/datas/imastic/LinkProfile-google-com/google-com-dd250e1e7154a1406dd53fa8d373324c.png');
        $part_gl = $google - 7408;
        $part = $size - 7408;
        $result =  ($part * 100 / $part_gl);

        if ($result > 1) {
            $part_gl = $google / 100;
            $part = $size / 100;
            $rem =  $part_gl - 100;
            $res = round(($part - $rem), 2);
            return $res;
        }

        return $result;
    }

    /**
     * @param string $size
     * @return float|int
     */
    public static function PowerGoogleSize($size)
    {
        $google = self::FileGetSize(dirname(__DIR__, 2). '/' . 'storage/datas/imastic/LinkProfile-google-com/google-com-157fd60976bc6b154bec3e899a497b34-domain.png');
        $part_gl = $google - 7408;
        $part = $size - 7408;
        return  ($part * 100 / $part_gl);
    }
}
