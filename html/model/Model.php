<?php
session_start();
header('Content-Type: application/json');
define('DEBUG',true);

class Model {
	protected static $files;
	protected static $request = [];
	protected static $method;
	protected static $auth;
	protected static $domain = "";
	protected static $LOG = true;
	protected static $LOG_DATA = [];

	protected static $DATABASE = [
		"HOST" => 'localhost',	//getenv('IP'),
		"USER" => 'root',		//getenv('C9_USER'),
		"PASSWORD" => 'root',	//'root',
		"DATABASE" => "kovacscsaba"
	];

	protected static $PATTERN = [
		'EMAIL' => '/^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$)$/',
		'NAME_HUN' => '/^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû]+)$/',
		'ADDRESS_HUN' => '/^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû\,\.\-]+)$/',
		'NAME' => '/^([a-zA-Z0-9 \-]+)$/',
		'INTEGER' => '/^([0-9]+)$/',
		'SLUG' => '/^[a-zA-Z0-9-_]+$/',
		'ALPHA_NUM' => '/^([a-zA-Z0-9]+)$/',
		'STR_AND_NUM' => '/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/',
		'LOWER_UPPER_NUM' => '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/',
		'STRING' => ['safeString']
	];

	public function __construct() {
		if (!empty($_FILES)) {
			static::$files = $_FILES;
		}
		static::$request['method'] = strtoupper($_SERVER['REQUEST_METHOD']);
		$isPost = static::$request['method'] == "POST";
		static::$request['data'] = $isPost
			? array_merge($_POST, $_GET)
			: $_GET;
		static::$domain = $this->getData('domain', '');
		if ($isPost) {
			$this->domainVerification();
		}
		$this->setAuthKey();
		$this->accessVerification();

		if (!isset(static::$request['data']['param'])) {
			static::$request['data']['param'] = null;
		} else {
			if (!empty(static::$INPUT_RULE)) {
				$this->requestValidation();
			}
		}

		try {
			$method = static::$request['data']['action'];
			static::$method = $method;
		} catch (Exception $e) {
			static::refuseData('Something went wrong!');
		}

		$param = isset(static::$request['data']['param'])
			? static::$request['data']['param']
			: null;

		if (!method_exists($this,$method)) {
			static::refuseData('Sorry but this action not exist!');
		}

		$this->$method($param);
	}

	protected static function deleteFile($path) {
		if (file_exists($path)) {
			unlink($path);
		}
	}

	public function accessVerification() {
		$action = static::$request['data']['action'] ?? false;
		if (!empty(static::$ROLE_REQ) && $action && isset(static::$ROLE_REQ[$action]) ) {
			if (static::$ROLE_REQ[$action] > static::$auth['role']) {
				return static::refuseData('No permission for this action!');
			}
		}
	}

