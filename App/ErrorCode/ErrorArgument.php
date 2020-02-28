<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 25/02/20
 * Time: 16:47
 */

namespace App\ErrorCode;


class ErrorArgument
{
    public static function errorCode()
    {
        echo \GuzzleHttp\json_encode([
            'error' => 'An problem is occurence !!!'
        ]);
        die();
    }

    /**
     * @param string|null $message
     */
    public static function errorSyntaxCode(?string $message)
    {
        echo \GuzzleHttp\json_encode([
            'error' => 'An error to syntax is occurence, ' . $message ?: '' . ' !!!'
        ]);
        die();
    }
}
