# SPA
Single Page App (pure: JS - ES6, CSS3, PHP7 serverside, HTML5)
Note: internet explorer support was dropped, this page for new generation browsers like: Chrome, Firefox, Opera etc

 * youtube: 
 	- basics: https://www.youtube.com/watch?v=rrejcoh2z2c
	- images: https://www.youtube.com/watch?v=wWYikMhwFas
	- messages: https://www.youtube.com/watch?v=-gvEvySDRqQ
	
 * demo: https://gyozelem.000webhostapp.com/home - v0.6.0
 * last version: https://github.com/shadowvzs/SPA/tree/v0.6.0

Single page application with javascript root and pages so don't need reload the page.
Requirement:
  - apache2 (url rewrite too)
  - php 7
  - es6 compatible browser
  - css3 compatible browser

## Changes log - short: 
<details> 
<summary>show the list</summary>
* Note: Pages vs component, page loaded in middle content, component will loaded a div, could be hide/show/toggle etc, could be permanent, page or/and role level depend.

* v0.8.0 improvements
	* calendar eventlisteners halved (changed to attribute link - see the description about router)
	* audio player loading was fixed and reduced the evenetlisteners
	* browser back button event was fixed
	* popUp remade into components: modal, imageviewer, youtubeviewer component (last 2 manipulate the 1st one)
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

<h2><b>File Structure:</b></h2>

 * note * this is outdated, this was the version 0.1

<b>What will be</b>
- css folder: index.css
- js folder: App.js - minified
- img folder: contain gallery pictures, icons, texture
- model: similiar like in PHP frameworks individual models extend the base Model.php
- root: App.php (index.php v0.1.2+) and .htaccess (this is the core, HTML skeleton)

<b>It is dev version because:</b>
- css folder: still not minified and used 2 css
- js folder: not minified 

<b>BTW about setup:</b>
1. everything must be in localhost/test folder
 example: localhost/test/App.php (v0.1.2 localhost/index.php)
2. apache2 url rewrite must be enabled
3. database settings for mysql must set in /model/Model.php


<h2><b>Working Structure:</b></h2>
<details> 
<summary>show description</summary>
<h3>Notes:</h3><ul>
<li> App.php contain every page skeleton</li>
<li> Client render, Model, Router, Controller</li><br>
<li>Middleware: <ul>
      <li>What is middleware? nothing more or less than a bridge object between Router and Controller object</li>
      <li>Middleware object got 3 method: add (register a callback), run (call the callback with data), remove (i think it is clear)
and we inject in constructor in both Router and Controller</li>
      <li>Example: we register callback from Controller object and we can call it from  Router object with a key, 
so similiar like observer/observeable</li>
      <li>Used for: after url was parsed and validated in Router we execute setPage in controller and also pass data from Router object</li>
</ul>
</li>
  
<li>Router
      <ul>
        <li> Appache .htaccess redirect everything to App.php so the url will be handled by Router object what got a contructor function and later will be created the instance </li>
        <li> You must define the available routes in Router construction function</li>
        <li> Router split the current url to: prefix (opt), controller, action, param and compare with defined route paths, if current url structure was found in predefined array then call setPage method in Controller else redirect to error page ( with id 404)</li>
        <li>Router have a global click event what check if current element/or his parent element have href attribute, if check if the link was one from following link type:
          <ul>
            <li>Redirect (internal) then push into history and replace url, call the setPage method</li>
            <li>Popup then send data to popUpRender method in View object</li>
            <li>Submit collect input data and send to server (ex. login/registration)</li>
            <li>else - normal link, jump to another site/server/domain</li>
          </ul>
      </ul>
</li>
<li>Controller
      <ul>     
         <li>Contain init stuffs like creating menu, cacheing dom what will be used later</li>
         <li>Responsable for internal page  changes with data from Routerr (prefix, comtrollerm action, param) 
         <ul>
            <li>terminate page: (reset document structure, remove page related stuff, close popUp window)</li>
            <li>set page: cache new page, check if page got static data (like error page) and call data and render function from Pages object or it is dynamic data and need to call model, ofc we pass data from router to model
         </ul>
         </li>
      </ul>
 </li>
 <li>Model 
    <ul>
      <li>send request to backend with ajax object (also here we setup success, error callbacks too)</li>
      <li>
        <ul>
          <li>ex.: controller => model file, action => model method what we need call, and we pass data too params too (user/edit/1 => User.php with edit method and param = 1)</li>
        </ul>
      </li>
      <li>When (JSON) response arrived then depend on response data (render function what we will use sent by server) we will render with View object also depend from response data ajax may create notification message on top-right corner</li>
