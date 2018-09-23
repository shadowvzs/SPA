<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Event extends Model {

    //public static $TABLE_NAME='news';
    public static $ROLE_REQ = [
        'add' => 2,
        'delete' => 3
    ];

	public function index($data=null) {
		$role = static::$auth['role']+1;
		$lastNews = static::execQuery("SELECT n.id, u.name, n.title, n.message FROM `news` as n LEFT JOIN `users` as u on n.user_id = u.id WHERE n.status <= $role ORDER BY n.created DESC LIMIT 0, 1");
		$newsData = empty($lastNews[0]) ? ['title' => '', 'message' => ''] : $lastNews[0];
		$data = [
			'schedule' => static::execQuery("SELECT s.id, u.name, s.event_name, s.event_at FROM `schedules` as s LEFT JOIN `users` as u on s.user_id = u.id WHERE s.status <= $role LIMIT 0, 10"),
			'guests' => static::execQuery("SELECT g.id, u.name, g.title, g.message, g.created FROM `guests` as g LEFT JOIN `users` as u on g.user_id = u.id WHERE g.status <= $role AND g.updated >= CURDATE() ORDER BY g.created DESC LIMIT 0, 10"),
			'news' => "<h2>".$newsData['title']."</h2><p>".$newsData['message']."</p><div class='calendarIcon'><a href='*' data-action='toggle/cal_news'><div class='calendar-icon icon-48'></div></a></div>"
		];

		return $this->sendResponse([$data], 'build');
	}

	public function add($data=null) {

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

$event = new Event();