	protected function requestValidation() {

		$table_rules = static::$INPUT_RULE;
		if (!empty(static::$ACTION_RULE[$method])) {
			$table_rules = array_merge($table_rules, static::$ACTION_RULE[$method]);
		}

		foreach ($inputs as $field => $input) {
			if (empty($table_rules[$field])) { continue; }
			$input = trim($input);
			$rules = $table_rules[$field];
			$required = false;
			foreach ($rules as $rule => $cond) {

				if (!is_string($rule)) { $rule = $cond; }

				if ($rule === "require" && !empty($cond)) {
					$required = true;
					if ($required && $input === "") {
						$this->refuseData("invalid form data - ".$field);
					}
				} else if ($rule === "type") {
					if (!$required && $input === "") { continue; }
					if (!$this->validateString($input, $cond)){
						$this->refuseData("invalid form data - ".$field);
					}
				} else if ($rule === "length") {
					if (!$required && $input === "") { continue; }
					$len = strlen($input);
					if ($len < $cond[0] || $len > $cond[1]) {
						$this->refuseData("invalid form data ".$field);
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
				'userId' => $_SESSION[$hash]['id'],
				'domain' => &static::$domain,
			]
			: [
				'hash' => '',
				'role' => 0,
				'name' => 'Guest',
				'userId' => 0,
				'domain' => &static::$domain,
			];
	}

	public function domainVerification() {
		if (isset($_SESSION['domain'])) {
			if (static::$domain !== $_SESSION['domain']) {
				$this->setAuthKey();
				$this->refuseData("invalid domain token");
			}
		} else {
			static::$domain = $_SESSION['domain'] = md5(uniqid().time()).md5($_SERVER['REMOTE_ADDR'].'_'.uniqid());
		}
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
		if (is_array(static::$PATTERN[$type])) {
			// if pattern not string then we call function,
			// example: "STRING" will be converted to static::safeString($string)
			if (static::$PATTERN[$type][0]) {
				$method = static::$PATTERN[$type][0];
				return static::$method($str);
			}
		}
		return preg_match(static::$PATTERN[$type], htmlspecialchars(trim($str), ENT_QUOTES));
	}


	public static function refuseData($str="internal server error", $renderFunc=null){
		$notify = ($str && !is_array($str)) ? [$str, 'error'] : $str;
		static::closeCon();
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
		static::$auth['domain'] = &static::$domain;
		static::closeCon();
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

	public static function getBySlug ($slug) {
 		   return static::readRecords(sprintf('`slug` = "%s"',$slug), true);
    }

    public static function getAll(){
			return static::readRecords('1', true, true);
    }

	public function save($data=null, $returnData=false) {
		if (!$data) { return false; }
		$method = (isset($data['id']) && $data['id'] > -1) ? 'update' : 'insert';
		if (!empty(static::$AUTO_FILL[static::$method])) {
			$auto_fill = static::$AUTO_FILL[static::$method];
			foreach($auto_fill as $field => $value) {
				$data[$field] = $value;
			}
		}
		return $this->$method($data, $returnData);
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

	public static function closeCon() {
		if (count(static::$LOG_DATA) > 0) { static::saveLog(); }
		$con = static::getConn();
		mysqli_close($con);
	}

  	public static function countAll($cond='1'){
		$query = sprintf("SELECT count(*) as c FROM `%s` WHERE %s",static::$TABLE_NAME, $cond);
		$result = static::execQuery($query);
		return empty($result) ? false : $result[0]['c'];
  	}

  	public static function getPage($index=0, $amount, $cond='1'){
  		return static::readRecords($cond, true, true, $index, $amount);
  	}

	public static function inserted_id(){
		return mysqli_insert_id(static::getConn());
	}

	public function insert($data, $returnData=false){
		if (empty($data['created'])) { $data['created'] = date("Y-m-d H:i:s"); }
		$keys = implode(', ',array_keys($data));
		$values = implode('", "',array_values($data));
		$query = sprintf('INSERT INTO `%s` ( %s ) VALUES ( "%s" )', static::$TABLE_NAME, $keys, $values);
		$result = static::execQuery($query);
		return $returnData ? $data : $result;
	}

	public function update($data, $returnData=false){

		$id = intval($data['id']);
		if (empty($data['updated'])) { $data['updated'] = date("Y-m-d H:i:s"); }
		$pair = [];
		foreach ($data as $field => $value){
			$pair[] = $field.' = "'.$value.'"';
		}
		$query = sprintf('UPDATE `%s` SET %s WHERE id="%u"', static::$TABLE_NAME, implode(', ',$pair), $id);
		$result = static::execQuery($query);
		return $returnData ? $data : $result;
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
		$query = sprintf("DELETE FROM `%s` WHERE %s",static::$TABLE_NAME,$conditions);
		return static::execQuery($query);
    }

	protected static function readRecords ($conditons="1", $returnData=false, $array=false, $pageIndex=0, $perPage=PHP_INT_MAX, $orderBy=false, $orderDesc=false) {
		if ($perPage < 1) { $perPage = 30; }
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
		}
		return false;
	}

	public static function slugify ($string) {
	    $string = utf8_encode($string);
	    $string = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
	    $string = preg_replace('/[^a-z0-9- ]/i', '', $string);
	    $string = str_replace(array(' - ',' -','- ',' '), '-', $string);
	    $string = trim($string, '-');
	    $string = strtolower($string);
	    if (empty($string)) {
	        return 'n-a';
	    }
	    return $string;
	}

	protected static function saveLog() {
		$values = "(".implode("),(", static::$LOG_DATA).")";
		$columns = implode(",", ['user_id', 'type', 'action', 'data', 'ip', 'created']);
		return static::execQuery("INSERT INTO `logs`($columns) VALUES $values", false);
	}

	protected static function addLog($type, $action, $data) {
		$user_id = static::$auth['userId'];
		$ip = $_SERVER['REMOTE_ADDR'];
		$date = date("Y-m-d H:i:s");
		static::$LOG_DATA[] = "'".implode("','", [$user_id, $type, $action, json_encode(['data' => $data]), $ip, $date])."'";
	}

	protected static function execQuery ($query, $logable=true) {
		$queryResult = mysqli_query(static::getConn(), $query);
		$queryAction = explode(' ',$query)[0];
		$log = $logable && static::$LOG;
		if ($queryAction !== "SELECT") {
			$affectedRows = mysqli_affected_rows(static::getConn()) > 0
				? true
				: false;
			if ($log) {
				static::addLog($affectedRows ? 1 : 2, $queryAction, $query);
			}
			return $affectedRows;
		}

		if (!$queryResult) {
			if ($log) { static::addLog(2, $queryAction, $query); }
			static::refuseData(DEBUG ? "Failed query: $query" : "database error");
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

	protected static function safeString ($data){
		return static::xss_clean($data) === $data;
	}

	protected static function xss_clean($data) {
		// Fix &entity\n;
		$data = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $data);
		$data = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data);
		$data = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $data);
		$data = html_entity_decode($data, ENT_COMPAT, 'UTF-8');

		// Remove any attribute starting with "on" or xmlns
		$data = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data);

		// Remove javascript: and vbscript: protocols
		$data = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data);
		$data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data);
		$data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data);

		// Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
		$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
		$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
		$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $data);

		// Remove namespaced elements (we do not need them)
		$data = preg_replace('#</*\w+:\w[^>]*+>#i', '', $data);

		do {
			// Remove really unwanted tags
			$old_data = $data;
			$data = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data);
		} while ($old_data !== $data);

		// we are done...
		return $data;
	}
}
?>
