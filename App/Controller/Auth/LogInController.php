<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/05/19
 * Time: 22:52
 */

namespace App\Controller\Auth;

use App\Model\Auth\LogIn;

class LogInController
{
    /**
     * @var LogIn
     */
    private $login;
    /**
     * @var \App\Table\Auth\LogIn
     */
    private $table;

    /**
     * LogInController constructor.
     * @param LogIn $login
     * @param \App\Table\Auth\LogIn $table
     */
    public function __construct(LogIn $login, \App\Table\Auth\LogIn $table)
    {
        $this->login = $login;
        $this->table = $table;
    }

    /**
     * @param string $token
     * @return mixed
     */
    private function ReqToken (string $token)
    {
        return $this->table->SelectUser($token);
    }

    /**
     * @param float $id
     * @return bool|\PDOStatement
     */
    private function UpdateData (float $id)
    {
        return $this->table->UpdateUserConfirmation($id);
    }

    /**
     * @param string $username
     * @return mixed
     */
    private function DataUser (string $username)
    {
        return $this->table->SelectUserbyName($username);
    }

    /**
     * @param int $id
     * @return mixed
     */
    private function DataUserbyID (int $id)
    {
        return $this->table->SelectUserByID($id);
    }

    /**
     * @param string $token
     * @return mixed|null
     */
    public function TokenData (string $token)
    {
        $req = $this->ReqToken($token);
        if ($req && $req->confirmation_at == 0) {
            echo $this->UpdateData($req->id) ? TRUE : NULL;
        }
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function ReconnectCookieData (int $id)
    {
        if (is_int($id)) {
            echo \GuzzleHttp\json_encode($this->DataUserbyID($id));
        } else {
            echo 'Invalid Token !!!';
        }
    }

    /**
     * @param string $username
     * @param string $password
     * @throws \Exception
     */
    public function LoginData (string $username, string $password)
    {
        if ($username !== '' && $password !== '') {
            $req = $this->DataUser($username);
            if ($req && password_verify($password, $req->password)) {
                if ($req->confirmation_at == 1) {
                    $this->table->UpdateTokenUser(bin2hex(random_bytes(32)), $req->id);
                    return $this->login->AuthUser($req->password, $password, $this->DataUser($username));
                }
                return $this->login->MessageError("Your account hasn't been confirmed !!!");
            }
            return $this->login->MessageError("This Username or this password don't exist !!!");
        }
    }
}
