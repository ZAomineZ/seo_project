<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 14/03/19
 * Time: 16:03
 */

namespace App\Model;

class PDO_Model
{
    /**
     * HOST DB CONNECTION
     */
    CONST HOST = "localhost";
    /**
     * DB_NAME DB CONNECTION
     */
    CONST DB_NAME = "app_seo";
    /**
     * USER DB CONNECTION
     */
    CONST USER = "root";
    /**
     * PASSWORD DB CONNECTION
     */
    CONST PASSWORD = "";

    private $pdo;

    /**
     * @return \PDO
     */
    public function GetPdo ()
    {
        $db = new \PDO("mysql:host=" . self::HOST . ";dbname=" . self::DB_NAME . ';charset=utf8', self::USER, self::PASSWORD);
        $db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ);
        return $this->pdo = $db;
    }
}
