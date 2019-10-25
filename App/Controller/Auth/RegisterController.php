<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/05/19
 * Time: 21:40
 */

namespace App\Controller\Auth;

use App\Model\Auth\Register;

class RegisterController
{
    /**
     * @var Register
     */
    private $register;
    /**
     * @var \App\Table\Auth\Register
     */
    private $table;

    /**
     * RegisterController constructor.
     * @param Register $register
     * @param \App\Table\Auth\Register $table
     */
    public function __construct(Register $register, \App\Table\Auth\Register $table)
    {
        $this->register = $register;
        $this->table = $table;
    }

    /**
     * @param string $username
     * @param string $email
     * @return mixed
     */
    private function RequestExisteField (string $username, string $email)
    {
        return $this->table->UserExist($username, $email);
    }

    /**
     * @param string $username
     * @param $email
     * @param $password
     * @param string $gender
     * @return array|bool
     * @throws \Exception
     */
    protected function RequestData (string $username, $email, $password, string $gender)
    {
        $request = $this->RequestExisteField($username, $email);
        if ($request !== false) {
            return ['error' => 'Your username or your email exist already !!!'];
        }
        $password = password_hash($password, PASSWORD_DEFAULT);
        return $this->table->RegisterUser([
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'gender' => $gender,
            'created_at' => date('Y-m-d H:i:s'),
            'confirmation_token' =>  bin2hex(random_bytes(32)),
            'token_user' => NULL
        ]);
    }

    /**
     * @param string $username
     * @param string $email
     * @param string $password
     * @param string $gender
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function RegisterData (string $username, string $email, string $password, string $gender)
    {
        $error_exist = $this->register->DataFields($username, $email);
        if ($error_exist['username'] === [] && $error_exist['email'] === []) {
            $request = $this->RequestData($username, $email, $password, $gender);
            if (is_array($request) && $request['error'] !== '') {
                echo \GuzzleHttp\json_encode($request);
            } else {
                $req = $this->RequestExisteField($username, $email);
                $mail = $this->register->MailEnjoy($username, $email, $req->confirmation_token);
                if (is_array($mail) && isset($mail['error'])) {
                    echo \GuzzleHttp\json_encode($mail);
                } else {
                    echo \GuzzleHttp\json_encode($mail);
                }
            }
        } else {
            echo \GuzzleHttp\json_encode($error_exist);
        }
    }
}
