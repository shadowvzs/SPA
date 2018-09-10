<!DOCTYPE html>
<html>
	<head>
		<title>JS SPA - MVC</title>
		<meta charset="UTF-8">
		<meta name="description" content="Atm moment only test page for SPA">
		<meta name="keywords" content="HTML,CSS,JavaScript,JSON,Ajax,SPA">
		<meta name="author" content="Varga Zsolt">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/test/css/index.css" type="text/css"/>
	</head>
	<body>
		<div class="grid" id="App">
			<div class="header-line">
				<div class="burger">
					<input type="checkbox" />
					<span class="burger-line"></span>
					<span class="burger-line"></span>
					<span class="burger-line"></span>
					<span class="burger-line"></span>
					<span id="burger_menu">
						<nav><!--burger-menu--></nav>
						<span class="log-related">
							<span class="log-in logged_only"><!--burger-logged--></span>
							<span class="logout guest_only"><!--burger-login--></span>
						</span>
					</span>					
				</div>		
			</div>		
			<header>
				<div class="shadow"></div>
				<div class="log-menu">
					<div class="logged logged_only"><!--page-logged-->
					</div>
					<div class="guest guest_only"><!--page-login-->
					</div>
				</div>
				<picture>
					<div class="igevers" 
						data-mobil="...életét adta váltságul..."
						data-tablet="&#8216;&#8216;...a mi betegségeinket viselte, és a mi fájdalmainkat hordozta...&#8217;&#8217;&#10; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Ézs 53:4)"
						data-desktop="&#8216;&#8216; Mert a keresztről való beszéd bolondság ugyan azoknak, a kik elvesznek; de nekünk, kik megtartatunk, Istennek ereje.&#8217;&#8217;&#10; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (1Kor 1:18)"
						data-desktop-hd="&#8216;&#8216; De hála Istennek, aki a diadalmat adja nekünk a mi Urunk Jézus Krisztus által!&#8217;&#8217;&#10; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (1Kor 15:57)"> 
					</div>				
				</picture>			
			</header>
			<nav>
				<div class="menu"><!--page-menu-->
				</div>
			</nav>
			<div class="content page">
				<div class="home">
					<div class="index hidden">
						<main>
							<div class="content">
								<div class="header">
									<h1 
										data-welcome-short="Isten hozott"
										data-welcome-medium="Isten hozott az oldalunkon"
										data-welcome-long="Isten hozott a Győzelem Gyülekezet oldalán"
									> </h1><br><br>
									<div class="media">
										<div class="coverFrame">
											<div class="coverPicture"></div>
										</div>
										<div class="stickyNote">
											<!--home_last_note-->
										</div>								
									</div>
								</div>	
								<br>
								<!--home_about-->
							</div>
						</main>
						<aside> 
							<div class="fund">
								<!--home_fund-->
							</div>
							<div class="social">
								<!--home_social-->
							</div>				
							<div class="service">
								<!--home_contact-->
							</div>
						</aside>
					</div>
				</div>
				<div class="error">
					<div class="index hidden">			
						<main>
							<b>Error #{{id}}:</b> {{msg}}
						</main>
					</div>			
				</div>	
				<div class="user">
					<div class="login hidden" data-modal="true">			
						<div class="modal-layer chrr_trnspnt_bg"></div>
						<div class="modal-layer lght_blck_trnspnt_bg"></div>
						<div class="form_window" id="login_Form" data-method="POST" data-action="user/login">
							<h1>Bejelentkezés</h1><br>
							<input id="login_email" name="login_email" type="text" placeholder="Email cím" title="Kérem adjon meg egy valós email címet" data-rule="EMAIL,5,50">
							<input id="login_password" name="login_password" type="password" placeholder="Jelszó" title="Kérem adjon meg egy jelszót, az angol ABC betűit és/-vagy számok felhasználasával" data-rule="ALPHA_NUM,6,32"><br>
							<a href="submit:login"><button class="button col-gray"> Bejelentkezés </button></a>
							<a href="/user/registration"><button class="button col-gray"> Regisztrálás </button></a>
							<br><br>
							<a href="/home"><button class="button col-gray"> Vissza </button></a>
							<br><br>
							<a href="#" class="disabled underlined">Elfelejtette a jelszavat?</a>
						</div>
					</div>		
					<div class="registration hidden" data-modal="true">			
						<div class="modal-layer brwn_trnspnt_bg"></div>
						<div class="modal-layer sm_blck_trnspnt_bg"></div>
						<div class="form_window" id="signup_Form" data-method="POST" data-action="user/add">
							<h1>Regisztrálás</h1><br>
							<input id="signup_name" name="signup_name" type="text" placeholder="Teljes név" title="Kérem adja meg a nevét a magyar ABC betűit használva (5-50 karakter)" data-rule="NAME_HUN,5,50">
							<input id="signup_email" name="signup_email" type="email" placeholder="E-mail cím" title="Kérem egy valós email címet adjon meg" data-rule="EMAIL,5,50">
							<input id="signup_password" name="signup_password" type="password" placeholder="Jelszó" title="Kérem adjon meg egy jelszót, az angol ABC betűit és/-vagy számok felhasználasával (6-32 karakter)" data-rule="ALPHA_NUM,6,32">
							<input id="signup_password2" name="signup_password2" type="password" placeholder="Jelszó újra" title="Kérem adjon meg egy jelszót újra ami megegyezik a másik jelszó mezővels" data-same="signup_password"><br>
							<a href="submit:signup" title="Fiók elkeszítése"><button class="button col-gray reg"> Rendben</button></a>
							<a href="/home"><button class="button col-gray"> Vissza </button></a><br><br>
							<a href="/user/login" title="Jelentkezen be ha van már fiókja">... vagy jelentkezen be</a>
						</div>
					</div>						
				</div>	
				<div class="video">
					<div class="index hidden">	
						<div class="video-box-container">
							<!--YoutubePlayList-->
						</div>
					</div>
					<div class="playlist hidden">	
						<div class="video-box-container">
						</div>
					</div>						
				</div>
				<div class="gallery">
					<div class="index hidden">	
						<div class="album-box-container">
							<!--AlbumList-->
						</div>
					</div>
					<div class="album hidden">	
						<div class="album-list">
							<ul>
								<li>
									<label for="dropdown01" class="selected-album"></label>
									<input id="dropdown01" type="checkbox" class="hidden"/>
									<ul class="album-link-list"></ul>
								</li>
							</ul>
						</div>
						<div class="image-box-container">
						<!--AlbumContentList-->
						</div>
					</div>						
				</div>	
				<div class="event">
					<div class="index">	
						sdfsdf
					</div>	
				</div>
			</div>
			<footer>
				&copy; 2017 by Varga Zsolt
			</footer>	
		</div>

		
	<div class="modal-layer sm_blck_trnspnt_bg page-modal hidden"></div>
	<div class="popUp hidden fade-in" data-modal="true">
		<div class="close"> &times; </div>
		<div class="content"></div>
	</div>
	
	<div class="cacheTrash"> </div>
	
	<!--
	maybe i use this later with windows.css
	<div class="modal-layer blck_trnspnt_bg">
		<div id="AddNews" class="window"><div class="header">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Új hír szerkesztése</b><div class="close" onclick="core.closeModalWindow('#AddNews');">&times;</div></div> 
			<div class="content">
				<br>Ki láthatja: <select name="cat"><option value='0'>Nyilvános</option><option value='1'>Bejelentkezet</option><option value='2'>Tag</option><option value='3'>Moderátor</option></select><br>
				<br>Cím: <input type="text" name="Newstit" maxlength="50"><br>
				<br>Szöveg: <br><textarea name="txt" id="txt" onKeyUp="alert(this.value);counttext();"></textarea><br><br>
				<span class="button"> Ment </span>&nbsp;&nbsp;<span class="button" onclick="core.closeModalWindow('#AddNews');"> Mégse </span>
			</div>
		</div>
	</div>
	-->

