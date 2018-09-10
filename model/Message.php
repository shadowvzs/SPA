<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Message extends Model {

	public static $TABLE_NAME = 'messages';
    public static $UPLOAD_FOLDER = "/img/gallery/";
    public static $THUMB_FOLDER = "/img/gallery/mini/";
    public static $MAX_HEIGHT = [
        'normal' => '1200',
        'thumb' => '240'
    ];
    public static $COLOR_DEPTH = 256;
 	public static $INPUT_RULE = [
		'id' => ['type'=>'INTEGER'],
        'sender_id' => ['type'=>'INTEGER'],
        'target_id' => ['type'=>'INTEGER'],
		'title' => ['type'=>'STRING', 'length' => [1, 255]],
		'content' => ['type'=>'STRING', 'length' => [0, 5000]],
 	];

    public static $ROLE_REQ = [
        'get_sent' => 1,
        'get_inbox' => 1,
        'get_users' => 1,
        'send_msg' => 1,
        'delete_msg' => 1
    ];

    protected function get_sent($data=0) {
        $last_id = intval($data['last_id'] ?? 0);
        $user = static::$auth;
        $sql = sprintf("SELECT m.id as id, m.sender_id as sender_id, m.target_id as target_id, m.status as status, m.subject as subject, m.content as content, m.created as created, m.updated as updated, u.name as name
            FROM %s as m
      		LEFT JOIN users as u ON u.id = m.target_id
       		WHERE m.sender_id = %u AND m.visibility IN (0, 2) AND m.id > %u", static::$TABLE_NAME, $user['userId'], $last_id);
        $msg = static::execQuery($sql);

        return $this->sendResponse($msg, null);
	}

    protected function get_inbox($data=0) {
        $last_id = intval($data['last_id'] ?? 0);
        $user = static::$auth;
        $sql = sprintf("SELECT m.id as id, m.sender_id as sender_id, m.target_id as target_id, m.status as status, m.subject as subject, m.content as content, m.created as created, m.updated as updated, u.name as name
            FROM %s as m
    		LEFT JOIN users as u ON u.id = m.target_id
    		WHERE m.id > %u AND m.target_id = %u AND m.visibility IN (0, 1)", static::$TABLE_NAME, $last_id, $user['userId']);
        $msg = static::execQuery($sql);

        return $this->sendResponse($msg, null);
	}

    protected function get_single_mail($data=0) {
        $id = intval($data['id'] ?? 0);
        if (empty($id)) { return static::refuseData('Missing email id!'); }
        $user = static::$auth;
        $sql = sprintf("SELECT m.id as id, m.sender_id as sender_id, m.target_id as target_id, m.status as status, m.subject as subject, m.content as content, m.created as created, m.updated as updated, t.name as target_name, s.name as sender_name
            FROM %s as m
            LEFT JOIN users as t ON t.id = m.target_id
            LEFT JOIN users as s ON s.id = m.sender_id
    		WHERE m.id > %u AND m.id = %u AND m.visibility IN (0, 1)", static::$TABLE_NAME, $last_id, $id);
        $msg = static::execQuery($sql);
        if (empty($msg)) { return static::refuseData('Missing this email, maybe already was deleted!'); }
        $msg = $msg[0];
        if ($user['userId'] == $msg['target_id'] && $msg['status'] === "0") {
            $data = $msg;
            $data['status'] = 1;
            unset($data['sender_name']);
            unset($data['target_name']);
            unset($data['updated']);
            $this->save($data);
        }
        return $this->sendResponse($msg, null);
	}

    protected function get_users($data=0) {
        $last_id = intval($data['last_id'] ?? 0);
        $user = static::$auth;
        $sql = sprintf("SELECT id, name FROM %s WHERE status > 0 AND id <> %u", 'users', $user['userId']);
        $msg = static::execQuery($sql);
        return $this->sendResponse($msg, null);
	}

    protected function send_msg($data) {
        if (empty($data['content']) || empty($data['subject']) || empty($data['user_id'])) {
            return static::refuseData('Missing data for message!');
        }
        $user = static::$auth;
        $msg = [
            'sender_id' => $user['userId'],
            'target_id' => $data['user_id'],
            'subject' => $data['subject'],
            'content' => $data['content'],
            'status' => 0,
            'created' => date("Y-m-d H:i:s")
        ];

        if (!$this->save($msg)) {
            return static::refuseData('Message sending failed!');
        }
        $msg['id'] = $this->inserted_id();
        $msg['name'] = $data['name'] ?? '';
        return $this->sendResponse($msg, null);
    }

	protected function delete_msg($data=null) {
        $user = static::$auth;
        if (empty($data['id'])) {
            return static::refuseData('Invalid, missing message id!');
        }
        $id = $data['id'];
        $msg = static::getById($id);
        if ($msg['sender_id'] == $user['userId'] && in_array($msg['visibility'], [0, 2])) {
            $msg['visibility'] += 1;
        } else if($msg['target_id'] == $user['userId'] && in_array($msg['visibility'], [0, 1])) {
            $msg['visibility'] += 2;
        }

        if ($msg['visibility'] < 3 ) {
            if ($this->save($msg)) {
                return $this->sendResponse(['msg' => $msg, 'inbox' => true], null);
            }
        } else {
            if (static::deleteById($id)) {
                return $this->sendResponse(['msg' => $msg], null);
            }
        }
        return static::refuseData('Unable to delete this message!');
 	}


}

$gallery = new Message();

?>
