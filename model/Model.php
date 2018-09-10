<?php
session_start();
header('Content-Type: application/json');
unset($_SESSION['domain']);
class Model {
	protected static $request = [];
	protected static $method;
	protected static $auth;

	protected static $DATABASE = [
		"HOST" => 'localhost',
		"USER" => 'root',
		"PASSWORD" => 'root',
		"DATABASE" => "my_db"
	];
	protected static $PATTERN = [
		'EMAIL' => '/^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$)$/',
		'NAME_HUN' => '/^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû]+)$/',
		'NAME' => '/^([a-zA-Z0-9 ]+)$/',
		'INTEGER' => '/^([0-9]+)$/',
		'SLUG' => '/^[a-zA-Z0-9-_]+$/',
		'ALPHA_NUM' => '/^([a-zA-Z0-9]+)$/',
		'STR_AND_NUM' => '/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/',
		'LOWER_UPPER_NUM' => '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/',
	];
	
	protected function requestValidation() {
		$table_rules = static::$INPUT_RULE;
		$inputs = static::$request['data']['param'];
		$patterns = static::$PATTERN;
		$method = static::$request['data']['action'];
		
		if (!empty(static::$ACTION_RULE[$method])) {
			$table_rules = array_merge($table_rules, static::$ACTION_RULE[$method]);
		}

		foreach ($inputs as $field => $input) {
			if (empty($table_rules[$field])) { continue; }
			$input = trim($input);
			$rules = $table_rules[$field];
			$required = false;
			foreach ($rules as $rule => $cond) {
					
				if (!is_string($rule)) {
					$rule = $cond;
				}

				if ($rule === "require") {
					$required = true;
					if ($required && $input === "") {
						$this->refuseData("invalid form data");
					}
				} else if ($rule === "type") {
						if (!$required && $input === "") { continue; }
					if (!$this->validateString($input, $cond)){
						echo $field.': invalid';
						$this->refuseData("invalid form data");
					}
				} else if ($rule === "length") {
					if (!$required && $input === "") { continue; }
					$len = strlen($input); 
					if ($len < $cond[0] || $len > $cond[1]) {
						$this->refuseData("invalid form data");
					}
				} else if ($rule === "isUnique" && $cond) {
					if (static::countAll("email = '".$input."'")) {
						$this->refuseData( ucfirst($field)." already exist!");
					}
				} else if ($rule === "match") {
					if ($input !== $inputs[$cond]) {
						$this->refuseData( ucfirst($field)." not match with ".ucfirst($cond));
					}
					unset (static::$request['data']['param'][$field]);
				}
			}
		}
	}
	
	public function setAuthKey(){
		$hash = $this->getData('hash', ''); 
		static::$auth = (isset($_SESSION[$hash])) 
			? [
				'hash' => $hash, 
				'role' => $_SESSION[$hash]['rank'],
				'name' => $_SESSION[$hash]['name'],
				'domain' => $_SESSION['domain'],
			]
			: [
				'hash' => '', 
				'role' => 0, 
				'name' => 'Guest',
				'domain' => $_SESSION['domain'],
			];		
	}
	
	public function domainVerification(){
		if (isset($_SESSION['domain'])) {
			if ($this->getData('domain', '') !== $_SESSION['domain']) {
				$this->setAuthKey();
				$this->refuseData("invalid domain token");
			} 
		} 
		
		$_SESSION['domain'] = md5(uniqid().time()).md5($_SERVER['REMOTE_ADDR'].'_'.uniqid());
				
	}
	
	public function __construct(){
		static::$request['method'] = strtoupper($_SERVER['REQUEST_METHOD']);
		static::$request['data'] = static::$request['method'] == "POST" 
			? array_merge($_POST, $_GET) 
			: $_GET;

		$this->domainVerification();
		$this->setAuthKey();
		
		if (!isset(static::$request['data']['param'])) {
			static::$request['data']['param'] = null;
		}else{
			if (!empty(static::$INPUT_RULE)) {
				$this->requestValidation();
			}
		}

		try {
			$method = static::$request['data']['action'];
			static::$method = $method;
		} catch (Exception $e) {
			static::refuseData();
		}

		
		
		$param = isset(static::$request['data']['param']) 
			? static::$request['data']['param'] 
			: null;
		$this->$method($param);	
		
	}
	
	protected function getParam($str, $type='ALPHA_NUM', $default){
		if (empty(static::$request['data']['param']) || empty(static::$request['data']['param'][$str])) {
			return $default;
		}
		return $this->validateString(static::$request['data']['param'][$str], $type) 
			? static::$request['data']['param'][$str] 
			: $default;
	}
	
	protected function getData($str, $default){
		if (empty(static::$request['data']) || empty(static::$request['data'][$str])) {
			return $default;
		}
		return $this->validateString(static::$request['data'][$str], 'ALPHA_NUM') 
			? static::$request['data'][$str] 
			: $default;
	}	
	
	protected function validateString($str, $type="ALPHA_NUM") {
		return preg_match(static::$PATTERN[$type], htmlspecialchars(trim($str), ENT_QUOTES));
	}


	public static function refuseData($str="internal server error", $renderFunc=null){
		$notify = ($str && !is_array($str)) ? [$str, 'error'] : $str;
		die(json_encode([
			"data" => [
				"modelData" => null,
				"renderFunc" => $renderFunc,
			], 
			"success" => false, 
			"notify" => $notify,
			"error" => $str, 
			"auth" => static::$auth,
		]));
	}	
	