<script src="/test/js/Router.js" type="text/javascript"></script> 		
<script src="/test/js/Ajax.js" type="text/javascript"></script> 		

<script type="text/javascript">
// in future want remove App funcion from here
// and put inside everything in App.js and use webpack for minify
// same for css but only if most of part work

// BTW about setup:
// 1. everything must move to localhost/test
// example: localhost/test/App.php
// 2. apache2 url rewrie must be on
// 3. database settinsfor mysql must set in /model/Model.php

var App = function() { 

	// just a debug function 
	debug = data => (
		console.log(data)
	)

	// let store the ongoing requests in this object until we have callback
	// example: user click to home, then we send request to Home.php for data
	// and we disable request sending for same url until we get a success or error
	var activeRequest = {}

	var YouTube = {
		key: 'AIzaSyAGUqUIMRRxZysmI-G2JvMjuK_QF1dqFS4',
		channelId: 'UCju4wi5kFZ80lV8QHrm8lXg',
		part: 'snippet,contentDetails',
		title: "Győzelem Gyülekezet",
		maxResults: '25',
		playList: [],
		
	};	

	
	// ------------------------------------------------------
	// ---------------------- view -------------------------
	// ------------------------------------------------------
	
	var view = {
		currentPage: {
			dom: null,
			bone: "",
			title: "",
			data: null,
		},	
		global: {
			body: null,
			cacheTrash: null, // dom
			cache: {},		   // array with string key
			popUp: {
				window: null,
				close: null,
				modal: null,
				content: null,
				dataList: null,
				dataIndex: 0,
				closeHandler() {
					let popUp = view.global.popUp
						hrefArr = location.href.split('/');
					// remove the index from url, ie. image/1/2 => 2 
					hrefArr.pop();
					popUp.window.classList.add('hidden', 'fade-in');
					// remove window content
					popUp.content.innerHTML = "";
					// reset index if window is closed
					popUp.dataIndex = 0;
					// change back the url
					router.virtualRedirect(hrefArr.join('/'));
					
					if (popUp.modal) {
						popUp.modal.classList.add('hidden');
					}					
				},
				type: {
					youtube: {
						template: `<div class="video-container">
								<iframe src="https://www.youtube.com/embed/{{id}}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
							  </div>`,
						dataKeys: [
							['id', 'id'],
						],						  
					},
					image: {
						template: `<div class="image-container">
								<div class="image-src-side">
									<img src="${GALLERY_PATH}{{path}}">
									<div class="leftCarousel"><a href='popup:image/previous'> &#10096; </a></div> 
									<div class="rightCarousel"><a href='popup:image/next'> &#10097; </a></div> 
								</div>
								<div class="image-data-side">
									<time datetime="{{uploaded}}">{{uploaded}}</time><br><br>
										{{description}}
								</div>
							  </div>`,
						dataKeys: [
							['path', 'path'],
							['uploaded', 'created'],
							['description', 'description'],
						],
					}					
				}
			}
		},
		
		setPopUpDataRender(list=null, index=null) {
			//console.log(index);
			let popUp = view.global.popUp;
			popUp.dataList = list;
			if (!index && index != 0) {
				popUp.dataIndex = index;
			}
		},
		
		// images[i] = new Image();
        // images[i].src = preload.arguments[i];
		
		preloadImageRender(cacheKey, pathKey = 'path'){
			let global = view.global,
				cacheTrash = global.cacheTrash,
				cache = global.cache,
				dataList = global.popUp.dataList,
				data, path, images = "", timer;
			// already cached
			if (cache[cacheKey] || !cacheTrash) { return; }
			
			//but now we want async preload
			timer = setTimeout(() => {
				for (data of dataList) {
					path = data[pathKey];
					if (!path) { continue; }
					images += `<img src='${THUMBNAIL_PATH+path}'>`;
					images += `<img src='${GALLERY_PATH+path}'>`;
				}
				console.log('preloaded: '+dataList.length+' image');
				cacheTrash.innerHTML = images;				
			},1);
			cache[cacheKey] = true;
		},
		
		popUpRender(str, replaceIndex=false) {
			try {
				var rawData = str.split('/'),
					popUp = view.global.popUp,
					[type, index] = rawData,
					dataList = popUp.dataList,
					dataLen = dataList.length,
					direction = { next: 1, previous: -1}
					dataIndex = parseInt(popUp.dataIndex, 10);	
					
				if (dataIndex > 0) {replaceIndex = true;}
				
				if (direction[index]) {
					let nextIndex = (dataIndex == 0 ? 1 : dataIndex) + direction[index];
					if (nextIndex < 1 || nextIndex > dataLen) {  console.log('return because cannot go to '+index);return; }
					replaceIndex = true;
					index = nextIndex;
				}

				var dom = popUp.content,
					parentId = dataList[0].parentId || null,
					selectedData = popUp.dataList[index-1],
					template = popUp.type[type].template,
					dataKeys = popUp.type[type].dataKeys,
					urlArr = location.href.split('/'),
					data = {}, key, value;
			} catch(err) {
				return notify.add(err.message, 'error');
			}	

			// if (!parentId) {return; }

			popUp.dataIndex = index;
			if (replaceIndex) {
				let arrEnd = urlArr.length-1;
				urlArr[arrEnd] = index;
			} else {
				urlArr.push(index);
			}
			router.virtualRedirect(urlArr.join('/'));
			
			// convert dataKey to object where values is from selected index
			for ( [key, value] of dataKeys) {
				data[key] = selectedData[value];
				
			}

			// replace in templace what needed then we shop the element
			view.templateInsertRender( [data], template, dom);		
			if (popUp.window.classList.contains('hidden')) {
				popUp.window.classList.remove('hidden', 'fade-in');
			}					

			if (popUp.modal) {
				popUp.modal.classList.remove('hidden');
			}
		
		},
		simpleRender(response, hayType=0, pageBone=this.currentPage.bone, dom=this.currentPage.dom) {	

			let modelData = response,
			hayStack = [
				['<!--','-->'],
				['{{','}}'],
			];
			
			if (!modelData) { return; }
			Object.keys(modelData).forEach(e => {
				pageBone = pageBone.replace(new RegExp(hayStack[hayType][0]+e+hayStack[hayType][1], "g"), modelData[e]);
			});
			dom.innerHTML = pageBone;
		},
		multicallRender(packets, renderFunc){
			let packet;
			for ( packet of packets ) {
				renderFunc = packet.pop()+"Render";
				if (!view[renderFunc]) { console.log('missing: '+renderFunc); continue; }
				view[renderFunc](...packet);			
			}
		},
		redirectRender(url) {
			//console.log('redirectRender ( was inited from model) '+url);
			router.redirect(url);
		},
		templateInsertRender(data, template="", dom=this.currentPage.dom){
			if (!data || !dom) { return; }
			if (typeof dom == "string") { dom = document.querySelector(dom); }
			var newContent = "", newItem;
			for (row of data) {
				newItem = template;
				Object.keys(row).forEach(e => {
					newItem = newItem.replace(new RegExp('{{'+e+'}}', "g"), row[e]);
				});
				newContent = newContent + newItem;
			}
			dom.innerHTML = newContent;
		},

		visibility(){
			let group = [
				['.guest_only', Auth.role === 0],
				['.logged_only', Auth.role > 0],
				['.member_only', Auth.roleId > 1],
				['.moderator_only', Auth.roleId > 2],
				['.admin_only', Auth.roleId > 3],
			];

			function applyVisibility(key, visible=false){
				var elements = document.querySelectorAll(key), e;
				action = visible ? 'remove' : 'add';
				for (e of elements) {
					if (e.classList.contains('hidden') === visible){
						e.classList[action]("hidden");
					}
				}				
			}
			
			for (visibility of group){
				applyVisibility(...visibility);
			}
		}
	}
	
	// ------------------------------------------------------
	// ---------------------- model -------------------------
	// ------------------------------------------------------

	var model = {
		getModelPath(model) {
			return MODEL_PATH+model[0].toUpperCase()+model.slice(1).toLowerCase()+'.php';
		},
		//create
		getFormData(form) {
			// select inputs in "form" element
			// store input value with key but we remove the prefix
			// form is login, then input id and name mut have "login_" prefix
			// ex. in login form <input name="login_password"> but we store "password"
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
		
		// send form data to server and wait to answer 
		sendForm(form){
			var formMethod = form.dataset.method,
			formAction = form.dataset.action.split('/'),
			requestKey = formAction[0]+'_'+formAction[1],
			param;
			
			// we get the input values and if not object then we make error
			param = this.getFormData(form);
			if (typeof param === "string") {
				return alert(param);
			}
			
			// make this request locked until ajax response
			
			
			// set url, method, data for ajax
			this.sendRequest ({
				url: this.getModelPath(formAction[0]), 
				method: formMethod, 
				data: {
					action: formAction[1], 
					param: param,
					hash: Auth.hash || '',
					domain: Auth.domain || '',
				}
			});

		},
		
		getPageData(controller, action, param) {
			this.sendRequest({
				url: this.getModelPath(controller), 
				method: 'GET', 
				data: {
					action: action, 
					param: param,
					hash: Auth.hash || '',
					domain: Auth.domain || '',
				}
			});			
		},
		
		sendRequest(ajaxData, lock=true){
			// handler: unlock the request and write a success msg
			let requestKey = false;
			if (lock) {
				// i use the url like requestKey but remove any non alphaNum char
				requestKey = ajaxData.url.replace(/[^a-zA-Z_0-9]+/g,'');
				if (activeRequest[requestKey]) { 
					return notify.add('Request already running, please wait till it finished','error'); 
				}
				activeRequest[requestKey] = true;
			}
			function successHandler(data){
				if (requestKey) { delete activeRequest[requestKey]; }
				if (data.renderFunc) {
					// to render function we give modelData array
					// if render function need more param then modelData.length = arg.length
					view[data.renderFunc+'Render'](...data.modelData);
					
				}
			}
			
			// handler: unlock the request and write a error msg
			function errorHandler(data){
				if (requestKey) { delete activeRequest[requestKey]; }
				console.log(data);
				//alert("Error, something went wrong with database");
			}
			
			//console.log(this);
			// send every data with ajax
			Ajax( ajaxData, successHandler, errorHandler );				
		}

	};

	// -----------------------------------------------------------------
	// ---------------------- static & api page data -------------------
	// -----------------------------------------------------------------

	
	var pages = {
		home: {
			index: {
				title: 'A Gyülekezet Főoldala',
			},
		},
		user: {
			login: {
				title: "Bejelentkezés",
				render: true,
			},
			logout: {
				title: "Kijelentkezés",
			},			
			registration: {
				title: "Bejelentkezés",
				render: true,
			},
			edit: {
				title: 'Beállítások',
			},
		},
		video: {
			index: {
				title: "Youtube videók",
				container: ".video-box-container",
				template: {
					videoBox:	`<div class="video-box">
									<a href="/video/playlist/{{id}}" title="{{title}} playlist">
										<img src="{{img}}" alt="{{title}} cover">
										<p> Lista: <b>{{title}}</b> ({{counter}}) </p>
									</a>
								</div>`
				},
				render(routeData, pageBone=null, dom=null){
					localStorage.removeItem("YouTube.playList");
					var template = this.template.videoBox,
						dom = dom.querySelector(this.container);
					if (YouTube.playList.length == 0) {
						if (localStorage.getItem("YouTube.playList")) {
							YouTube.playList = JSON.parse(localStorage.getItem("YouTube.playList"));
						}
					}

					function youTubePlaylistHandler (data){
						if (!data.items) { return; }
						data.items.forEach(function(e){
							YouTube.playList.push({
								id: e.id,
								title: e.snippet.title,
								img: e.snippet.thumbnails.medium.url,
								date: e.snippet.publishedAt,
								counter: e.contentDetails.itemCount,
							});
						});
						localStorage.setItem("YouTube.playList", JSON.stringify(YouTube.playList))
						//view.youtubeRender(YouTube.playList, false, template, dom);
						view.templateInsertRender(YouTube.playList, template, dom);
					}
				
					if (YouTube.playList.length == 0) {
						Ajax( {
							url: 'https://www.googleapis.com/youtube/v3/playlists', 
							method: 'GET', 
							data: {
								channelId: YouTube.channelId,
								maxResults: YouTube.maxResults,
								key: YouTube.key,
								part: YouTube.part
							}
						}, youTubePlaylistHandler, youTubePlaylistHandler );	
						
					}else{
						view.templateInsertRender(YouTube.playList, template, dom);
					}
				}
			},
			
			playlist: {
				title: "Youtube videók",
				container: ".video-box-container",
				template: {
					videoBox:	`<div class="video-box">
									<a href="popup:youtube/{{index}}" title="{{title}} playlist">
										<img src="{{img}}" alt="{{title}} cover">
										<p><b>{{title}}</b></p>
									</a>
								</div>`
				},
				render(routeData, pageBone=null, dom=null){
					let id = routeData.param.id,
						index = routeData.param.index;
					if (!id) { return; }
					localStorage.removeItem("YouTube.playList");
					var template = this.template.videoBox,
						dom = dom.querySelector(this.container);

					function youTubeVideosHandler (data){
						var modelData = [],
							popUp = view.global.popUp,
							i = 0;
						if (!data.items) { return; }
						data.items.forEach(function(e){
							i++;
							modelData.push({
								id: e.contentDetails.videoId,
								parentId: id,
								index: i,
								title: e.snippet.title,
								img: e.snippet.thumbnails.medium.url,
							});
						});

						view.setPopUpDataRender(modelData, index || 0);
						view.templateInsertRender(modelData, template, dom);
						if (index > 0) {
							view.popUpRender('youtube/'+index);
						}
					}
				
	
					Ajax( {
						url: 'https://www.googleapis.com/youtube/v3/playlistItems', 
						method: 'GET', 
						data: {
							playlistId: id,
							maxResults: YouTube.maxResults,
							key: YouTube.key,
							part: YouTube.part
						}
					}, youTubeVideosHandler, youTubeVideosHandler );	

				}
			},
		},
		gallery: {
			index: {
				title: "Albumok",
			},
			
			album: {
				title: "Képek",
			},
		},		
		event: {
			index: {
				title: "Események",
				render: true,
			},
			
			list: {
				title: "Események",
				render: true,
			},
		},		
		error: {
			index: {
				title: 'Hiba, az oldal leállt!',
				render(routeData, pageBone=null, dom=null) {
					var err = [], id = routeData.param.id;
						err[403] = "Cannot access page";
						err[404] = "Page not found";
						err[500] = "Internal server error";

						view.simpleRender({
							id: id,
							msg: err[id] || 'Unknown error!',							
					}, 1,  pageBone, dom);
				},				
			}
		},
		
		// PAGE INIT
		// this do permanent dom render / add event listeners stuff
		init() {
			// i use these links in page what not part of content (header or menu)
			var menu = [
				["/home","Vissza a főoldalra","home.png","Főoldal",0],
				["/event","Események megtekintése","calendar.png","Naptár",0],
				["/video","Videók megtekintése","videos.png","Videók",0],
				["/gallery","Kép galéria megtekintése","albums.png","Képek",0],
				["/worship","Dicséretek halgatása vagy letöltése","worship.png","Énekek",0],
				["http://biblia.gyozelem.ro","Ugrás az Online Biblia oldalra","bible.png","Biblia",0],
				["/guestbook","Üzenőfal megtekintése","wall.png","Üzenőfal",0],
				["/articles","Cikkek megtekintése","articles.png","Cikkek",0],
				["/messages","Üzenetek megtekintése","messages.png",null,1],
				["/user/settins","Beállítások megtekintése","settings.png",null,1],
				["/user/logout","Kijelentkezés","logout.png",null,1],
				["/user/login","Bejelentkezés","login.png",null,2],								
			],
			templates = {
				normal: {
					parent: ["page-menu"],
					selector: [0],
					template: "<a href='{{0}}' title='{{1}}'> <span class='menuButton'><img src='"+BASE_ROOT+"/img/icons/menu/{{2}}'> <span class='buttonName'> {{3}} </span></span></a>",
				},
				normal_log: {
					parent: [null, "page-logged", "page-login"],
					selector: [1, 2],
					template: "<a href='{{0}}' title='{{1}}'> <img src='"+MENU_ICON_PATH+"{{2}}'> </a>",
				},
				burger: {
					parent: ["burger-menu", "burger-logged", "burger-login"],
					selector: [ 0, 1, 2 ],
					template: "<a href='{{0}}' title='{{1}}'> <span class='menuButton'> <img src='"+BASE_ROOT+"/img/icons/menu/{{2}}'></span></a>",
				},
			}, dataLen, n, attrLen, haystack,
			childDOM, selector, parentDOM, parentID, i,
			dataLen = menu.length, newDOM = {}, 
			dom = document.querySelector('#App'), pageBone = dom.innerHTML;
			
			// creating and storeing new dom elements (string form)
			Object.keys(templates).forEach( e => {
				if (e === 'burger') {
					console.log('entered');
				}
				for ( n=0; n<dataLen; n++) {
					
					selector = templates[e].selector[menu[n][4]];
					parentID = templates[e].parent[menu[n][4]];
					
					if (!templates[e].parent[menu[n][4]]) { continue; };
					attrLen = menu[n].length > 0 ? menu[0].length-1 : 0;
					childDOM = templates[e].template;
					for (i=0; i<attrLen; i++){
						childDOM = childDOM.replace("{{"+i+"}}", menu[n][i]);
					}
					newDOM[parentID] = (newDOM[parentID] || "")  + childDOM;
				}

			});
			
			// replace the groups in main page body string
			Object.keys(newDOM).forEach( e => {
				pageBone = pageBone.replace( "<!--"+e+"-->", newDOM[e]);
			});

			//overwrite page body with new content
			dom.innerHTML = pageBone;
			
			view.global.popUp.close.addEventListener('click', () => {
				view.global.popUp.closeHandler();
			});
			
			view.visibility();
		},		
	};


	// -----------------------------------------------------------
	// ---------------------- controller -------------------------
	// -----------------------------------------------------------
	

	
	function Controller(middleware){
		// cachein popUp object properties
		let popUp = view.global.popUp;
		view.global.body = document.querySelector('body');
		popUp.window = document.querySelector('.popUp');
		popUp.close = popUp.window.querySelector('.close');
		popUp.content = popUp.window.querySelector('.content');
		view.global.cacheTrash = document.querySelector('.cacheTrash');
		if (popUp.window.dataset.modal === "true") {
			popUp.modal = document.querySelector('.modal-layer.page-modal');
			//popUp.modal = document.querySelector('.modal-layer.page-modal');
		}
		// init several view render 
		pages.init();
		// assign function for middleware with a keyword
		this.middleware = middleware;
		this.middleware.add('redirect', setPage); 
		this.pageEvent = [];

		function setPage(data){
	
			let dom, bone, title;
			if (view.currentPage.dom) {
				terminate();
			}

			dom = getPage( data.controller, data.action);
			bone = dom ? dom.innerHTML : '';
			
			let	cache = pages[data.controller][data.action] || null;
			if (cache) {
				title = cache.title || '';
				
				// if page is with modal we hidden then overflow scrollbar
				if (dom && dom.dataset.modal) {
					view.global.body.classList.add("overflow-hidden");
				}
				if (cache.render) {
					// if this function exist then make a view render
					// but this is only for pages with static content
					if (typeof cache.render == "function") {
						cache.render(data, bone, dom);
					}
				} else {
					// if it is dynamic page then we need data from DB
					// so we need request for page data
					model.getPageData(data.controller, data.action, data.param);
				}
			}		
			
			view.currentPage = { dom, bone, title, data };	

			if (!dom) { 
				console.log('View not exist, please contact with Admin!'); 
			} else {
				dom.classList.remove("hidden");
				document.title = title;
			}
		}
		
		function getPage(controller, action) {
			return document.querySelector('.page .'+controller+' .'+action);
		}
		
		function terminate() {
			
			let {dom, bone, title, data} = view.currentPage,
				popUp = view.global.popUp;
			// remove listeners, timers if exist but still we not have
			if (dom && dom.dataset.modal) {
				view.global.body.classList.remove("overflow-hidden");
			}
			view.currentPage.dom.classList.add("hidden");
			//reset bone to thisw page to original
			dom.innerHTML = bone;
			
			// if popUp is opened then we close

			if (popUp.dataIndex !== 0) {
				popUp.closeHandler();
			}
			
		}
			
	} 

	class Middleware {
		constructor() {
			this.handler = {};
		}		
		add (label, callback=null){
			if (typeof label === "string") {
				this.handler[label] = callback;
				//console.log('Register handler: '+label+' ['+this.handler[label].toString()+']');
			}
		}
		run (label, data) {
			if (typeof label === "string" && typeof this.handler[label] ==="function") {
				this.handler[label](data);
				//console.log('Run handler: '+label+' ['+this.handler[label].toString()+']');
			}
		}
		remove (label){
			if (typeof label === "string" && this.handler[label]) {
				delete this.handler[label];
				//console.log('Remove handler: '+label+' ['+this.handler[label].toString()+']');
			}
		}
	}
	
	let middleware = new Middleware();  
	let router = new Router(middleware);
	let controller = new Controller(middleware);
	//let ajax = new Ajax();
	
	router.init();
	

	
// ----------------------------------------------------------
// ----------------------- NOTIFY ---------------------------
// ----------------------------------------------------------

var Notify = function() {
	var BOX_CLASS = "notify",
		CONTAINER_CLASS = "notify-container",
		CONTAINER_ID = "notifyContainer",
		NOTIFY_WIDTH = 300, 
		container = document.getElementById(CONTAINER_ID),
		notifyList = {};
		lastId = 0,
		transitionHandler = function(){
			let id = this.id, 
				notify = notifyList[id].dom,
				notifyClose = notifyList[id].close;
			notifyClose.removeEventListener("click", notifyCloseHandler);
			notify.removeEventListener("transitionend", transitionHandler);
			notify.removeChild(notifyClose);
			container.removeChild(notify);
			notifyList[id].dom = null;
			notifyList[id].notifyClose = null;
			clearTimeout(notifyList[id].timer);
			delete notifyList[id];			
		}, 
		notifyCloseHandler = function(){
			close(this.parentElement.id);
		};			

	function createContainer() {
		container = document.createElement("div");
		container.className = CONTAINER_CLASS;
		container.id = CONTAINER_ID;
		document.body.appendChild(container);
	}	

	function newNotify (message, type="normal", NOTIFY_DURATION=5) {
		//type: warning, notice, error, success, normal
		var id = 'notification_' + lastId;
		if(!container) {
			 createContainer();
		}		

		var newNotify = document.createElement("div"),
			closeButton = document.createElement("div");
		newNotify.className = BOX_CLASS + " " + type;
		newNotify.id = id;
		newNotify.innerHTML = message;
		newNotify.style.marginLeft = NOTIFY_WIDTH + 10 + "px";
		newNotify.appendChild(closeButton);
		closeButton.className = "close-notify";
		closeButton.innerHTML = "&#10060;";
		closeButton.addEventListener("click", notifyCloseHandler, false);

		notifyList[id] = { 
			id, 
			message, 
			type, 
			dom: newNotify, 
			close: closeButton, 
			timer: setTimeout(function() {
				removeNotify(id);
			}, NOTIFY_DURATION*1000)
		};
		container.insertBefore(newNotify, container.firstChild);
		lastId++;

	}
	
	function close (id) {
		removeNotify(id);
	}

	function removeNotify(id) {
		var notify = notifyList[id].dom;
		notify.classList.add("fade-out");
		notify.addEventListener("transitionend", transitionHandler, false);
	}	
	
	return {
		add (message, type = "notice") {
			newNotify (message, type);
		},
	}
}

var notify = new Notify();
//notify.add('asdasda', 'success');
//notify.add('asdasda', 'notice');
//notify.add('asdasda', 'warning');
//notify.add('asdasda', 'normal');

	/*
	function Event(key, event, handler){
		
		this.obj = document.querySelector(key);
		this.eventOn = true;			
		if (window.addEventListener) {
			this.obj.addEventListener(event, handler);
		} else if (window.attachEvent) {
			this.obj.attachEvent('on'+event, handler);
		}else{
			this.eventOn = false;
		}
		this.key = key;
		this.event = event; 			
		this.handler = handler;	
		
	}

	var o1 = new Event('#home', 'click', function(){alert(12);});
	var o2 = new Event('#edit', 'click', function(){alert(1222);});
	
	console.log(o1);
	console.log(o2);
	*/
		
	//page_pages
	
	//document.getElementById('pages').add
	
	//var e = new Elem('#b3');
	//e.addEvent();	

	/*

	var Elem = function (key) {
		this.obj = document.querySelector(key);
		this.event = null; 			// init property
		this.handler = null;		// init property
		this.eventOn = false;		// init property
	};

	Elem.prototype.removeEvent = function(){
		console.log('entered into remove event function');
		console.log(this.event);
		console.log(this.handler);
		if (!this.event || !this.handler) { return; }
		
		if (window.removeEventListener) {
			this.obj.removeEventListener(this.event, this.handler);
		} else if (window.attachEvent) {
			this.obj.detachEvent('on'+event, handler);
		}
		
		if (!this.obj.removeEventListener(this.event, this.handler)){ return; }
		this.event = null; 				// reset
		this.handler = null;			// reset
		this.eventOn = false;
		console.log(this.eventOn);
	};

	
	Elem.prototype.addEvent = function(event = null, handler = null){

		console.log('entered into add event function');
		if (!event || !handler) { return; }
		if (window.addEventListener) {
			this.obj.addEventListener(event, handler);
		} else if (window.attachEvent) {
			this.obj.attachEvent('on'+event, handler);
		}

		this.eventOn = true;
		this.event = event; 			// save event type
		this.handler = handler;			// save handler
		console.log(this.event);
		console.log(this.handler);
		console.log(this.eventOn);
	};
	*/
	/*
	
	var b = new Elem('#pages');
	b.addEvent('click', function(e){alert(this.dataset.route);});

	
	*/
	
	/*
	var e = new Elem('#b3');
	e.addEvent();
	e.addEvent('click', function() { alert('1'); });
	
	var e1 = new Elem('.v3');
	e1.addEvent('click', function() { alert('21'); });	
	*/
	
	//alert(BASE_QUERY_STRING);		
	//console.log(BASE_QUERY);	
	
	//window.history.replaceState( null , null, BASE_ROOT+'/asdas' );
	//setTimeout(function(){
	//	alert(JSON.stringify(getURL()));		
	//}, 1000);
	/*
	function redirect(path){
		if (!routes.hasOwnProperty(path)) { return alert('Page not exist'); }
		window.history.pushState( {valami:'aaaa'} , routes['path'], path );
		window.history.replaceState( {valami:'aaaa'} , routes['path'], path );
	}

	
	*/	
	
	// need remove later if i add everything inside of Aopp
	return {
		ajax_tmp() {
			console.log('visibility change');
			view.visibility();
		},
		notify_tmp(data) {
			notify.add(...data);
		},	
		view: view,
		model: model,
	}

}();

</script>
	</body>
</html>