<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Article extends Model {

    public static $TABLE_NAME = 'articles';
    public static $ROLE_REQ = [
        'delete' => 3
    ];

	protected function index($data){
		//$auth = static::$auth;
		//$guestbook = static::execQuery("SELECT id, user_id as userId, name, email, message, created, updated FROM `guestbook` WHERE status < ".($auth['role']+1)." ORDER BY created DESC");
		//return $this->sendResponse([$guestbook, $container], $renderFunc);
	}

  protected function delete($data=null){
    //return $this->sendResponse([
    //    "deleted"=>static::deleteById(intval($data['id']))
    //  ], null);
  }


  protected function add($data=null){
      /*
    if ($data['name'] === "session") {
            $user_data = $_SESSION[$_SESSION['token']];
            $data['name'] = $user_data['name'];
            $data['email'] = $user_data['email'];
        }
        if ($data['id'] === "0") {
            unset($data['id']);
            $data['user_id'] = $user_data['id'];
        } else {
            if (!static::modifiable($data['id'],0,2)) {
                return static::refuseData('hozzászólás nem található vagy nincs jogod hozzá!');
            }
        }

        if (!$data['user_id']) { $data['user_id'] = 0; }
        if($this->save($data)) {
            if (!$data['id']) { $data['id'] = static::inserted_id(); }
            $data['userId'] = $data['user_id'];
            $data['created'] = date("Y-m-d H:i:s");
            return $this->sendResponse([$data]);
        } else {
            return static::refuseData('Nem sikerült lementeni!');
        }
    }
    */

}

$article = new Article();

?>
