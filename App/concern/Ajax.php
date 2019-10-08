<?php
namespace App\concern;

use App\Model\PDO_Model;
use App\Table\Auth\LogIn;
use App\User;

class Ajax
{
    /**
     * Method Header Ajax Request !!!
     */
    public function HeaderProtect ()
    {
        //header('Content-Type: text/plain');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: POST, GET, HEAD');
        header('Access-Control-Max-Age: 1728000');
        header('Access-Control-Expose-Header: Content-Lenght, Content-Range');
        header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

    /**
     * @param int $user_id
     * @param string $cookie
     */
    public function VerifAuthMe (int $user_id, string $cookie, array $data = [])
    {
        $user_table = new LogIn(new PDO_Model());
        if (isset($cookie) && $user_id > 1) {
            if (strstr($cookie, '__')) {
                $explode_user = explode('__', $cookie);
                $this->VerifTokenExist($user_table, $explode_user[count($explode_user) - 2], $user_id);
                if ($explode_user[count($explode_user) - 1] !== '' && $user_table->SelectUserByID($explode_user[count($explode_user) - 1]) && $user_table->SelectUserByID($explode_user[count($explode_user) - 1])->id == $user_id) {
                    if ($data && $data['username'] !== '' && $data['email']) {
                        if ($user_table->SelectUserByIDOrData($explode_user[count($explode_user) - 1], $data['username'], $data['email'])) {
                            //
                        } else {
                            die('Invalid Token !!!');
                        }
                    }
                } else {
                    die('Invalid Token !!!');
                }
            } else {
               $this->VerifTokenExist($user_table, $cookie, $user_id);
            }
        } else {
            die('You must be logged in to access this page !!!');
        }
    }

    /**
     * @param LogIn $logIn
     * @param string $token
     * @param int $user_id
     * @return mixed
     */
    public function VerifTokenExist (LogIn $logIn, string $token, int $user_id)
    {
        $select = $logIn->SelectUserByToken($token);
        $select_token = $logIn->SelectUserByID($user_id);
        if ($select === false) {
            echo \GuzzleHttp\json_encode(['error' => 'Invalid Token', 'token' => $select_token->token_user, 'id' => $select_token->id]);
            die ();
        }
    }

    /**
     * @param string $value
     */
    public function VerifValueRegex (string $value)
    {
        if (strstr($value, '&')) {
            $value_ex = explode('&', $value);
            foreach ($value_ex as $domain) {
                if (empty($domain) || !preg_match('/^[a-zA-Z0-9-.&]*$/', $domain))
                {
                    echo \GuzzleHttp\json_encode(['error' => 'Invalid Value']);
                    die ();
                }
            }
        } else {
            if (empty($value) || !preg_match('/^[a-zA-Z0-9-.]*$/', $value))
            {
                echo \GuzzleHttp\json_encode(['error' => 'Invalid Value']);
                die ();
            }
        }
    }

    /**
     * @param $date
     * @return mixed
     */
    private function DateCompare ($date)
    {
        $explode_date = explode('-', $date);
        return $explode_date[2];
    }

    /**
     * @param int $user_id
     */
    public function UserRate (int $user_id)
    {
        $auth = new LogIn(new PDO_Model());
        $rate_user = $auth->SelectRateByUser($user_id);
        if ($rate_user->rate_user < 100) {
            if ($this->DateCompare(date('Y-m-d')) !== $this->DateCompare(date('Y-m-d', strtotime($rate_user->created_at)))) {
                $auth->UpdateResetRateUser($user_id);
                $auth->UpdateRateUser($user_id, date('Y-m-d H:i:s'));
            } else {
                $auth->UpdateRateUser($user_id, date('Y-m-d H:i:s'));
            }
        } else {
            if ($this->DateCompare(date('Y-m-d')) !== $this->DateCompare(date('Y-m-d', strtotime($rate_user->created_at)))) {
                $auth->UpdateResetRateUser($user_id);
                $auth->UpdateRateUser($user_id, date('Y-m-d H:i:s'));
            } else {
                echo \GuzzleHttp\json_encode(['error' => 'Limit exceeded !!!']);
                die();
            }
        }
    }
}
