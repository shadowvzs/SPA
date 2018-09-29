# SPA
Single Page App (pure: JS - ES6, CSS3, PHP7 serverside, HTML5)
Note: 
* internet explorer support was dropped, this page for new generation browsers like: Chrome, Firefox, Opera etc
* README.md not exist in tags/releases, only master branch got this file!
* database structure was uploaded with v0.9.0 (https://github.com/shadowvzs/SPA/blob/v0.9.0/db/db.sql)

 * youtube: 
 	- basics: https://www.youtube.com/watch?v=rrejcoh2z2c
	- paralel file upload with components: https://www.youtube.com/watch?v=fczq-wxB0kA
	- messages: https://www.youtube.com/watch?v=-gvEvySDRqQ
	
 * demo: https://gyozelem.000webhostapp.com/home - v0.7.5
 * last version: https://github.com/shadowvzs/SPA/tree/v0.9.0

Single page application with javascript router, so don't need reload the page.

Requirement:
  - apache2 (url rewrite too)
  - php 7
  - es6 compatible browser
  - css3 compatible browser

## Changes log - short: 
<details> 
<summary>show the list</summary>
* Note: Pages vs component, page loaded in middle content, component will loaded a div, could be hide/show/toggle etc, could be permanent, page or/and role level depend.

* v0.9.0 fixes
	* fixed modal close button on right-top corner (also increased its size 40px -> 60px)
	* added click event to modal if user click outside then it will close the model
	* fixed problem if user wanted change his password
	* domain key need only if request method was post and not get
	* user page now allowed for any logged user, only it show less data about users for normal users
	* fixed problem with target user selection when someone click to mail icon in userlist
	* added more audio (.mp3)
* v0.8.5 logger
	* Log table created and it save the failed select query and every insert/delete/update with single query
	* changed few unicode text icon to css icons (ex. audio player main 3 button)
	* more optimazation in Model.php 
	* if a guest make comment in guestbook then moderator/admin must approve that comment
	* increased the required role level for calendar
* v0.8.0 improvements
	* calendar eventlisteners halved (changed to attribute link - see the description about router)
	* audio player loading was fixed and reduced the eventlisteners
	* browser back button event was fixed
	* popUp splited into components: modal, imageviewer, youtubeviewer component (last 2 manipulate the 1st one)
	* fixed sevaral z-index issue
	* removed image cacheing option
* v0.6.0 bigger update:
	* Pages: users
	* Components: settingsmanager, albummanager, imagemanager, usermanager, messagecenter, upload, contextmenu
	* feature: message sending, change your settings, user managing (status, rank change), paralel fileupload with progressbar,  right-click menu in gallery for admin
  	* fixed bug with calendar (first year stack/last month in year was ignored in counter)
	* replaced var with let/const
	* gallery was redesigned
	* in server side model also placed role level restriction for class methods
	* added "string" validation in Model.php
	* component have optional role level condition and fix if same page was loaded with same components
	* added global components and it is checked if user role was changed and remove if condition fail
	* popUp redesigned for images and got 100% width on mobil
	* in css added generic class for show/hide/effects/buttons
	* css separated into index.css (load in header) and delayed.css (load at end of the body)
	* style what not need instantly was moved into delayed.css
	* mian images was compressed with https://tinypng.com/
	* icons (.png) was replaced with base64 background-image and used like a css class
* v0.1.3 updateing:
 	* Pages: guestbook
	* Components: newscalendar, guestbook, audioplayer
	* pages got a fade transition effect
	* login, signup page transition fix
	* main file was renamed from App.php => index.php
	* replaced string replace templating with template functions (like compiled handlebar functions)
	* css mfiles merged into index.css
* v0.1.2 restructuring:
	* Component: eventcalendar
 	* separated js vs html
	* merged js files into App.js (like calendar.js)
	* in js was anonymus function to arrow function
	* css was destructured (ex. calendar got separate css file)
	* fixes/uniformization in PHP classes (serverside model)
	* file clean up
* v0.1/v0.1.1 init:
	* Pages: login, registration, home page, events (from json), gallery and youtube videos working
	* Component/Parts: popUp, calendar (beta with most basic functions)
	* new design & responsive design
	* template replace in html where was {{ }}
</details>

--------------------------------------

# File structure:

* css/*.css
* font/*.ttf
* img/
	* gallery
		* mini/*.jpg|png
		* *.jpg	
	* icons - would be removed
		* menu - would be removed
		* social - would be removed
	* static/*.jpg|png
* js/App.js
* model/*.php
* .htaccess
* index.php

--------------------------------------

# Client Side

## Main objects:
*except components & pages, every object will be constructed only once*

* **ajax** - constructor Ajax()
* **middleware** - constructor Middleware()
* **router** - constructor Router()
* **model** - constructor Model(middleware)
* **view** - constructor View(middleware)
* **controller** - constructor (middleware, model, view)
* **notify** - constructor Notify()


## Special Objects
* **pages** - object literal about page behaviours 
* **components** - *each component got his own constructor*

--------------------------------------

# Server Side
* **PHP** - the heart in backend
	* Model - every other class extends this one
	* Child Models - which table related classes like User
* **.htaccess** - for url rewrite / redirection to index.php

--------------------------------------
--------------------------------------

# ajax
<details>
<summary> show/hide </summary>
	
* **input param**: 
	* url - string
	* method - string
	* data - object
	* success - callback function (data)
	* error - callback function (data)

* **output property**: 
	* get(url, data, success, error)
	* post(url, data, success, error)
	* raw(setup, success, error)
	* file(url, data, success, null)

* **role**:
	* automatically send with request and modify the user hash and domain hash
	* connection between frontend and backend (send/ask data)
	* handle foward the reicived data to callbacks
	* if request got status fail then send **notify** message to user
	* if user rank changed (ex. login/logout) then call visibility render function from view
</details>

# notify
<details>
<summary> show/hide </summary>
	
* **use**:
	* message - string
	* type - string (default: 'error', 'success', 'normal', 'warning')

* **output**: 
	* add(message, type)
	* remove(id)

* **responsability**:
	* send to user an animated flash message at top-right corner
</details>

# router
<details>
<summary> show/hide </summary>
* **output property**: 
	* url() - return object (properties: base_path, base_url, url_array, query_string, query_array)
	* redirect(newUrl, title=null, obj=null) - redirect the page (call setPage from Controller)
	* setFullUrl(newUrl) - change url without other action
	* setUrl(urlAddon) - change url based on urlAddon (modelComponent use this option)
	* init() - delayed redirect()

* **note**:	
	* Appache .htaccess redirect everything to index.php so the url will be handled by Router object what got a contructor function and later will be created the instance 

* **role**:
	* manage history part (push state)
	* manage back button event


## Router in action
	
* You must define the available routes in Router constructor function like:
```
		routes = [
			/*
				which got * it is optional, not required!
				url(0): prefix*/model/action*/:param*
				prefix(1) - optional (use false if you don't use)
				auth(2)	  - required role level (null/false=public page)
				prefix(3)  - validation for params (ex: NUMBER/SLUG)
			*/
			//            0               1    2    3    
			['/admin/user/edit/:id/', 'admin', 3, ['NUMBER']],
			['/gallery/album/:slug/:index', false, null, ['SLUG','NUMBER']],
		];
```
* If current url structure match with anything (**validateRoute**) from routes array then call setPage method in Controller
	* if pages.model_action exist then build the page with model & view
		* pages_model_action got information about page name, if required mode data, which component use that page etc
	* else redirect to error page ( with id 404)
* Router have a global click event what check if current element/or his parent element have href attribute, if check if the link was one from following link type:
    * Redirect (internal) then push into history and replace url, call the setPage method
		* **/home**
    * Component then send data to popUpRender method in View object
		* **href="*" data-action="component/youtubeViewer/show/1"**
    * Toggle - toggle an element by id
		* **href="*" data-action="toggle/audioPlayer"**
    * SelectAll - toggle an element
		* **href="*" data-action="selectAll/"**
    * Submit collect input data and send to server (ex. login/registration)
		* **href="*" data-action="submit/login"**
    * else - normal link, jump to another site/server/domain
		* **href="https://google.com"**
</details>

# controller
<details>
<summary> show/hide </summary>

* **input property**: 
	* middleware object

* **role & useage**:
	* bridge between router and view/model (with middleware)
	* router through middleware can call & pass routedata to setPage function in controller
		* this terminate the old page
		* call model or view for build page depend on **render** in **pages** object
			* if render.model: true - get data from backend and call view.build()
				* we call: **model.getPageData(controller, action, param)**
			* if render.model: string - get api data then it call view.build()
				* we call: **model.getCustomData(render.model, param)**
			* if render.model not exist - static pages
				* we call: **view.build()**
</details>

# model
<details>
<summary> show/hide </summary>
	
* **input param**: 
	* nothing at moment but could be injected view or router

* **output property**: 
	* getPageData(controller, action, param) 
		* those data from url, like /user/edit/2
	* submitForm(formId, url, extraDataObject, successHandler)
		* formId - id on form element, which contain the form data fields
		* url - string
		* extraDataObject - object[optional] what we want insert into form datas
		* successHandler - function[optional] we can assign handler function if needed else backend must send which handle needed for processing the returned data
	* getCustomData(apiKey, param)
		* apiKey - string key for for Api object inside of model object
		* param what we send to api

* **role**:
	* this is the data source with ajax, send/ask data from backend
	* depend on function what we use, could be:
		* sending data to api and handle the request with inbuilt api functions
		* sending form:
			* gather every input, select, textarea inside of form element
			* validate data if data got rules and give error if something wrong:
				* **everything what you validate here, must validate in backend too!!**
				* attributes what needed for validation:
					* **id**: must have same prefix than form name
						* ex. form is loginForm, then email field id is login_email
					* **name**: same like id, must have same prefix
						* when we send data then form prefix cutted and param became the remaining string:
						* ex. **name="login_email"** when u send became **email=" *input value* "**
					* **title**: well, this is only optional but could be usefull
						* when validation fail and we have title then we send this message to user and not validator error message
					* **validators**: used for validate the inputs with predefined rules:
						* **data-rule="EMAIL,5,50"** - email validator
							* EMAIL: regex pattern name, see **regex patterns**
							* 5: minimum length
							* 50: maximum length
						* **data-same="signup_password"** - element id - compare this element value with another element value
				* complete example: 		
```
				<input id="login_email" name="login_email" type="text" placeholder="Email cím" title="Kérem adjon meg egy valós email címet" data-rule="EMAIL,5,50">
```					
</details>

# view
<details>
<summary> show/hide </summary>
	
* **input param**: 
	* nothing at moment but could be injected model or router

* **output property**: 
	* getContent(key, data) 
		* key is string key
		* data is object
		* return template string from **tFunc** (template function) object, (where method name is key, param is data)
	* render(key, data)
		* key is string
		* data is object
		* execute function from **rFunc** object (where method name is key, param is data)
	* multicall(data)
		* data is object array and contain which render functions need to be called
	* build(data)
		* will call the private **build** function which also accept same param (see internal functions)
	* visibility()
		* call the internal **refreshDOMVisibility()** function
	* terminate()
		* call the internal **terminate()** function
		* param what we send to api

		
* **role**:
	* render the page content with object what we get from backend with model+ajax
		* also at build phase add/remove page depend/global components
		* change the page title
	* render elements which got rank condition (ex. login/logout button)
	* store shared templates in **tFunc** object
		* also can serve this templates to components via **getContent** function
	* create the initial menus


* **internal function roles**:
	* rFunc: 
		* a group of stored the functions which could be called from render function (and declared from backend too)
		* ex.: multicall, redirect
	*tFunc: 
		* most of template function accept atleast 1 object param
		* here we store template function with return the template string 
		* we can share that templates and return with **getContent** function
	* refreshGlobalComponents:
		* recheck the global components condition if fulfilled or need add/remove
	* build: 
		* it use data object param and pages.current.routeData object for create page content
			* with controller and action from routedata we get which template we need to use from **tFunc**
			* change page title
			* in special case like login/registration its add class to body for remove page scrollbar for those full screen pages
			* we cache the content dom, string bone, data, title in **pages.current**
		* add page depend components if condition is fulfilled
			* it will be stored into pages.current.component[componentName]
			* data (if needed - see **components**) will be stored into pages.current.componentData[componentName]
	* terminate:
		* remove page content
			* in special case like login/registration its remove class from body ( reenable the page scrollbar)
		* remove page depend components	
	* refreshDOMVisibility: 
		* check and change the role depend dom elements
		* example logout button if it have **.logged_only** class
```
			['.guest_only', Auth.role === 0],
			['.logged_only', Auth.role > 0],
			['.member_only', Auth.role > 1],
			['.moderator_only', Auth.role > 2],
			['.admin_only', Auth.role > 3],
```

</details>

# middleware
<details>
<summary> show/hide </summary>
* **output property**: 
	* add (label, callback=null) - assign callback under this object where key is the label
	* run(label, data) - call assigned callback and pass data into those callbacks
	* remove(label) - remove assigned callback property from this object

* **role**:
	* bridge between controller and router (injected to both constructor)

## Middleware in action
	
* assign function from controller
```
	middleware.add('redirect', setPage);
```
* run assigned function 
```
	middleware.run("redirect", data );
```
</details>

--------------------------------------

# Constants and Regex pattern
<details>
<summary> show/hide </summary>

* note: maybe this will be changed by time
* constants: 
	* path:
		* debug: function(data) - write data to console log
		* BASE_PROTOCOL: http or https
		* BASE_HOSTNAME: hostname
		* BASE_ROOT: base root
		* MODEL_PATH: path for backend model
		* IMAGE_PATH: image folder path 
		* GALLERY_PATH: image gallery folder path 
		* THUMBNAIL_PATH: image gallery thumbnail folder path 
		* MENU_ICON_PATH: menu icon folder path 
		* USER_STATUS: array (Inactive,Active,Banned,Deleted)
		* USER_RANK: array(Guest,Member,Moderator,Admin,Owner)
		* INTERNAL_ERROR_URL: url for error 500 - internal error page 
		* NOT_FOUND_URL: url for error 404 - not found page 
		* NO_ACCESS_URL: url for error 403 - forbidden page
		* ERROR_MSG{id:message}: error message based on error id 
		* MOUSE_BUTTON: for make difference for normal left click
		* SERVER_TIME_ZONE: GMT+x sec, example 7200 = GMT+3
		* CLIENT_TIME_ZONE: image folder path
		* ALLOWED_STATUS_DIFFERENCE: limit in sec which used to define user is online or offline
		* VALIDATOR: regex pattern for **router** and **model** (form validator)
			* NUMBER, PHONE, ALPHA, ALPHA_NUM, STR_AND_NUM, LOW_UP_NUM, SLUG, NAME, NAME_HUN, ADDRESS_HUN, STRING, EMAIL, IP
			* example:
```
			'STR_AND_NUM': /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/
```		
</details>

# Pages
<details>
<summary> show/hide </summary>

* **input/output param**:
	* not exist because it object literal

* **role**:
	* contain the page and core (view related) infos, main categories:
		* global - common data:
			* components (permanent components)
		* current - common data for current page:
			* routerData (current controller, action, param, data)
			* dom (content dom cache)
			* bone (content dom string content)
			* title
			* data (maybe will be removed, used for image cache)
			* component (page related component)
			* componentData (if component must store data - see **components** )
		* controller_action (page related data, ex: article_index - see **router** )
			* title (page title, sevaral page overwrite this, ex. gallery/article)
			* render (if missing then it is same than model: false)
				* model 
					* boolean: if we need data or no, file name is the controller name, method name will be action
					* string: if data coming from outside, like example youtube playlist coming from youtube api
			* template (string key which, which template function we use in view for create that page)
			* component (object - it is setup data for components - see **components** )
			* example: 
```
				user_index: {
					title: "Felhasználók",
					render: {
						model: true,
					},
					component: {
						userManager: {
							name: 'userManager',
							condition: {
								role: 3
							},
							table: '.user .index main table',
							storeData: true,
							datasource: {
								edit: MODEL_PATH+'User.php?action=admin_edit',
								delete: MODEL_PATH+'User.php?action=delete_user',
							},
							constructor: UserManagerComponent
						}
					},
					template: 'usersPage',
				},
```			
## Description
* pages object verified by Controller 
	* model render missing or false: then will call automatically View.build();
	* model render is string: then call the model.getCustomData(render.model, param);
	* model render is true: then call the model.getPageData(controller, action, param);
		* in this case backend send in response which View render function(s) must used for page
		* example, this call View.build(data):
```
		class Article extends Model {
			public function index($data=null) {
				// code code code
				return $this->sendResponse([$articles, 0], 'build');
			}
		}
```			
* pages object used in View object in build method ( see **view** )
</details>

# Components
<details>
<summary> show/hide </summary>

* **input param**:
	* setup/setting - object literal
	* ajax - ajax object itself

* **output property**: 
	* remove() - remove the DOM what component created and remove the event listeners
	* rest depend on component

* **special**: 
	* restriction is must be event target or max 3rd parent of event target
	* component output functions are callable if you put to any element the following:
	* **href="*" data-action="component/${componentname}/${function name}/${string param but its optional}"**

* **role**:
	* dynamically handle a special task like managing user table:
		* ex. delete user from table & database or change data on user
	
* **note**:
	* javascript constructor function what will be initialized with **new** key
	* components don't have css
	* each component have HTML part: 
		* a template constant where the HTML stored in template function
		* is template is shared then could get HTML string from View object 
			* ex. view.getContent(key, data);


## Used Component 
* **ModalComponent**[perm] - modal what let manage url & the content
* **SettingsManager**[perm] - crud for user settings and visual part
* **AudioPlayer**[perm] - audio player for playing mp3's from database  
* **MessengerComponent**[perm] - crud for messages, message window, periodic message checks
* **Calendar**[page] - show/sort/manage data from news and guests table
* **GuestbookComponent**[page] - handle CRUD at guestbook page  
* **ContextMenu**[page] - create right click menu and handle it if you send array to this component
* **FileUploader**[page] - file upload and progress bar  
* **AlbumManager**[page] - crud for albums and interact with ContextMenu/FileUploader
* **ImageManager**[page] - crud for images interact with ContextMenu/FileUploader
* **UserManagerComponent**[page] - users management and user table
* **YoutubeViewerComponent**[page] - create youtube video iframe for modal and pass new url
* **ImageViewerComponent**[page] - create image with carousel for modal and pass new url

## Component types (2)

* global (pages.global.component) 
	* created at page loading
	* removed only if component have condition and user role changed
	
* page depend (pages.global.component) 
	* created when user click to an internal page link
	* removed when user change the current page 

## Component setup/settings
* structure: object literal
* properties: common or special 
* common properties: 
	* name - string (component name, same than )
	* condition - object (at moment only role level condition exist)
	* datasource - object (if component need interact with backend, we store here the url's)
	* storeData - boolean (if it is true then page data will be saved under pages.current.componentData)
	* relationship - string (another component name, which we will use for something)
	* constructor - function (component constructor function)
	* example: 
```
	component: {	
		settingsManager: {
			name: 'settingsManager',
			condition: {
				role: 1
			},
			datasource: {
				get: MODEL_PATH+'User.php?action=get_my_data',
				edit: MODEL_PATH+'User.php?action=edit',
			},
			constructor: SettingsManager
		}
	}
```

## Components in action
* component will be initialized in View.Build() (except global components)
* global components are verified everytime if user role changed
* currently used component objects saved into pages.current.component[componentName]
* currently used data for components stored into pages.current.componentData[componentName]
* relationship: component can interact with another component output functions
	* examples: 
		* imageViewer set content and define url for modalComponent
		* imageManager set content for right-click contextMenu
</details>

--------------------------------------
--------------------------------------

# Model
<details>
<summary> show/hide </summary>

* **Inits**:
	* Constants
		* DEBUG
		* LOG
	* Rest
		* session start
		* json header
		
* **Class**
	* properties - *all static*
		* $files - used for file upload
		* $request  
			* data:
				* param: used for store the data from GET/POST request and will be validated
				* action: which we will call
				* method: POST or GET
		* $method - which action we will use, same than $request['data']['action']
		* $auth - auth data 
			* userId - 0 or user_id
			* name - Guest or the user full name
			* role - 0 or user rank
			* hash - '' or user session hash (hash the key for logged user session data)
			* domain - random string which changed at every request ($_SESSION['domain']) 
		* $DATABASE - connection data
			* HOST
			* USER
			* PASSWORD
			* DATABASE
		* $PATTERN - regex patterns for validations
			* EMAIL
			* NAME_HUN
			* ADDRESS_HUN
			* NAME
			* INTEGER
			* SLUG
			* ALPHA_NUM
			* STR_AND_NUM
			* LOWER_UPPER_NUM
			* STRING - it is special and function was used for this

* **Constructor**: 
	* fill the static properties
	* call **domainVerification()**
	* call **setAuthKey()**
	* call **accessVerification()**
	* request validation 
		* if fail will redirect to **refuseData** and send error
	* check if requested method exist
		* if no then redirect to **refuseData** and send error
			
* methods - *non static or static*	
	* deleteFile($path) - static
		* delete file
	* accessVerification() - non static
		* check if user have access for the wanted method
	* requestValidation() - non static
		* validate $request['data']['param'] content with rules from $INPUT_RULE
	* setAuthKey() - non static
		* set $auth array if we can find with hash or set default values for guest
	* domainVerification() - non static
		* check if domain found in session
			* if yes and mismatch with domain from last request:
				* call setAuthKey()
				* call refuseData($errorMsg)
		* generate new domain and save in session
	* getParam($key1, $key2, $dafaultValue) - non static
		* if any from 2 key is empty return the defaultValue
		* else call **validateString ($key1, $key2)**
		* key1 is param key what data got in $request['data']['param']
		* key2 is key for $PATTERN regex validation
	* getData($key1, $dafaultValue) - non static
		* similiar like the geParam only this return data from $request['data']
		* allways validated like alpha numeric string (ex. controller name, action name etc)
	* validateString($key1, $key2) - non static
		* key1 is param key what data got in $request['data']['param']
		* key2 is key for $PATTERN regex validation
		* return boolean ( used preg_match on htmlspcialchars and trimmed data) except for string where special function used
	* refuseData($errorMessage, $renderFunc) - static
		* errorMessage - if we want send message from backend to client side
		* rederFunc - (optional) which render function we want use
	* sendResponse($modelData, $renderFunc, $notifyMsg) - non static
		* modelData - data what we want send to client
		* rederFunc - (optional) which render function we want use
		* notifyMsg - (optional) if we want send message from backend to client side
	* getById ($id) - static
		* search in current table after id and return that row
	* getBySlug ($slug) - static
		* search in current table after slug and return that row
	* getAll() - static
		* return every row from table
	* getConn() - static
		* return mysql connection if exist else return new connect - singleton
	* countAll($condition) - static
		* return how much row exist in current table what fulfilled the condition
			* condition example: *name = "pista"*
	* getPage($index, $limit, $condition) - static
		* return rows wich fulfill the condition but with offset and limit (pagination)
	* inserted_id() - static
		* return the last inserted id
	* insert($data, $returnData) - non static
		* data - assoc array what we want save (keys = columns, values = values)
		* returnData - boolean, if true then instead boolean (if was saved or no), we return data
	* update($data, $returnData) - non static
		* data - assoc array what we want update (keys = columns, values = values)
		* returnData - boolean, if true then instead boolean (if was updated or no), we return data
	* deleteById($id) - static
		* delete a row from current table
	* deleteRecords($conditions) - static
		* conditions - condition string
			* *ex. "status = 0"*
	* readRecords($conditons, $returnData, $array, $pageIndex, $perPage, $orderBy, $orderDesc) - static
		* conditions - string, same than above
		* returnData - boolean, if we want data (else we will get boolean)
		* array - boolean, we get more row or first one
			* if true and exist more matched row we get array with numeric index
			* if false and exist atleast 1 record then we get the first one
		* pageIndex - integer, used for pagination, pageIndex * perPage will be the offset
		* perPage - integer, how much record we want read out (default is ~unlimited)
		* orderBy - string, fieldname
		* orderDesc - string, "ASC" or "DESC"
	* getInsertedId() - non static	
		* return the last inserted id
	* slugify($string) - static
		* return the converted string slug
	* execQuery($query)	- static
		* this execute every query and return boolean for non select queries
			

* **role**:
	* validate domain/auth session
	* validate permission for requested method
	* validate the sent *params*
	* wrap the most used MySQL queries (save, update, count, delete, readId etc)
	* execute MySQL queries
	
</details>

# Sub Model
<details>
<summary> show/hide </summary>

* **Class**
	* properties - *all static*
		* $TABLE_NAME - table name
		* $INPUT_RULE - field validation rule
			* example: 'content' => ['type'=>'STRING', 'length' => [0, 65535]],
		* $ROLE_REQ - role requiment for access method
			* example: 'add' => 3,
		* $AUTO_FILL - if field value not exist then add default value
			* example: add' => ['status' => 1]
		* $ACTION_RULE - overwrite general input rules for a specific method
			* exemple: 'add' => ['password2' => ['match' => 'password']]
	

* methods - *non static*	
	* CRUD functions - non static
		* general functions: add, delete, edit etc
		* refuseData or sendResponse return data in json form

* **role**:
	* declare table name, extends Model
	* declare validation rules for each field
	* declare role requiment for methods
	* CRUD functions
</details>


# Layout and other CSS stuffs
<details>
<summary> show/hide </summary>

* page is mobile first
* if browser support GRID (https://css-tricks.com/snippets/css/complete-guide-grid/) then it will use GRID for layout
```
	@supports (display: grid) {
	
		@media only screen and (min-width: 1172px) {
			.grid {
				grid-template-columns: 245px 1fr auto;
				grid-template-rows: auto 1fr auto;
				grid-template-areas:
					"header header header"
					"menu content content"
					"footer footer footer";
			}	
		}
		
		@media only screen and (min-width: 1439px) {
			.grid {
				grid-template-columns: 300px 1fr 300px;
				grid-template-rows: auto 75px 1fr auto;
				grid-template-areas:
					"header header header"
					"menu menu menu"
					"content content content"
					"footer footer footer";
			}		
		}
	}
```
* base64 images in css
```
	.icon-48 {
	    height: 48px;
	    background-size: 48px 48px;
	    display: inline-block;
	    width: 48px;
	}

	.worship-icon {
		background: url('data:image/png;base64,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') no-repeat;
	}
```
* nasty selectors, like: 
```
	.burger .unreaded-msg.badge:not([data-count="0"]):hover:after
	.ev-cal .head a:not(.close):hover
	.header-line .burger input:checked ~ span.burger-line:nth-child(3) 

```
* contour & title text shadow, box shadow
```
	text-shadow:  0 1px 0 #ccc,
				0 2px 0 #c9c9c9,
				0 3px 0 #aaa,
				0 4px 0 #999,
				0 5px 0 #888,
				0 6px 1px rgba(0,0,0,.1),
				0 0 5px rgba(0,0,0,.1),
				0 1px 3px rgba(0,0,0,.3),
				0 3px 5px rgba(0,0,0,.2),
				0 5px 10px rgba(0,0,0,.25),
				0 10px 10px rgba(0,0,0,.2),
				0 20px 20px rgba(0,0,0,.15);
				
	text-shadow:
		-1px -1px 0 #000,
		1px -1px 0 #000,
		-1px 1px 0 #000,
		1px 1px 0 #000;
	box-shadow:
		0 2px 8px rgba(0,0,0,0.5), /* Exterior Shadow */
		inset 0 1px rgba(255,255,255,0.3), /* Top light Line */
		inset 0 10px rgba(255,255,255,0.2), /* Top Light Shadow */
		inset 0 10px 20px rgba(255,255,255,0.25), /* Sides Light Shadow */
		inset 0 -15px 30px rgba(0,0,0,0.3); /* Dark Background */
		margin: 1px 1px;
```
* image and text based on resolution
```
	@media only screen and (min-width: 445px) {
		.grid header picture {	background-image: url('../img/static/cover_757px.jpg');	}
		.grid header picture .igevers::after {content: attr(data-tablet); }
	}
	@media only screen and (min-width: 758px) {
		.grid header picture {	background-image: url('../img/static/cover_1024px.jpg');	}
		.grid header picture .igevers::after {content: attr(data-desktop); }
	}
	@media only screen and (min-width: 1025px) {
		.grid header picture {	background-image: url('../img/static/cover_1440px.jpg');	}
		.grid header picture .igevers::after {content: attr(data-desktop-hd); }
	}
```
* page design can be changed from css (just use controller & action class), example for http://domain/article/view/1
```
	.article .view {
		/* bla bla */
	}
```
* custom <input type="range"> design for audio player vertical scrollbar and for time tracker bar
```
	#audioPlayer .container input[type=range].scrollBar:focus::-ms-fill-lower { }
	#audioPlayer .container input[type=range].scrollBar:focus::-ms-fill-upper { }
	#audioPlayer .container input[type=range].scrollBar::-webkit-slider-runnable-track { }
	#audioPlayer .container input[type=range].scrollBar::-webkit-slider-thumb { }
	#audioPlayer .container input[type=range].scrollBar:focus::-webkit-slider-runnable-track { }
	#audioPlayer .container input[type=range].scrollBar::-moz-range-track { }
	#audioPlayer .container input[type=range].scrollBar::-moz-range-thumb { }
	#audioPlayer .container input[type=range].scrollBar::-ms-track { }
	#audioPlayer .container input[type=range].scrollBar::-ms-thumb { }
```
* button with css borders
```
	#audioPlayer .details .button .play {
	    border-style: solid;
		border-width: 4px 0px 4px 8px;
		box-sizing: border-box;
		border-color: transparent transparent transparent #fff;
	}
