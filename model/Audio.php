<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Audio extends Model {

	public static $TABLE_NAME='news';

    protected function index() {
		$audios = static::execQuery("SELECT id, title, source as src, duration FROM `audios`");
		return $this->sendResponse([$audios, null],'build');
	}

    protected function get() {
		$audios = static::execQuery("SELECT id, title, source as src, duration FROM `audios`");
		return $this->sendResponse($audios);
	}
}

$audio = new Audio();

?>
