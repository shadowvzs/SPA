<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class User extends Model {

    public static $TABLE_NAME='users';
	public static $HIDDEN = ['password'];
    public static $INPUT_RULE = [
		'id' => ['type'=>'INTEGER'],
		'name' => ['require', 'type' => 'NAME_HUN', 'length' => [5, 50]],
		'country' => ['type' => 'NAME_HUN', 'length' => [5, 50]],
		'email' => ['require', 'type' => 'EMAIL', 'length' => [5, 50], 'isUnique' => true],
		'password' => ['require', 'type' => 'ALPHA_NUM', 'length' => [6,64]],
		//ALPHA_NUM LOWER_UPPER_NUM
		//'status' => ['type' => 'INTEGER', 'insert' => 1],
		//'rank' => ['type' => 'INTEGER', 'insert' => 1],
 		//'created' => ['type' => 'MYSQL_DATE', 'insert' => '$date$'],
 		//'updated' => ['type' => 'MYSQL_DATE', 'insert' => '$date$', 'update' => '$date$'],
 	];	
	public static $ACTION_RULE = [
		'login' => ['email' => ['isUnique' => false]],
		'add' => ['password2' => ['match' => 'password']],
	];
	public static $AUTO_FILL = [
		'add' => [
			'status' => 1,
			'rank' => 1,
		]
 	];
	

	protected function login($user_data){
		extract($user_data, EXTR_PREFIX_SAME, "wddx");
		if (!$this->validateString($email, 'EMAIL') || !$this->validateString($password, 'ALPHA_NUM')){
			return static::refuseData('invalid data format');
		}

		$result = static::readRecords(sprintf("email='%s' AND password='%s'", $email, md5($password)), true, false);
		if (!$result){
			return static::refuseData('Email and password pair not exist in database!');
		}
		
		$hash = md5(uniqid().time()).md5(rand(0,10000).'_'.uniqid());
		
		static::$auth = [
			'hash' => $hash, 
			'role' => $result['rank'],
			'name' => $result['name'],
		];
		
		$_SESSION[$hash] = $result;
		$_SESSION['token'] = $hash;

		$this->sendResponse(['/home'], 'render.redirect', ['Sikeres bejelentkezés!', 'success']);
	}
	
	protected function logout($data=null){

		if (isset($_SESSION['token'])) {
			unset($_SESSION[$_SESSION['token']]);
		}
		
		static::$auth = [
			'hash' => '', 
			'role' => 0,
			'name' => 'Guest',
		];		
		$this->sendResponse(['/home'], 'render.redirect', 'Sikeres Kijelentkezés!');
	}
	
	protected function add($user_data=null){
		
		$login_data = [
			'email' => $user_data['email'],
			'password' => $user_data['password'],
		];
		$user_data['password'] = md5($user_data['password']);
		if($this->save($user_data)) {
			$this->login($login_data);
		}else{
			return static::refuseData('Regisztráció sikertelen!');
		}
	}	

}

$user = new User();

?>