```
* custom <hr /> with div + gradient + rgba 
```
	div.separator {
		height: 1px;
		width: 100%;
		margin: 1em 0;
		background-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(100,100,100,0.5) 51%, rgba(0,0,0,0) 100%);
	}
```
* progressbar with background color
```
	background-image:
    	-webkit-linear-gradient( 135deg,
         	transparent,
            transparent 33%,
            rgba(0,0,0,.1) 33%,
            rgba(0,0,0,.1) 66%,
             transparent 66%),
	    -webkit-linear-gradient( top,
            rgba(255, 255, 255, .25),
            rgba(0,0,0,.2)),
		-webkit-linear-gradient( left, #09c, #f44);
```
* animated toggle with pure css (label+checkbox)
```
	.article .index #article_toggle:checked + label[for="article_toggle"] {
	    max-height: 500px;
	}
```
* simple css spiner, fade, slide effects
```
	.spinner {
	    border: 6px solid rgba(255,255,255,0.5);
	    border-radius: 50%;
	    border-top: 6px solid rgba(0,0,255,0.5);
	    width: 50px;
	    height: 50px;
	    animation: spin 2s linear infinite;
	}
	
	@keyframes spin {
	    0% { transform: rotate(0deg); }
	    100% { transform: rotate(360deg); }
	}	
```
* rarly used css tricks
```
	/* make element unclickable */
	pointer-events: none;
	/* make element content unselectable */
	user-select: none;
	/* set element content after data attribute, exemple data-count */
	content: attr(data-count);
	/* make textarea non resizeable */
	resize: none;
	/* multiple not? */
	.fadeOut:not(.login):not(.registration)
	
```
</details>