done.</li>
  </ul>
</li>View
      <ul>
        <li>Main goal is render dom skeleton and populate with data from model with replaceing strings (ex. replace {{id}} with response.data.id so basically check if data key exist in string with delimiters)</li>
        <li>Render popUp window (ex. used for albums & youtube videos)
            <ul>
              <li>in several case when we use with arrays (like images in albums) we cache here for popUp window and we read data from here and not from database each time we change image in window</li> 
              <li>get string data from Router and split (first part will be the popUp type, second is the dataIndex)</li>
              <li>depend on poUp type we get template string for populate the popUp window content</li>
              <li>rewrite url for make popUp window content linkable (example image what we selected)</li>
              <li>show window and optionally add modal semi transparent background and if we close then hide it</li>
              <li>we handle here the image preloading example if user check album content and till to him the thumbnail will be listed another async function in background load the large imagesm when user click to thumbnail and open the large image then will be showed faster</li>
              <li>visibility rendering (if for user the auth will be changed then we change what he can see BUT this is double checked because server not send data for view rendering if user not have the correct rank ) </li>
              <li>multicall rendering function what render each render pairs (data+template+container) from server to correct render function if server want render more content with a single response
            </ul>
         </li>
      </ul>
</li>

  </ul>
</li>

<li> Data and Auth <ul>
  <li> Client side communicate with database via ajax requests and used 2 hash for this: auth hash (md5 but not contain any user data) and domain hash (crsf) </li>
  <li> Server side check if domain hash is correct else send back error, also make verification for auth hash if exist or no and response depend on user role (rank)</li>
  <li> Server with response send back everytime correct hashes and client side ajax request automatical update auth data if needed, store in private object and localstorage, but not store sensible data like password.</li>
  <li> Server could send data and also could send one or more renderfunction name what client side automatically call when data arrived in client side, so
   basically you can choose with what render function(s) what render your data what you send to client (best example is gallery)</li>
  </ul></li>
 </ul>
 </details>
 
<h1>Example</h1>
<details> 
<summary>show the examples</summary>
 user use this url:
 <b> http://79.117.23.69/test/gallery/album/2/4</b>
 
 <ul>
    <li>Router
      <ul>
        <li>router.init() - catch the url and create few variable with splited href into (split only for getting the internal url from whole url so this: <b>gallery/album/2/4</b>)</li>
        <li>router.inti() -> redirect() -> validateRoute(); - here route will be validated:
          <ul>
            <li> success: we found the predefined route ("/gallery/album/:id/:index") so we return to redirect() with splited routeData object what look like this {prefix:null, controller:gallery, action: album, param { id:2, index: 4 } }</li>
            <li> fail:  we call again the redirect() function but newUrl will be the not found url (error/404) what will be rendered from pages object (because all static data)</li>
          </ul>
        </li>
        <li> we call Controller.setPage method from Router.redirect with middleware object and we send the routeData object
      </ul>
    </li>    
    <li>Controller</li>
      <ul>
        <li>setPage call terminatePage if was previous page, then change page title, check if in pages exist render function for this controller+action pair</li>
            <ul>
              <li> if exist render method (ex. pages[controller][action].render) then call that and pass param (ex. id) from route data (this is how error redirect work) </li>
              <li> not exist render in pages then we call model.getPageData method and pass routeData to it
            </ul>
        </li>
      </ul>
     </li>
     <li>Model
      <ul>
        <li> getPageData create setup object from routeData ( { url: Gallery.php, method: GET, data: {action: album, param: {id:2, index:4} }}) and call sendRequest  </li>
        <li> sendRequest lock the action for this controller/action pair until we have something success or error handler </li>
        <li>Backend
          <ul>
             <li>Gallery.php reicive the data, Gallery object set table name, validation for potentional data and extends Model object and Model obj constructor call methods for validate data, domain hash, user hashs </li>
             <li>if everything ok then constructor call the correct method ($this->album($param)) else we send error message what notify object will show the user</li>
             <li>Gallery->album will check the user role and depend on that we make query with mysqli, declare the data (response from mysql query) for correct renderfunctions (in client side view object) and container (dom query selector string)</li>
          </ul>
        <li> if success then return data object and check if was declared renderFunc, if yes then we call it (view[data.renderFunc+'Render'](...data.modelData))
       </ul>
      </li>
      <li>View
        <ul>
          <li>in this case the primary renderFunction what was declared in backend is multicallRender in view object so we pass data to multicall from model object, successHandler function</li>
          <li>multicallRender go over the data array with "for of", split and send every data with his own render function (in this case 5 call)
            <ul>
              <li>first three array index will be addressed to templateInsertRender function, what will render: selected album field, album list container populate with album names, image container populate with images
                <ul>
                  <li> replace string in template then if all done then insert into container dom </li>
                </ul>
              </li>
              <li>4th will be addressed to popUpRender function
                <ul>
                  <li> populate the view.global.popUp object properties, get the template, prepare the data for call templateInsertRender function for replace the popUp window content</li>
                  <li> manipulate url (if not was selected target for popUp window then add param to url, else replace param) with router.virtualRedirect method (difference vs redirect is virtual redirect only push history and replace url but not make validation ro send data to controller )
                  <li> show window (with remove hidden class from window) - <b>HERE ENDED IF ALL WAS OK</b> </li>
                  <li> if popUp window will be closed the last param from url will be removed, window will be hide (add hidden class to window), remove window content
                </ul>
              </li>
              <li>5th preloadImage function
                <ul>
                  <li> this go over the images array and create images (1 string insert not multiple append) BUT only if not was cached yet</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
 </ul>