	public function sendResponse($modelData=null, $renderFunc=false, $notifyMsg=false){
		// we send back the data from model (optional can define a view handler)
		$method = static::$method;
		if ($notifyMsg && is_string($notifyMsg)) {
			$notifyMsg = [$notifyMsg, 'normal'];
		}
		static::$auth['domain'] = $_SESSION['domain'];
		die(json_encode([
			"data" => [
				"modelData" => $modelData,
				"renderFunc" => $renderFunc,
			], 
			"notify" => $notifyMsg,
			"success" => true, 
			"error" => false, 
			"auth" => static::$auth,
		]));		
	}
	
    public static function getById ($id){
		return static::readRecords(sprintf('`id` = %u',$id), true);
		
    }
	
    public static function getAll(){
		return static::readRecords('1', true, true);
    }	

	public function save($data=null) {
		if (!$data) { return false; }
		$method = (isset($data['id']) && $data['id'] > -1) ? 'update' : 'insert';
		if (!empty(static::$AUTO_FILL[static::$method])) {
			$auto_fill = static::$AUTO_FILL[static::$method];
			foreach($auto_fill as $field => $value) {
				$data[$field] = $value;
			}
		}
		return $this->$method($data);
	}
	
	public static function getConn() {
		static $conn = null;
		if ($conn===null) {
			extract(static::$DATABASE, EXTR_PREFIX_SAME, "wddx");
			$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DATABASE);
			mysqli_set_charset($conn,"utf8");
			//if connection not exist then send error message
			if (!$conn) {
				static::refuseData("cannot connect to database");		
			}
		}
		return $conn;
	}	

    public static function countAll($cond='1'){
		$query=sprintf("SELECT count(*) as c FROM `%s` WHERE %s",static::$TABLE_NAME, $cond);
		$result = static::execQuery($query);
		if (!empty($result)){
			return $result[0]['c'];
		}else{
			return false;
		}
    }
	
    public static function getPage($index=0, $amount, $cond='1'){
    	return static::readRecords($cond, true, true, $index, $amount);   
    }	
	
	public static function inserted_id(){
		return mysqli_insert_id(static::getConn());
	}
	
	public function insert($data){
		if (empty($data['created'])) { $data['created'] = date("Y-m-d H:i:s"); }
		$keys = implode(', ',array_keys($data));
		$values = implode('", "',array_values($data));
		$query = sprintf('INSERT INTO `%s` ( %s ) VALUES ( "%s" )', static::$TABLE_NAME, $keys, $values);
		return static::execQuery($query);
	}
	
	public function update($data){

		$id = intval($data['id']);
		if (empty($data['updated'])) { $data['updated'] = date("Y-m-d H:i:s"); }
		$pair = [];
		foreach ($data as $field => $value){
			$pair[] = $field.' = "'.$value.'"';
		}
		$query = sprintf("UPDATE `%s` SET %s WHERE id='%u'", static::$TABLE_NAME, implode(', ',$pair), $id);

		return static::execQuery($query);
	}	

    protected function setRecord ($record){
		foreach($record as $key => $value){
			$this->$key = $value;
		}
    }		
    
    protected static function deleteById($id=0){
		return static::deleteRecords('id = '.intval($id));
	}
		
    protected static function deleteRecords($conditions="0"){
		$query=sprintf("DELETE FROM `%s` WHERE %s",static::$TABLE_NAME,$conditions);
		return static::execQuery($query);
    }	
	
	protected static function readRecords ($conditons="1", $returnData=false, $array=false, $pageIndex=0, $perPage=PHP_INT_MAX, $orderBy=false, $orderDesc=false){
		if ($perPage < 1) $perPage = 30;
		$orderBy = $orderBy ? sprintf("ORDER BY `%s` %s",$orderBy,$orderDesc ? "DESC" : "ASC") : "";
		$startPage = $pageIndex>-1 ? ($pageIndex*$perPage): 0;
		$endPage = $pageIndex>-1 ? $perPage : PHP_INT_MAX;
		$joinStr = "";
		$tableName = static::$TABLE_NAME;
		$query = sprintf("SELECT * FROM `%s` %s WHERE %s %s LIMIT %u, %u",$tableName,$joinStr, $conditons,$orderBy, $startPage,$endPage);
		$result = static::execQuery($query);
		// we check if we got result
		if (!empty($result)){
			// we check if we need return data
			if ($returnData !== false){
				return !$array ? $result[0] : $result;
			}
			return true;
		}else{
			return false;
		}		
	}
	
	public function getInsertedId(){
		if (isset($this->id)) {
			return $this->id;
		}else{
			return mysqli_insert_id(static::getConn());
		}
		
	}
	
	protected static function execQuery ($query){
		$queryResult = mysqli_query(static::getConn(), $query);
		
		if (substr($query,0,6) !== "SELECT") {
			return mysqli_affected_rows(static::getConn()) > 0 
				? true 
				: false;
		}		
		if (!$queryResult) {
			static::refuseData("database error");			
		}
		
		if (is_object($queryResult)){
			$result = [];
			$hidden = (isset(static::$HIDDEN)) ? static::$HIDDEN : false;
			
			while($row = mysqli_fetch_assoc($queryResult)){
				if ($hidden) {
					foreach($row as $field => $value){
						if (in_array($field, $hidden)) {
							unset($row[$field]);
						}
					}
				}
				$result[] = $row;
			}; 
			mysqli_free_result($queryResult);
			return $result;
		}
		return $queryResult;
	
	}	
}


?>