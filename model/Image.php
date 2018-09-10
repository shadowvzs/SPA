<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Image extends Model {

	public static $TABLE_NAME = 'images';
    public static $UPLOAD_FOLDER = "/img/gallery/";
    public static $THUMB_FOLDER = "/img/gallery/mini/";
    public static $MAX_HEIGHT = [
        'normal' => '1200',
        'thumb' => '240'
    ];
 	public static $INPUT_RULE = [
		'id' => ['type'=>'INTEGER'],
		'index' => ['type'=>'INTEGER'],
		'title' => ['type'=>'NAME_HUN', 'length' => [3, 100]],
		'description' => ['type'=>'STRING', 'length' => [0, 5000]],
 	];

    public static $ROLE_REQ = [
        'edit' => 2,
        'upload' => 2,
        'move' => 2,
        'deleteImage' => 3
    ];

	protected function index() {
	    /*
		$albums = static::execQuery($sql);
		$renderFunc = 'build';
		$container = '.album-box-container';
		return $this->sendResponse([$albums, $container], $renderFunc);
        */
	}

    protected function edit($data) {
        if (empty($data['id']) || empty($data['description'])) { return static::refuseData('Image id (or description) missing!'); }
        $image = static::getById($data['id']);
        if (empty($image)) { return static::refuseData('Image not exist in database!'); }
        if ($this->save([
               'id' => $data['id'],
               'description' => $data['description'],
        ])) {
            return $this->sendResponse([
                'id' => $data['id'],
                'description' => $data['description']
            ], null);
        } else {
            return static::refuseData('Cannot save into database!');
        }
    }

	protected function upload($data=null) {
        $user = static::$auth;
        if (empty($data['album_id'])) {
            return static::refuseData('Invalid, missing album_id or no file to upload!');
        }
        $albumId = $data['album_id'];
        $filename = uniqid().'_'.time().'.jpg';
        if (static::uploadImage($filename)) {
            if ($this->save([
                   'path' => $filename,
                   'user_id' => $user['userId'],
                   'description' => '',
                   'status' => 1,
                   'album_id' => $albumId,
            ])) {
                $image = static::getById($this->inserted_id());
                return $this->sendResponse([
                    'id' => $image['id'],
                    'status' => $image['status'],
                    'albumId' => $image['album_id'],
                    'userId' => $image['user_id'],
                    'path' => $image['path'],
                    'description' => $image['description'],
                    'parentId' => $image['album_id'],
                    'name' => $user['name'],
                    'original_name' => static::$files['image']['name']
                ], null);
            } else {
                static::deleteFile($_SERVER['DOCUMENT_ROOT'].static::$UPLOAD_FOLDER.$filename);
                static::deleteFile($_SERVER['DOCUMENT_ROOT'].static::$THUMB_FOLDER.$filename);
                return static::refuseData('MySQL error, we cannot save '.static::$files['image']['name']);
            }
       }
       return static::refuseData('Cannot upload '.static::$files['image']['name']);
	}

	protected function deleteImage($ids=null){
        foreach($ids as $id) {
            if (intval($id) == 0) {
                return static::refuseData('Do not cheat :p!');
            }
        }
        $ids = implode(',', $ids);
        $folder = "../img/gallery/";
        $folder_thumb = "../img/gallery/mini/";
        $images = static::readRecords ("id IN ($ids)", true, true);
        foreach($images as $image) {
            if (file_exists($folder.$image['path'])) {
                unlink($folder.$image['path']);
            }
            if (file_exists($folder_thumb.$image['path'])) {
                unlink($folder_thumb.$image['path']);
            }
        }
        static::deleteRecords("id IN ($ids)");
        return $this->sendResponse(['ids' => $ids, 'move' => false], null);
	}

    protected function move($data=null){
        $ids = $data['ids'];
        // verification for numbers
        foreach($ids as $id) {
            if (intval($id) == 0) {
                return static::refuseData('Do not cheat :p!');
            }
        }
        $ids = implode(',', $ids);
        $result = static::execQuery(sprintf( "UPDATE `%s` SET album_id='%d' WHERE id IN (%s)", static::$TABLE_NAME, $data['albumId'], $ids));
        return $this->sendResponse(['ids' => $ids, 'move' => true], null);
    }

    protected static function uploadImage($filename) {
        $maxSize = static::$MAX_HEIGHT;
        $file = static::$files['image'];
        $path = $_SERVER['DOCUMENT_ROOT'].static::$UPLOAD_FOLDER;
        $thumbPath = $_SERVER['DOCUMENT_ROOT'].static::$THUMB_FOLDER;

       // $source_image = imagecreatefromjpeg($file['tmp_name']);
        $image_data = file_get_contents($file['tmp_name']);
        try {
            $source_image = imagecreatefromstring($image_data);
        } catch (Exception $ex) {
            return static::refuseData('Invalid image!');
         }
        $oriWidth = imagesx($source_image);
        $oriHeight = imagesy($source_image);

        $newWidth = $oriWidth;
        $newHeight = $oriHeight;
        if ($oriHeight > $maxSize['normal']) {
            $newWidth = floor($oriWidth * ($maxSize['normal'] / $newHeight));
            $newHeight =$maxSize['normal'];
        }

        $thumbWidth = $oriWidth;
        $thumbHeight = $oriHeight;
        if ($thumbHeight > $maxSize['thumb']) {
            $thumbWidth = floor($oriWidth * ($maxSize['thumb'] / $thumbHeight));
            $thumbHeight = $maxSize['thumb'];
        }

        $virtual_image = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $newWidth, $newHeight, $oriWidth, $oriHeight);
        imagejpeg($virtual_image, $path.$filename, 75);

        $virtual_image = imagecreatetruecolor($thumbWidth, $thumbHeight);
        imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $oriWidth, $oriHeight);
        imagejpeg($virtual_image, $thumbPath.$filename, 75);

        return file_exists($path.$filename);
    }

}

$gallery = new Image();

?>
