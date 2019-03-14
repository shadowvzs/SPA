<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Guestbook extends Model {

    public static $TABLE_NAME = 'guestbook';
	public static $HIDDEN = ['password'];
    public static $INPUT_RULE = [
		'id' => ['type'=>'INTEGER'],
        'name' => ['type'=>'NAME_HUN'],
        'email' => ['type'=>'EMAIL'],
        'message' => ['type'=>'STRING'],
 	];

    public static $ROLE_REQ = [
        'delete' => 3
    ];

	protected function index($data) {
		$auth = static::$auth;
        $limit = 20;
        $index = 0;
        $status = "1";
        if ($auth['role'] < 3) {
            $status = "status = 1";
        }
		$guestbook = static::execQuery("SELECT id, user_id as userId, name, email, status, message, created, updated FROM `guestbook` WHERE $status ORDER BY created DESC");
		$container = null;
		return $this->sendResponse([$guestbook, $container], 'build');
	}

    protected function delete($data=null) {
        $id = intval($data['id']) ?? 0;
        return $this->sendResponse([
            "deleted" => static::deleteById($id),
            "id" => $id
        ], null);
    }

    protected function activate($data=null) {
        $id = intval($data['id']) ?? 0;
        $record = static::getById($id);
        $record['status'] = 1;
        unset($record['updated']);
        return $this->sendResponse([
            "status" => static::save($record),
            "id" => $id
        ], null);
    }

    protected static function modifiable($id, $req_role=0, $req_mod_rank=0) {
        $auth = static::$auth;
        if ($id == 0 || $auth['role'] >= $req_role) { return true; }

        $user_data = $_SESSION[$_SESSION['token']];
        $condition = (!empty($user_data['rank']) && $user_data['rank'] > $req_mod_rank)
                ? "1"
                : "user_id = ".$auth['userId'];
        return static::execQuery("SELECT count(*) as c FROM `".static::$TABLE_NAME."` WHERE ".$condition." AND id = ".$id)[0]['c'] == "0";
    }

    protected function add($data=null) {
        $auth = static::$auth;
        if ($data['name'] === "session" || $auth['userId'] > 0) {
            $data['name'] = $auth['name'];
            $data['email'] = $auth['email'];
            $data['status'] = 1;
        }
        if ($data['id'] == "0") {
            unset($data['id']);
            $data['user_id'] = $auth['id'];
        } else {
            if (!static::modifiable($data['id'], 0, 2)) {
                return static::refuseData('hozzászólás nem található vagy nincs jogod hozzá!');
            }
        }

        if (empty($data['user_id'])) { $data['user_id'] = 0; }

        if($this->save($data)) {
            if (empty($data['id'])) { $data['id'] = static::inserted_id(); }
            $data['userId'] = $data['user_id'];
            $data['created'] = date("Y-m-d H:i:s");
            return $this->sendResponse([$data]);
        } else {
            return static::refuseData('Nem sikerült lementeni!');
        }
    }

}

$guestbook = new Guestbook();

?>
