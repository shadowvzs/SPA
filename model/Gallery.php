<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Gallery extends Model {

	public static $TABLE_NAME = 'albums';
	public static $INPUT_RULE = [
		'id' => ['type'=>'INTEGER'],
		'index' => ['type'=>'INTEGER'],
		'title' => ['type'=>'NAME_HUN', 'length' => [3, 100]],
		'description' => ['type'=>'STRING', 'length' => [0, 5000]],
 	];

    public static $ROLE_REQ = [
        'addAlbum' => 2,
        'deleteAlbum' => 3
    ];

	protected function index() {
		$role = static::$auth['role'];
		$cond = $role > 2 ? ['1', '1'] : ['i.status = 1', 'a.status = 1'];

		$sql = "SELECT a.id as id, a.user_id as user_id, a.slug as slug, a.status as status, a.title as title, a.description as description, a.created as created, i.mid as imageId, i2.path as coverImage
			FROM albums as a
			LEFT JOIN
				(SELECT i.album_id as album_id, MAX(i.id) as mid
					FROM `images` as i
					WHERE ".$cond[0]."
					GROUP BY i.album_id
				 ) as i
				 ON i.album_id = a.id
			LEFT JOIN images i2
				ON i2.id = i.mid
			WHERE ".$cond[1];
		$albums = static::execQuery($sql);
		$renderFunc = 'build';
		$container = '.album-box-container';
		return $this->sendResponse([$albums, $container], $renderFunc);
	}

	protected function album($data=null){
		$slug = $data['slug'];
        $parentAlbum = static::getBySlug($slug);
		$index = isset($data['index']) ? $data['index'] : 0;
		$role = static::$auth['role']+1;
		$cond = $role > 2 ? ['1', '1'] : ['status = 1', 'i.status = 1'];

		$albums = static::execQuery(
			"SELECT id, user_id as userId, slug, title
			FROM albums
			WHERE ".$cond[0]
		);

		$title = false;
		foreach ($albums as $album) {
			if ($album['id'] == $parentAlbum['id']) {
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
			WHERE ".$cond[1]." AND i.album_id = ".$parentAlbum['id']);
		$len = count($images);
		for ($i=0;$i < $len; $i++){
			$images[$i]['index'] = $i+1;
		}
		$data = [ ['title' => $title], $albums, $images];
		// we send every data with a single response
		// to multiple render function, se we can update
		// multiple element with 1 response
		$multicall = [];
		$multicall[] = [$data, 'build'];

		// we send images from selected album to popUp.dataList,
		// so don't need request for image next/previous in popUp window
		// Note: only YouTube videos and images use the popUp window
		$multicall[] = [$images, $index,'setPopUpData'];
		$multicall[] = ['album_'.$parentAlbum['id'], 'path','preloadImage'];

		if ($index > 0) {
			$multicall[] = ['image/'.$index, true,'popUpRender'];
		}

		return $this->sendResponse($multicall, 'multicall');
	}

	protected function addAlbum($data=null){
		extract($data);
		$user = static::$auth;

		$newAlbum = [
            'title' => $title,
            'slug' => static::slugify($title),
			'description' => $description,
			'user_id' => $user['userId'],
			'status' => 1
		];

		if ($id['id'] > 0) { $newAlbum['id'] = $id; }

		$saved = $this->save($newAlbum);
		if($saved) {
			$saved = static::getById($newAlbum['id'] ?? static::inserted_id());
			$renderFunc = $id['id'] > 0 ? 'update' : 'add';
			return $this->sendResponse($saved, $renderFunc);
		}

		return static::refuseData('Nem sikerült lementeni!');
	}

	protected function deleteAlbum($ids=null){
		$user = static::$auth;

		if (empty($ids)) {
			return static::refuseData('Select atleast 1 album!');
		}

		$safeIds = implode(',', array_filter($ids, function($e){ return intval($e) > 0; }));
		$folder = "../img/gallery/";
		$folder_thumb = "../img/gallery/mini/";
		$result = static::execQuery("SELECT `path`, `id` FROM `images` WHERE album_id IN ({$safeIds})");
		foreach($result as $image) {
			if (file_exists($folder.$image['path'])) {
				unlink($folder.$image['path']);
			}
			if (file_exists($folder_thumb.$image['path'])) {
				unlink($folder_thumb.$image['path']);
			}
		}
		static::execQuery("DELETE FROM `images` WHERE album_id IN ({$safeIds})");
		static::execQuery("DELETE FROM `albums` WHERE id IN ({$safeIds})");
		return $this->sendResponse(['ids' => $safeIds], 'remove', 'Albums was delete');
	}

}

$gallery = new Gallery();

?>
