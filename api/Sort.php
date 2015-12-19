<?php
require_once("config.php");
require_once('phpmailer/PHPMailerAutoload.php');

//require_once  'http://pasku.net.ua/projects/tiles/sign_in/api/phpmailer/PHPMailerAutoload.php';

class Sort
{
    private $filepath;
    private $db;

    function __construct($filepath = 'data/img/temp')
    {
        $this->filepath = $filepath;
        $this->db = $this->db();
    }

    private function db()
    {
        $conn = new mysqli(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_NAME);
        if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);
        return $conn;
    }

    public function saveUser($user)
    {
        if (!empty($user) && !empty($user->usr_email) && !empty($user->usr_psw) && !empty($user->usr_phone) && !empty($user->usr_solt)) {
            $sql = "INSERT INTO users ";
            $keys = "(";
            $values = '(';
            foreach ($user as $key => $value) {
                if ($value != null && !($value instanceof stdClass)) {
                    if ($key == 'usr_psw') {
                        $values .= '"' . crypt(htmlspecialchars($value), htmlspecialchars($user->usr_solt)) . '", ';
                    } else {
                        $values .= '"' . htmlspecialchars($value) . '", ';
                    }
                    $keys .= '`' . htmlspecialchars($key) . '`, ';
                }
            }
            $keys = trim($keys, ', ') . ' )';
            $values = trim($values, ', ') . ' )';
            $sql .= $keys . ' VALUES ' . $values;

            $stmt = $this->db->prepare($sql);
            $res = $stmt->execute();

            if (!$res) {
                if ($this->db->errno == 1062) {
                    return array('error' => true,
                        'type' => 'such user with' . substr($this->db->error, 15, strrpos($this->db->error, 'for') - 15) . ' already exist!!!');
                } else {
                    return array('error' => 'problem with savingAs new user' . $this->db->error);
                }

            } else {
                //create an instance of PHPMailer
                $data = array(
                    'fromeName' => 'Kate & Sam',
                    'subject' => 'nothing',
                    'toMsg' => $user->usr_email,
                    'msg' => 'Nothinf',
                    'frome' => 'paskusam@gmail.com'
                );
//                $this->sendInfoOnEmail(json_encode($data));
                $user['id_user'] = $this->db->insert_id;
                return array('success' => 'we sent on ' . $user->usr_email . ' authontefications, please confirm it!!!',
                    'data' => $user);
            }
        } else {

            return array('error' => "could'nt save user");
        }

    }

    public function getUser($data)
    {
        $lgn = htmlspecialchars($data->lgn);
        $psw = htmlspecialchars($data->usr_psw);
        $result = array(
            'error' => "error",
            "type" => "lgn",
            'text' => 'didn\'nt find user '
        );
        if (!empty($lgn) && !empty($psw)) {
            $sql = "Select * from `users` where `usr_email` = '{$lgn}' OR `usr_phone`= '{$lgn}' ";
            $res = $this->db->query($sql);
            if (!$res) {
                return $result;
            } else {
                $user_lgn = ($res->fetch_assoc());
                if ($user_lgn && $user_lgn['usr_name']) {
                    $_psw = crypt(($psw), ($user_lgn['usr_solt']));
                    if ($user_lgn['usr_psw'] == $_psw) {
                        $user_lgn['usr_psw'] = null;
                        $user_lgn['usr_solt'] = null;
                        return array('data' => $user_lgn);

                    } else {
                        return array(
                            'error' => "error",
                            "type" => "usr_psw",
                            'text' => 'incorrect password'
                        );
                    }
                } else {
                    return array(
                        'error' => "error",
                        "type" => "lgn",
                        'text' => 'didn\'nt find user'
                    );;
                }
            }
        } else {
            return $result;
        }
    }

    public function saveSort($sort)
    {
      if (empty($sort) || empty($sort->srt_email) || empty($sort->srt_name) || empty($sort->srt_adress) || empty($sort->srt_phone)) return array('error' => 'you forgot to set something!!!');

        $sql = "INSERT INTO `sorts`";
        $keys = "(";
        $values = '(';
        foreach ($sort as $key => $value) {
            if ($value != null && !($value instanceof stdClass)) {
                $values .= '"' . htmlspecialchars($value) . '", ';
                $keys .= '`' . htmlspecialchars($key) . '`, ';
            }
        }
        $keys = trim($keys, ', ') . ' )';
        $values = trim($values, ', ') . ' )';
        $sql .= $keys . ' VALUES ' . $values;

        $stmt = $this->db->prepare($sql);
        $res = $stmt->execute();

        if (!$res) {
            return array('error' => 'problem with savingAs new sort' . $this->db->error);
        } else {
            $sort['id_sort'] = $this->db->insert_id;
            return array('success' => 'sort added',
                'data' => $sort);
        }
    }

    public function editSort($sort){
        if (empty($sort) || empty($sort->srt_email) || empty($sort->srt_name) || empty($sort->srt_adress) || empty($sort->srt_phone)) return array('error' => 'you forgot to set something!!!');
        $sql = "Update `sorts` SET ";
        foreach ($sort as $key => $value) {
            if ($value !== null && !($value instanceof stdClass) && $key !== 'id_sort' && $key !== 'id_user') {
                $sql .= htmlspecialchars($key) . ' = "' . htmlspecialchars($value) . '",' ;
            }
        }
        $sql = trim($sql, ', ');
        $sql .= ' where id_sort = "' . $sort->id_sort . '" AND id_user ="' . $sort->id_user . '"';
        $res = $this->db->query($sql);
        if($res){
            return array('success'=>'edit succses');
        }else{
            return array('error'=>'edit denied'.$sql);
        }
    }

    public function getSorts($user){
        if (empty($user)) {
            $sql = "SELECT * FROM sorts ORDER BY created";
        } else {
            $id_user = htmlspecialchars($user->id_user);
            $sql = "Select * from `sorts` WHERE `id_user` = {$id_user} ORDER BY `created`";
        }
        $res = $this->db->query($sql);
        if (!$res) {
            return array('error' => 'could\'t get any sorts');
        } else {
            $results = array();
            while ($row =  (mysqli_fetch_array($res,MYSQL_ASSOC))) {
                $products = $this->getProducts($row["id_sort"]);
                $row['listProducts'] = $products['error'] ? array() : $products['data'];
                $results[]=$row;
            }
            return array('success' => 'data loaded', 'data' => $results);
        }
    }

    public function getProducts($id_sort=0)
    {
        $id_sort = htmlspecialchars($id_sort);
        $id_sort = empty($id_sort)?0:$id_sort;
//        if (!empty($id_sort)) {
            $sql = "SELECT * FROM `products` WHERE `id_sort`={$id_sort} ORDER BY `created`";
            $res = $this->db->query($sql);
            if (!$res) {
                return array('error' => 'could\'t get any product');
            } else {
                $results = array();
                while ($row =  mysqli_fetch_array($res,MYSQL_ASSOC)) {
                    $results[]=$row;
                }
                return array('data' => $results);
            }
//        }
//        return array('data' => array());
    }

    private function sendInfoOnEmail($data)
    {
        $mail = new PHPMailer();
        $mail->From = $data->frome;
        $mail->FromName = $data->fromeName;
        $mail->AddAddress($data->toMsg); //recipient
        $mail->Subject = $data->subject;
        $mail->Body = "Name: " . $data->fromeName . "\r\n\r\nEmail: " . $data->frome . "\r\n\r\nMessage: " . $data->msg;
        if (!$mail->send()) {
            $data = array('error' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo);
            echo json_encode($data);
            exit;
        }
    }

}