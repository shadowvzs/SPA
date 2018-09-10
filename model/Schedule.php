<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});

class Schedule extends Model {
    public static $TABLE_NAME = 'schedules';
    public static $INPUT_RULE = [
        'id' => ['type'=>'INTEGER'],
        'ids' => ['type'=>'STRING'],
        'user_id' => ['type'=>'INTEGER'],
        'status' => ['type'=>'INTEGER'],
        'event_name' => ['type'=>'STRING', 'length' => [3, 100]],
        'event_at' => ['type'=>'STRING', 'length' => [0, 65535]],
    ];
    public static $ROLE_REQ = [
        'edit' => 3,
    ];

    protected function edit($data=null) {
        if (empty($data['ids'])) { return static::refuseData('Missing ids for schedule!'); }
        $ids = explode(',', $data['ids']);
        $user = static::$auth;
        foreach ($ids as $id) {
            if (!$this->save([
                'id' => $id,
                'user_id' => $user['userId'],
                'event_name' => $data['event_name_'.$id],
                'event_at' => $data['event_at_'.$id],
                'status' => $data['status'] ?? 1,
            ])) {
                return static::refuseData('Unable to save!');
            };
        }
        return $this->sendResponse(['url' => '/event'], 'redirect');
    }
}

$schedule = new Schedule();

?>