</details>

<h1>Weird solutions?</h1>
<details> 
<summary>show the solutions </summary>
<h2>CSS: Responsive text</h2>
<code>
```html
 
 <pre>
 
	>    < d i v  c l a s s = "something" 
	>         data-mobil="...short text..." 
	>         data-tablet="...medium length text..."	
	>         data-desktop="...long text..."	
	>         data-desktop-hd="...longer text...">  
	>    < / d i v >
	
	.something::after { content: attr(data-mobil); }
	
	@media only screen and (min-width: 758px) {
		.something::after { content: attr(data-tablet); }
	}	
	
	@media only screen and (min-width: 1108px) {
		.something::after { content: attr(data-desktop); }
	}	

	</pre>
	```
</code>

<h2>JS: Submit without link</h2>

<code>
    `
    document.addEventListener("click", e => {
  
         if (href.length > 7 && href.substr(0,7) === 'submit:') {
          e.preventDefault();
          form = document.getElementById(href.substr(7)+"_Form");
          model.sendForm(form);
       }
       
    }

 
     sendForm(form){
			formMethod = form.dataset.method,
			formAction = form.dataset.action.split('/'),
			requestKey = formAction[0]+'_'+formAction[1],
			param = this.getFormData(form);

			this.sendRequest ({
				url: this.getModelPath(formAction[0]), 
				method: formMethod, 
				data: {
					action: formAction[1], 
					param: param,
				}
			});
		},
    
    VALIDATOR = {
      'NUMBER': /^[0-9]+$/,
      'ALPHA': /^[a-zA-Z]+$/,
      'ALPHA_NUM': /^[a-zA-Z0-9]+$/,
      'STR_AND_NUM': /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/,
      'LOW_UP_NUM': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
      'SLUG': /^[a-zA-Z0-9-_]+$/,
      'NAME': '',
      'NAME_HUN': /^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû]+)$/,
      'EMAIL': /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
      'IP': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    };

		getFormData(form) {
			var inputs = form.querySelectorAll('input, select'), value, rule, val_len,
			name, prefix = form.id.split('_')[0], len = prefix.length+1, param = {};
			for ( input of inputs) {
				input.val
				name = input.getAttribute('name');
				if  (!name) { continue; }
				name = name.substr(len);
				value = input.value;
				if (input.dataset.rule) {
					val_len = value.length;
					rule = input.dataset.rule.split(',');
					if (!VALIDATOR[rule[0]].test(value) || val_len < rule[1] || val_len > rule[2]) {
						return input.title ? input.title : `Invalid data at ${name} field (${rule[1]}, ${rule[2]})`;
					}
				}
				if (input.dataset.same) {
					rule = document.getElementById(input.dataset.same);
					if (!rule || value !== rule.value) {
						return input.title ? input.title : name+' not same than '+rule.name+' field';
					}
				}
				param[name] = value;
			}
			return param;
		},
  

      <div class="form_window" id="login_Form" data-method="POST" data-action="user/login">
        <h1>Login</h1><br>
        <input id="login_email" name="login_email" type="text" placeholder="Email Address" title="..." data-rule="EMAIL,5,50">
        <input id="login_password" name="login_password" type="password" placeholder="Password" title="..." data-rule="ALPHA_NUM,6,32"><br>
        <a href="submit:login"><button> Login </button></a>
      </div>
`
</code>
</details>
