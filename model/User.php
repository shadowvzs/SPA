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
		'email' => ['require', 'type' => 'EMAIL', 'length' => [5, 50], 'isUnique' => false],
		'password' => ['require', 'type' => 'ALPHA_NUM', 'length' => [6,64]],	//ALPHA_NUM LOWER_UPPER_NUM
        // --- not used options ---
        //'status' => ['type' => 'INTEGER', 'insert' => 1],
		//'rank' => ['type' => 'INTEGER', 'insert' => 1],
 		//'created' => ['type' => 'MYSQL_DATE', 'insert' => '$date$'],
 		//'updated' => ['type' => 'MYSQL_DATE', 'insert' => '$date$', 'update' => '$date$'],
 	];

    public static $USER_STATUS = ['Guest', 'Active', 'Banned', 'Deleted'];

	public static $ACTION_RULE = [
		'add' => [
            'password2' => ['match' => 'password'],
            'email' => ['isUnique' => true]
        ],
        'settings' => [
            'password' => [
                'empty' => true,
                'type' => 'ALPHA_NUM',
                'length' => [6,64]
            ],
            'password_new1' => [
                'type' => 'ALPHA_NUM',
                'length' => [6,64]
            ],
            'password_new2' => ['match' => 'password_new1'],
        ]
 	];

    public static $ROLE_REQ = [
        'settings' => 1,
        'get_my_data' => 1,
        'admin_edit' => 3,
        'delete_user' => 3
    ];

	public static $AUTO_FILL = [
		'add' => [
			'status' => 1,
			'rank' => 1,
		]
 	];


	protected function login($user_data){
		extract($user_data, EXTR_PREFIX_SAME, "wddx");
		$result = static::readRecords(sprintf("email='%s' AND password='%s'", $email, $this->createPassword($password)), true, false);
		if (!$result){
			return static::refuseData('Email and password pair not exist in database!');
		}

        if ($result['status'] != 1){
            $status = static::$USER_STATUS[$result['status']] ?? 'Unknown';
            return static::refuseData("Sorry but your account status is $status !");
        }
		$hash = md5(uniqid().time()).md5(rand(0,10000).'_'.uniqid());
		static::$auth = [
			'hash' => $hash,
			'role' => $result['rank'],
			'name' => $result['name'],
            'userId' => $result['id'],
		];
		$_SESSION[$hash] = $result;
		$_SESSION['token'] = $hash;
        $this->save([ 'id' => $result['id'], 'updated' => date("Y-m-d H:i:s")]);
		$this->sendResponse(['/home'], 'render.redirect', ['Sikeres bejelentkezés!', 'success']);
	}

	protected function logout($data=null){
		if (isset($_SESSION['token'])) {
			unset($_SESSION[$_SESSION['token']]);
		}
		static::$auth = [
			'hash' => '',
			'role' => 0,
            'userId' => 0,
			'name' => 'Guest',
		];
		$this->sendResponse(['/home'], 'render.redirect', 'Sikeres Kijelentkezés!');
	}

    protected function createPassword($pw) {
        return md5($pw);
    }

	protected function add($user_data=null){
		$login_data = [
			'email' => $user_data['email'],
			'password' => $user_data['password'],
		];
        $user_data['ip'] = $_SERVER['SERVER_ADDR'];
		$user_data['password'] = $this->createPassword($user_data['password']);
		if($this->save($user_data)) {
			$this->login($login_data);
		} else {
			return static::refuseData('Regisztráció sikertelen!');
		}
	}

    protected function index($index=0) {
        $perPage = 2000;        // at moment not have any point to make it with pagination
        $cond = static::$auth['role'] > 2;
        $users = static::getPage($index, $amount, $cond);
        $addon = ['page' => $index];  //additional data if once i make pagination
        return $this->sendResponse([$users, $addon], 'build');
    }

    protected function view($id=0) {
        $role = static::$auth['role'];
        $cond = $role > 100 ? 1 : 'status = 1';
        if ($result = static::readRecords(sprintf('`id` = %u AND %s', $id, $cond), true)) {
            return $this->sendResponse([$result, $role], 'build');
        } else {
            return static::refuseData('Felhasználó nem található!', 'redirect');
        }
    }

    protected function save_status() {
        $id = static::$auth['userId'];
        if ($id > 0) {
            $sql = sprintf("SELECT count(id) as count FROM `messages` WHERE visibility IN (0,1) AND target_id = %u AND status = 0", $id);
            $msgCounter = static::execQuery($sql)[0];
            $this->save([ 'id' => $id, 'last_action' => time()]);
            return $this->sendResponse($msgCounter, null);
        }
    }

    protected function get_my_data() {
        if (static::$auth['role'] === 0) {
            return static::refuseData('Your user data not exist!');
        }

        $user = static::getById(static::$auth['userId']);
        if (empty($user)) { return static::refuseData('Invalid user id or deleted user!'); }
        unset($user['password']);
        unset($user['id']);
        unset($user['rank']);
        return $this->sendResponse($user, 'get');
    }

    protected function edit($data) {
        extract($data, EXTR_PREFIX_SAME, "wddx");
        $user = static::getById(static::$auth['userId']);
        if (empty($user)) { return static::refuseData('Your user data not exist!'); }

        $newData = [
            'id' => static::$auth['userId'],
            'name' => $name,
            'city' => $city,
            'phone' => $phone,
            'email' => $email,
            'address' => $address
        ];

        if (!empty($password)) {
    		if ($this->createPassword($password) != $user['password']) {
    			return static::refuseData('Wrong current password!');
    		}
            if (empty($password_new1)) {
                return static::refuseData('Invalid new password!');
            }
            $newData['password'] = $this->createPassword($password_new1);
        }

        if ($this->save($newData)) {
            $user = &$_SESSION[$_SESSION['token']];
            $user = array_merge($user, $newData);
            return $this->sendResponse($newData, 'update');
        }
        return static::refuseData('Something went wrong, we cannot save your data!');
    }

    protected function admin_edit($data) {
        extract($data, EXTR_PREFIX_SAME, "wddx");
        $user = static::getById($id);
        if (empty($user)) { return static::refuseData('User data not exist!'); }

        $newData = [
            'id' => $id,
            'status' => $status,
            'rank' => $rank,
            'email' => $email,
        ];

        if ($this->save($newData)) {
            return $this->sendResponse($newData, null);
        }
        return static::refuseData('Something went wrong, we cannot save the user data!');
    }

    protected function delete_user($data) {
        if (empty($data['id'])) { return static::refuseData('User id missing!'); }
        $id = intval($data['id']);
        $user = static::getById($id);
        if (empty($user)) { return static::refuseData('User data not exist!'); }

        if (static::deleteById($id)) {
            return $this->sendResponse(['id' => $id], null);
        }
        return static::refuseData('Something went wrong, we cannot delete this user data!');
    }

}

$user = new User();

?>
