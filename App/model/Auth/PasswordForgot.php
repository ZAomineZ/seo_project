<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 18/05/19
 * Time: 20:16
 */

namespace App\Model\Auth;

class PasswordForgot
{
    /**
     * @param string $message
     * @param string $type
     * @return array
     */
    public function MessageFront (string $message, string $type) : array
    {
        if ($type === 'error') {
            return [$type => $message];
        }
        return[$type => $message];
    }
}
