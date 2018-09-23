<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});

class Article extends Model {
    public static $TABLE_NAME = 'articles';
    public static $INPUT_RULE = [
        'id' => ['type'=>'INTEGER'],
        'user_id' => ['type'=>'INTEGER'],
        'rank' => ['type'=>'INTEGER'],
        'category_slug' => ['type'=>'SLUG'],
        'view' => ['type'=>'INTEGER'],
        'title' => ['type'=>'NAME_HUN', 'length' => [3, 100]],
        'slug' => ['type'=>'SLUG'],
        'content' => ['type'=>'STRING', 'length' => [0, 65535]],
    ];
    public static $ROLE_REQ = [
        'add' => 3,
        'delete' => 3
    ];
    // the categories are hard coded - slug => display.name
    public static $CATEGORY = [
        'prophecy' => 'Próféciák',
        'preachers' => 'Tanitások',
        'diverse' => 'Érdekességek',
        'testimonies' => 'Bizonyságok',
        'sign-of-end-time' => 'Idők jelei',
    ];

	protected function index($data) {
        extract($data);
        $user = static::$auth;
        $slug = empty(static::$CATEGORY[$category_slug]) ? array_keys(static::$CATEGORY)[0] : $category_slug;
        $condition = sprintf("rank >= '%u' AND category_slug = '%s'", $user['rank'], $slug);
        $result = static::readRecords($condition, true, true);
        return $this->sendResponse([
            [
                'selected' => $slug,
                'categories' => static::$CATEGORY,
                'articles' => $result
            ]], 'build');
	}

    protected function view($data) {
        extract($data);
        $user = static::$auth;
        $condition = sprintf("rank >= '%u' AND slug = '%s'", $user['rank'], $slug);
        $result = static::readRecords($condition, true, false);
        if (!empty($result['content'])) {
            $result['content']  = nl2br($result['content']);
        }
        return $this->sendResponse([
                ['article' => $result]
            ], 'build');
    }

    protected function delete($data=null) {
        $id = intval($data['id']);
        $article = static::getById($id);
        if (empty($article)) { return static::refuseData('Nincs már meg ez a cikk!'); }
        static::deleteById($id);
        return $this->sendResponse(['url' => '/article/'.$article['category_slug']], 'redirect');
    }


    protected function add($data=null) {
        $user = static::$auth;
        if (static::$request['method'] == "POST") {
            $newArticle = [
                'user_id' => $user['userId'],
                'slug' => static::slugify($data['title']),
                'category_slug' => $data['category_slug'],
                'title' => $data['title'],
                'content' => $data['content'],
                'rank' => $data['rank']
            ];
            if (intval($data['id']) > 0) {
                $newArticle['id'] = $data['id'];
            }

            if($this->save($newArticle)) {
                return $this->sendResponse(['url' => '/article/view/'.$newArticle['slug']], 'redirect');
            }
            return static::refuseData('Nem sikerült lementeni!');
        } else {
            $response = ['categories' => static::$CATEGORY];

            if (!empty($data['slug'])) {
                $condition = sprintf("rank >= '%u' AND slug = '%s'", $user['rank'], $data['slug']);
                $response['article'] = static::readRecords($condition, true, false);
            }

            return $this->sendResponse([$response], 'build');
        }
    }
}

$article = new Article();

?>
