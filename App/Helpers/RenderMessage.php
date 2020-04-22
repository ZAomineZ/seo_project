<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 31/03/20
 * Time: 15:18
 */

namespace App\Helpers;


class RenderMessage
{
    /**
     * @param string $message
     */
    public function messageError(string $message)
    {
        echo \GuzzleHttp\json_encode([
            'success' => false,
            'error' => $message
        ]);
        die();
    }

    /**
     * @param string $message
     */
    public function messageRender(string $message)
    {
        echo $message;
        die();
    }

    /**
     * @param string $message
     */
    public function messageSuccess(string $message)
    {
        echo \GuzzleHttp\json_encode([
            'success' => true,
            'message' => $message
        ]);
        die();
    }
}
