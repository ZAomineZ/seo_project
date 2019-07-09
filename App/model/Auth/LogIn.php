<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/05/19
 * Time: 22:52
 */

namespace App\Model\Auth;


class LogIn
{
    /**
     * @param string $message_error
     */
    public function MessageError (string $message_error)
    {
        echo \GuzzleHttp\json_encode(['error' => $message_error]);
    }

    /**
     * @param string $password_user
     * @param string $password_form
     * @param $req
     */
    public function AuthUser (string $password_user, string $password_form, $req)
    {
        if (password_verify($password_form, $password_user)) {
            echo \GuzzleHttp\json_encode($req);
        } else {
            echo \GuzzleHttp\json_encode(['error' => "This Password isn't valid !!!"]);
        }
    }
}