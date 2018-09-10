<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Guest extends Model {

  public static $TABLE_NAME='guests';
	public static $AUTO_FILL = [
		'add' => [
			'status' => 1,
		]
 	];

	public function index($data=null) {
		$role = static::$auth['role']+1;
		$sql = "SELECT n.id, u.name, n.title, n.message, n.created, n.updated FROM `guests` as n LEFT JOIN `users` as u on n.user_id = u.id WHERE n.status <= $role ORDER BY n.created DESC";
		$result = static::execQuery($sql);
		// i hope this make it asier to understand
		// btw the $arg will be spread in js, so renderFun(...arg)
		$arg = [$result, 'created'];
		return $this->sendResponse($arg);
	}

	public function add($data=null) {

		if (static::$auth['role'] < 1) {
			return static::refuseData('Nincs jogosultsága!');
		}
		$user = $_SESSION[static::$auth['hash']];
		$newEvent = [
			'title' => $data['title'],
			'message' => $data['message'],
			'created' => $data['created'],
			'user_id' => $user['id'],
		];

		if ($data['id'] !== '-1') { $newEvent['id'] = $data['id']; }
		$saved = $this->save($newEvent);
		if($saved) {
			return $this->sendResponse([
				'id' => empty($newEvent['id']) ? static::inserted_id() : $newEvent['id'],
				'name' => $user['name'],
				'user_id' => $user['id'],
			]);
		}else{
			return static::refuseData('Nem sikerült lementeni!');
		}
	}

	public function delete($data=null) {
		if (empty($data['id'])){ return static::refuseData('Hiba történt!'); }
		if (static::deleteById($data['id'])) {
			return $this->sendResponse();
		}else{
			return static::refuseData('Nem sikerült törölni, lehet nem létezik!');
		}
	}

}

$guest = new Guest();
