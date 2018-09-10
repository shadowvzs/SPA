<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Video extends Model {

	protected function index($data){
		// this not used
		// i created only becuse i thougth maybe late would be usefull
	}
	

}

$video = new Video();

?>