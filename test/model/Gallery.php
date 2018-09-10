<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Gallery extends Model {

    public static $TABLE_NAME = 'albums';
	public static $HIDDEN = ['password'];
	public static $validation = [];
	public static $DIRECTORY = [
		'IMAGE' => '/gallery/album/',
		'THUMB' => '/test/img/gallery/mini/'
	];
    public static $INPUT_RULE = [
		'id' => ['type'=>'INTEGER'],
		'index' => ['type'=>'INTEGER'],
 	];	
	
	//public static $AUTO_FILL = [
		//'add' => [
		//	'status' => 1,
		//	'rank' => 1,
		//]
 	//];
	

	protected function index(){
		$Auth = static::$auth;
		$cond = $Auth['role'] > 0 ? ['1', '1'] : ['i.status = 1', 'a.status = 1'];
		//role
		$sql = "SELECT a.id as id, a.user_id as userId, a.title as title, a.description as description, a.created as created, i.mid as imageId, i2.path as coverImage 
			FROM albums as a
			LEFT JOIN 
				(SELECT i.album_id as album_id, MAX(i.id) as mid 
					FROM `images` as i 
					WHERE ".$cond[0]." 
					GROUP BY i.album_id
				 ) as i 
				 ON i.album_id = a.id
			INNER JOIN images i2
				ON i2.id = i.mid
			WHERE ".$cond[1];
		$albums = static::execQuery($sql);
		$renderFunc = 'build';	
		$container = '.album-box-container';
		return $this->sendResponse([$albums, $container], $renderFunc);
	}
	
	protected function album($data=null){
		
		$id = $data['id'];
		$index = isset($data['index']) ? $data['index'] : 0;
		$Auth = static::$auth;
		$cond = $Auth['role'] > 0 ? ['1', '1'] : ['status = 1', 'i.status = 1'];

		$albums = static::execQuery(
			"SELECT id, user_id as userId, title
			FROM albums
			WHERE ".$cond[0]
		);
		
		$title = false;
		foreach ($albums as $album) {
			if ($album['id'] == $id) {
				$title = $album['title'];
			}
		}
		
		if (!$title) {
			return static::refuseData('Album not exist!');
		}
		// if no join we can get index in query like this
		//, @curRow := @curRow + 1 AS index 
		//JOIN (SELECT @curRow := 0) r
		$images = static::execQuery("SELECT u.name as name, i.id as id, i.status as status, i.album_id as albumId, i.user_id as userId, i.path as path, i.description as description, i.created as created, i.updated as updated, i.album_id as parentId
			FROM images as i
			LEFT JOIN users as u
			ON u.id = i.user_id
			WHERE ".$cond[1]." AND i.album_id = ".$id);
		$len = count($images);
		for ($i=0;$i < $len; $i++){
			$images[$i]['index'] = $i+1;
		} 
		$data = [ ['title'=>$title], $albums, $images];
		// we send every data with a single response
		// to multiple render function, se we can update 
		// multiple element with 1 response
		$multicall = [];
		$multicall[] = [$data, 'build'];
		
		// we send images from selected album to popUp.dataList, 
		// so don't need request for image next/previous in popUp window
		// Note: only YouTube videos and images use the popUp window
		$multicall[] = [$images, $index,'setPopUpData'];
		$multicall[] = ['album_'.$id, 'path','preloadImage'];

		if ($index > 0) {
			$multicall[] = ['image/'.$index, true,'popUpRender'];
		}
	
		return $this->sendResponse($multicall, 'multicall');
	}	

}

$gallery = new Gallery();

?>