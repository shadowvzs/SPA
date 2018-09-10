(function() {
	//localStorage.removeItem("Auth");
	const BASE_PROTOCOL = location.protocol,
	BASE_HOSTNAME = location.hostname,
	BASE_DIR = "",
	BASE_ROOT = BASE_PROTOCOL+'//'+BASE_HOSTNAME+BASE_DIR,
	MODEL_PATH = BASE_ROOT+"/"+"model/",
	IMAGE_PATH = BASE_ROOT+"/"+"img/",
	GALLERY_PATH = IMAGE_PATH+"gallery/",
	THUMBNAIL_PATH = GALLERY_PATH+"mini/",

	MENU_ICON_PATH = IMAGE_PATH+"/icons/menu/",

	VALIDATOR = {
		'NUMBER': /^[0-9]+$/,
		'ALPHA': /^[a-zA-Z]+$/,
		'ALPHA_NUM': /^[a-zA-Z0-9]+$/,
		'STR_AND_NUM': /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/,
		'LOW_UP_NUM': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
		'SLUG': /^[a-zA-Z0-9-_]+$/,
		'NAME': '',
		'NAME_HUN': /^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû]+)$/,
		'STRING_HUN': /^([a-zA-Z0-9_.,&%*#@% ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû]+)$/,
		'EMAIL': /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
		'IP': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	},

	INTERNAL_ERROR_URL = '/error/500',
	NOT_FOUND_URL = '/error/404',
	NO_ACCESS_URL = '/error/403',
	ERROR_MSG = {
		'403': 'Cannot access page',
		'404': 'Page not found',
		'500': 'Internal server error',
	};

	// default auth
	var Auth = localStorage.getItem("Auth")
		? JSON.parse(localStorage.getItem("Auth"))
		: {
			hash: '',
			role: 0,
			name: 'Guest',
			domain: '',
		};

	// ------------------------------------------------------
	// ---------------------- Ajax -------------------------
	// ------------------------------------------------------

	function Ajax () {

		function serialize(obj, prefix) {
			var str = [], p;
			for(p in obj) {
				if (obj.hasOwnProperty(p)) {
				  var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				  str.push((v !== null && typeof v === "object") ?
					serialize(v, k) :
					encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
			}
			return str.join("&");
		};

		function request (url, method, data, success, error) {
			if (typeof error != "function" || typeof success != "function") { return alert('Missing classback(s)....'); }
			if (!url) { return error('no settings for request'); }
			var type = (!/(GET|POST|PUT|DELETE)/.test(method)) ? "GET": method ;

			var httpRequest = new XMLHttpRequest();

			data.hash = Auth.hash || '';
			data.domain = Auth.domain || '';
			if ((!data || (Object.keys(data).length === 0 && data.constructor === Object))) {
				data = null;
			} else if (type === "GET") {
				url += (~url.indexOf("?") ? "&" : "?") + serialize(data);
				data = null;
			}


			httpRequest.onreadystatechange = function(event) {

				if (this.readyState === 4) {
					if (this.status === 200) {
						if (!this.response) { error("no returned data"); return false; }
						let newAuth = this.response.auth,
							notifyMsg = this.response.notify;
						if (newAuth) {
							if (Auth.hash != newAuth.hash || Auth.role != newAuth.role || Auth.hash != newAuth.domain) {
								Auth = { ...newAuth };
								localStorage.setItem("Auth", JSON.stringify(Auth));
								view.visibility();
							}
						}

						if (notifyMsg) { notify.add(...notifyMsg); }
						if (!this.response.success) { return error(this.response); }
					   // if (this.response.error) { error(this.response.error); return false; }
						success (this.response.data || this.response);

					} else {
						error(this.status);
					}
				}
			};

			httpRequest.responseType = 'json';
			httpRequest.open(type, url, true);
			console.log('ajax data', data, url);
			if (type !== "POST" || !data) {
				httpRequest.send();
			}else{
				httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				httpRequest.send(serialize(data));
			}
		}

		return {
			get(url, data, success=null, error=null){
				request (url, 'GET', data, success, error);
			},
			post(url, data, success=null, error=null){
				request (url, 'POST', data, success, error);
			},
			raw(setup, success, error){
				request (setup.url, setup.method, setup.data, success, error);
			}
		}
	}

	// ------------------------------------------------------
	// ---------------------- Router ------------------------
	// ------------------------------------------------------


	function Router(middleware){
		var errorPage = '';
		var stopLoop = false,
		path = () => {
			var tmp_path = encodeURI(location.href).split('#'),
				base_path = tmp_path[0].substr(BASE_ROOT.length),
				base_arr = base_path.split('?'),
				base_url = base_arr[0],
				url_array = base_url.substr(1).split('/'),
				query_string = base_arr[1] || '',
				query_array = query_string.length === 0
						? []
						: base_arr[1]
							.split('&')
							.map(str => {
								let q = str.split('=');
								return { [q[0]] : q[1] || '' };
							});
			if (base_path === "/") { base_path = "/home" ;}
			return {
				base_path, base_arr, base_url, url_array, query_string, query_array
			};
		},

		routes = [
			['/home', false, null, false],
			//['/admin/home/:id/:name', 'admin', 1, ['NUMBER', 'SLUG']],
			['/event', false, null, false],
			['/guestbook', false, null, false],
			['/video/playlist/:id/:index', false, null, ['SLUG','NUMBER']],
			['/video/playlist/:id', false, null, ['SLUG']],
			['/video', false, null, false],
			['/gallery/album/:id/:index', false, null, ['SLUG','NUMBER']],
			['/gallery/album/:id', false, null, ['SLUG']],
			['/gallery', false, null, false],
			['/user/login', false, null, false],
			['/user/logout', false, null, false],
			['/user/registration', false, null, false],
			['/error/:id', false, null, ['NUMBER']],
		];

		//url: prefix/controller/view | prefix | auth group | validation for params

		function validateRoute(){
			// like a interface
			let { base_path, base_arr, url_array, query_string, query_array } = path(),
			data = {
				'prefix': null,
				'controller': null,
				'action': null,
				'param' : {},
			},
			routes_len = routes.length,
			dataKeys = Object.keys(data),
			paramCount = 0,
			len, i, route_url, firstChar, shiftIndex;

			for ( route of routes ) {
				route_url = route[0].substr(1).split('/');
				len = url_array.length;
				i = 0;
				paramCount = 0;
				shiftIndex = route[1] ? 1 : 0;

				if (route_url.length != len) { continue; }
				if (route[1] &&  route_url[0] != url_array[0]) { continue; }
				if (route_url[shiftIndex] != url_array[shiftIndex]) { continue; }

				for (; i<len; i++ ) {
					firstChar = route_url[i].charAt(0);
					if (firstChar !== ":" && route_url[i] === url_array[i] && i < 3) {
						//verification or static url piece
						//console.log('STATIC PARAM: '+route_url[i]);
						data[dataKeys[i + 1 - shiftIndex]] = url_array[i];
					} else if (firstChar === ":" && route_url[i].length > 0 && i > 0) {
						//console.log('DYNAMIC PARAM: '+route_url[i]);
						// verification for dynamic params like :id
						if (Array.isArray(route[3])) {
							if (VALIDATOR[route[3][paramCount]].test(url_array[i])) {
								//console.log('    VALIDATION: validation on '+url_array[i]+' passed');
								data.param[route_url[i].substr(1)] = url_array[i];
							} else {
								//console.log('    VALIDATION: missing or wrong validation for '+url_array[i]+'');
								// if incorrect data with dynamic param like :id
								return redirect(NOT_FOUND_URL, 'Not Found');
							}
						}
						paramCount++;

					} else {
						//console.log('DROPPED PARAM: '+route_url[i]);
						// skip every checking if first param not same
						//i = len;
						break;
					}
					if (i === len - 1 ) {
						if (!isNaN(parseInt(route[2])) && Auth.roleId < route[2] ) {
							//console.log('User have no access for '+base_path+', we redirect to '+NO_ACCESS_URL);
							return redirect(NO_ACCESS_URL, 'Forbidden');
						}
						// verification for route[2] role rank
						// this not done yet because no users
						if (data.controller && !data.action) { data.action = 'index'; }
						// reuse the len and i ariable because anyway i will escape
						// from here with return
						if (query_array.length) {
							for ( query_param of query_array ) {
								Object.assign(data.param, query_param);
							}
							//Object.assign(data.param, query_array);
						}
						//console.log(data.param);

						return data;
					}
				}

			}

			return redirect(NOT_FOUND_URL, 'Not Found');
		}

		function redirect(newUrl=null, title=null, obj=null) {
			//console.log('old path: '+path().base_path);
			history.pushState( null , title, BASE_ROOT+path().base_path );
			if (newUrl) {
				//console.log('new path: '+newUrl);
				history.replaceState( null , title, BASE_ROOT+newUrl );
			}
			var data = validateRoute();
			if (data) {
				console.log('Redirecting in router: '+JSON.stringify(data));
				middleware.run("redirect", data );
			}
		}



		function eventRegistation() {
			// event handler if user click to a link
			document.addEventListener("click", e => {
				let t = e.target, depth = 3, i = 0, href;
				for (; i < depth; i++) {
					if (t.hasAttribute("href")){
						href = t.getAttribute("href");
						break;
					} else {
						if (!t.parentElement) { return 'no href on clicked target also no parent';}
						t = t.parentElement;
					}
				}

				// no href then no action

				if (!href) { return console.log('no href where i clicked'); }
				// internal link handle redirect(url)
				if (href.charAt(0) === "/") {
					console.log('internal page link was detected');
					e.preventDefault();
					redirect(href);
					if (burgerCheckbox.checked) { burgerCheckbox.checked = false; }
				// special link - form submit / popUp etc
				} else if (href === '*') {
					let action = (t.dataset.action || []).split('/');
					if (!action) { return console.log('Warning: data-action is empty'); }
					let actionType = action.splice(0, 1)[0];
					action = action.join('/');
					e.preventDefault();

					if (actionType === 'submit') {
						console.log('form event link was detected');
						model.submitForm(action+"_Form");
					} else if (actionType === 'popup') {
						console.log('popup event link was detected');
						popUp.render(action);
					} else if (actionType === 'edit') {

					} else if (actionType === 'delete') {

					}

/*
} else if (href.length > 7 && href.substr(0,7) === 'submit:') {
	console.log('form event link was detected');
	e.preventDefault();
	model.submitForm(href.substr(7)+"_Form");
} else if (href.length > 6 && href.substr(0,6) === 'popup:') {
	console.log('popup event link was detected');
	e.preventDefault();
	popUp.render(href.substr(6));
*/
				} else {
					console.log('normal link redirect to other page');
				}
			});

			// event handler if user click to BACK button
			window.addEventListener('popstate', event => {
				// The popstate event is fired each time when the current history entry changes.
				let href = location.href;
				history.back();
				if (href != location.href) {
					console.log('back');
					redirect();
				}
				event.preventDefault();
				// Uncomment below line to redirect to the previous page instead.
				// window.location = document.referrer // Note: IE11 is not supporting this.
				// history.pushState(null, null, window.location.pathname);

			}, false);
		}

		if (document.readyState === 'complete') {
			eventRegistation();
		}else{
			document.onreadystatechange = () => {
			  if (document.readyState === 'complete') {
				 eventRegistation();
			  }
			};
		}

		return {
			url() {
				return {
					base_path,
					base_url,
					url_array,
					query_string,
					query_array
				}
			},
			redirect(newUrl=null, title=null, obj=null) {
				return redirect(newUrl, title, obj);
			},
			virtualRedirect(newUrl){
				history.pushState( null, null, location.href );
				history.replaceState( null, null, newUrl );
				console.log(newUrl);
			},
			// not dry but maybe easier to read, anyway not too much plus
			init() {
				return redirect();
			}
		}
	};



	// just a debug function
	debug = data => (
		console.log(data)
	)


	// ------------------------------------------------------
	// ---------------------- model -------------------------
	// ------------------------------------------------------

	var Model = function(){
		// let store the ongoing requests in this object until we have callback
		// example: user click to home, then we send request to Home.php for data
		// and we disable request sending for same url until we get a success or error
		var activeRequest = {};
		var	Api = {
			YouTube: {
				localData: {
					key: 'AIzaSyAGUqUIMRRxZysmI-G2JvMjuK_QF1dqFS4',
					channelId: 'UCju4wi5kFZ80lV8QHrm8lXg',
					part: 'snippet,contentDetails',
					title: "Győzelem Gyülekezet",
					maxResults: '25',
					playList: [],
					videoList: {},
				},

				getData(d=null) {
					var local = this.localData;
					if ((local.playList.length > 0) && (!d.id)) {
						console.log('play list readed from variable');
						return view.build([local.playList]);
					} else if (d.id && local.videoList && local.videoList[d.id] && local.videoList[d.id].length) {
						console.log('video list readed from variable');
						return view.build([local.videoList[d.id]]);
					}

					function youTubePlaylistHandler (data) {
						var playlist = local.playList;
						if (!data.items) { return console.log('no item in data'); }
						data.items.forEach(e => {
							playlist.push({
								id: e.id,
								title: e.snippet.title,
								img: e.snippet.thumbnails.medium.url,
								date: e.snippet.publishedAt,
								counter: e.contentDetails.itemCount,
							});
						});
						console.log('render from playlist handler');
						return view.build([playlist]);
					}




					function youTubeVideoListHandler (data){
						var i = 0, videoList = local.videoList[d.id] || []
							index = d.index || 0;
						if (!data.items) { return console.log('no items property on data'); }
						data.items.forEach(e => {
							i++;
							videoList.push({
								id: e.contentDetails.videoId,
								parentId: local.id,
								index: i,
								title: e.snippet.title,
								img: e.snippet.thumbnails.medium.url,
							});
						});

						view.build([videoList]);
						popUp.setData(videoList, index || 0);
						if (index > 0) {
							popUp.render('youtube/'+index, true);
						}
					}

					if (!d.id) {
						ajax.get('https://www.googleapis.com/youtube/v3/playlists', {
							channelId: local.channelId,
							maxResults: local.maxResults,
							key: local.key,
							part: local.part
						}, youTubePlaylistHandler, youTubePlaylistHandler);
					} else {
						ajax.get('https://www.googleapis.com/youtube/v3/playlistItems', {
							playlistId: d.id,
							maxResults: local.maxResults,
							key: local.key,
							part: local.part
						}, youTubeVideoListHandler, youTubeVideoListHandler);
					}
				}
			}
		};

		function getModelPath(model) {
			return MODEL_PATH+model[0].toUpperCase()+model.slice(1).toLowerCase()+'.php';
		}
		//create
		function getFormData(form) {
			// select inputs in "form" element
			// store input value with key but we remove the prefix
			// form is login, then input id and name mut have "login_" prefix
			// ex. in login form <input name="login_password"> but we store "password"
			var inputs = form.querySelectorAll('input, select, textarea'), value, rule, val_len,
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
		}

		// send form data to server and wait to answer
		function sendForm(form){
			var formMethod = form.dataset.method,
			formAction = form.dataset.action.split('/'),
			requestKey = formAction[0]+'_'+formAction[1],
			param;

			// we get the input values and if not object then we make error
			param = getFormData(form);
			if (typeof param === "string") {
				return alert(param);
			}

			// set url, method, data for ajax
			sendRequest ({
				url: getModelPath(formAction[0]),
				method: formMethod,
				data: {
					action: formAction[1],
					param: param,
				}
			});

		}

		function getPageData(controller, action, param) {
			sendRequest({
				url: getModelPath(controller),
				method: 'GET',
				data: {
					action: action,
					param: param,
				}
			});
		}

		function jumpToRender(str, data){
			if (!str) { return console.log('empty render function');}
			if (str === "build" || str === "multicall") { return view[str](data); }
			let s = str.split('.');
			if (s.length !== 2) { return console.log('invalid render function string'); }
			if (!view[s[0]](s[1], data)) { return console.log('render function not exist'); }
		}

		function sendRequest(ajaxData, lock=true){
			// handler: unlock the request and write a success msg
			let requestKey = false;
			if (lock) {
				// i use the url like requestKey but remove any non alphaNum char
				requestKey = ajaxData.url.replace(/[^a-zA-Z_0-9]+/g,'');
				console.log('active request', activeRequest);
				if (activeRequest[requestKey]) {
					return notify.add('Request already running, please wait till it finished','error');
				}
				activeRequest[requestKey] = true;
			}
						console.log(requestKey);

			function successHandler(data){
				console.log('answer success');
				if (requestKey) { delete activeRequest[requestKey]; }
				if (data.renderFunc) {
					// to render function we give modelData array
					// if render function need more param then modelData.length = arg.length
					jumpToRender(data.renderFunc, data.modelData)

				}
			}

			// handler: unlock the request and write error msg
			function errorHandler(data){
				console.log('answer error');
				if (requestKey) { delete activeRequest[requestKey]; }
				console.log(data);
				//alert("Error, something went wrong with database");
			}

			// send every data with ajax
			ajax.raw( ajaxData, successHandler, errorHandler );
		}

		return {
			getPageData(controller, action, param){
				return getPageData(controller, action, param);
			},
			submitForm(str){
				if (typeof str !== "string") { return console.log('invalid submit link'); }
				var form = document.getElementById(str);
				if (!form) { return alert('Invalid form!'); }
				return sendForm(form);
			},
			getCustomData(key, param){
				if (key.length > 4 && key.substr(0, 4) === 'Api.') {
					key = key.substr(4);
					if (!Api[key] || !Api[key]['getData']) { return console.log('Api undefined ('+key+')'); }
					Api[key].getData(param);
					console.log(key);
				} else {
					console.log('not api');
				}
			}

		}
	};

	// -----------------------------------------------------------------
	// ------------ static data about pages in json form ---------------
	// -----------------------------------------------------------------

	var pages = {
		current: {
			routeData: null,
			dom: null,
			bone: "",
			title: "",
			data: null,
			component: null,
			componentData: {}
		},
		global: {
			body: null,
			cacheTrash: null,  // dom
			cache: {},		   // chached stuff key
		},
		home_index: {
			title: 'A Gyülekezet Főoldala',
			render: {
				model: true,
			},
			template: 'homePage',
			component: {
				newsCalendar: {
					// start with day view mod (0-3)
					viewMode: 0,
					// limit on years
					range: {
						min: 2000,
						max: 2143,
					},
					// calendar place and event when appear
					show: {
						event: ['click', '.stickyNote .calendarIcon'],
						place: '.stickyNote',
					},
					// data and event date key
					datasource: {
						get: MODEL_PATH+'News.php?action=index&filter=all',
						add: MODEL_PATH+'News.php?action=add',
						delete: MODEL_PATH+'News.php?action=delete',
					},
					constructor: Calendar
				}
			},
		},
		user_login: {
			title: "Bejelentkezés",
			template: 'loginForm',
			modalPage: true,
		},
		user_logout: {
			title: "Kijelentkezés",
			render: {
				model: true,
			}
		},
		user_registration: {
			title: "Bejelentkezés",
			template: 'signupForm',
			modalPage: true,
		},
		video_index: {
			title: 'Youtube videók',
			render: {
				model: 'Api.YouTube'
			},
			template: 'videoPlaylist',
		},
		video_playlist: {
			title: "Youtube videók",
			render: {
				model: 'Api.YouTube'
			},
			template: 'videoList',
		},
		gallery_index: {
			title: "Albumok",
			render: {
				model: true,
			},
			template: 'albumList',
		},
		gallery_album: {
			title: "Képek",
			render: {
				model: true,
			},
			template: 'albumImageList',
		},
		event_index: {
			title: "Események",
			render: {
				model: true,
			},
			template: 'eventPage', // fix to event index
			component: {
				guestCalendar: {
					viewMode: 0,
					range: {
						min: 2000,
						max: 2143,
					},
					show: {
						event: ['click', '.guestBox .calendarIcon'],
						place: '.guestBox',
					},
					datasource: {
						get: MODEL_PATH+'Guest.php?action=index&filter=all',
						add: MODEL_PATH+'Guest.php?action=add',
						delete: MODEL_PATH+'Guest.php?action=delete',
					},
					constructor: Calendar
				},
				newsCalendar: {
					viewMode: 0,
					range: {
						min: 2000,
						max: 2143,
					},
					show: {
						event: ['click', '.stickyNote .calendarIcon'],
						place: '.newsBox',
					},
					datasource: {
						get: MODEL_PATH+'News.php?action=index&filter=all',
						add: MODEL_PATH+'News.php?action=add',
						delete: MODEL_PATH+'News.php?action=delete',
					},
					constructor: Calendar
				}
			},
		},
		guestbook_index: {
			title: "Vendégkönyv",
			render: {
				model: true,
			},
			template: 'guestbook',
			component: {
				FormComponent: {
					formTemplate: 'valami',
					show: {
						event: ['click', '.valahol'],
						place: '.valamerre',
					},
					storeData: true,
					datasource: {
							add: MODEL_PATH+'Guestbook.php?action=add',
							edit: MODEL_PATH+'Guestbook.php?action=update',
							delete: MODEL_PATH+'Guestbook.php?action=delete',
					},
					constructor: FormComponent
				}
			}
		},
		error_index: {
			title: 'Hiba, az oldal leállt!',
			template: 'errorMsg',
		},

		// PAGE INIT
		// this do permanent dom render / add event listeners stuff

	};

	// ------------------------------------------------------
	// ---------------------- PopUp -------------------------
	// ------------------------------------------------------


	var popUp = {
		window: null,
		close: null,
		modal: null,
		content: null,
		dataList: null,
		dataIndex: 0,
		closeHandler() {
			let hrefArr = location.href.split('/');
			// remove the index from url, ie. image/1/2 => 2
			hrefArr.pop();
			this.window.classList.add('hidden', 'fade-in');
			// remove window content
			this.content.innerHTML = "";
			// reset index if window is closed
			this.dataIndex = 0;
			// change back the url
			router.virtualRedirect(hrefArr.join('/'));

			if (this.modal) {
				this.modal.classList.add('hidden');
			}
		},
		type: {
			youtube: {
				template: 'popUpVideo',
			},
			image: {
				template: 'popUpAlbumImage',
			}
		},
		render (str, replaceIndex) {
			try {
				var rawData = str.split('/'),
					[type, index] = rawData,
					dataList = popUp.dataList,
					dataLen = dataList.length,
					direction = { next: 1, previous: -1}
					dataIndex = parseInt(popUp.dataIndex, 10);

				if (dataIndex > 0) {replaceIndex = true;}

				if (direction[index]) {
					let nextIndex = (dataIndex == 0 ? 1 : dataIndex) + direction[index];
					if (nextIndex < 1 || nextIndex > dataLen) {  return console.log('return because cannot go to '+index); }
					replaceIndex = true;
					index = nextIndex;
				}

				var	selectedData = this.dataList[index-1],
					template = this.type[type].template,
					urlArr = location.href.split('/');
			} catch(err) {
				return notify.add(err.message, 'error');
			}

			this.dataIndex = index;
			if (replaceIndex) {
				let arrEnd = urlArr.length-1;
				urlArr[arrEnd] = index;
			} else {
				urlArr.push(index);
			}
			router.virtualRedirect(urlArr.join('/'));
			this.content.innerHTML = view.getContent(template, selectedData);

			if (this.window.classList.contains('hidden')) {
				this.window.classList.remove('hidden', 'fade-in');
			}

			if (this.modal) {
				this.modal.classList.remove('hidden');
			}
		},
		setData(list=null, index=null) {
			this.dataList = list;
			if (!index && index != 0) {
				this.dataIndex = index;
			}
		}

	};

	// ------------------------------------------------------
	// ---------------------- View -------------------------
	// ------------------------------------------------------


	var View = function(){

		var rFunc = {
			setPopUpData(list=null, index=null) {
				popUp.setData(list, index);
			},

			popUpRender(str, replaceIndex=false) {
				popUp.render(str, replaceIndex);
			},

			preloadImage(cacheKey, pathKey = 'path'){
				let global = pages.global,
					cacheTrash = global.cacheTrash,
					cache = global.cache,
					dataList = popUp.dataList,
					data, path, images = "", timer;
				if (cache[cacheKey] || !cacheTrash) { return console.log('the image group was alread cached'); }

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
			multicall(packets, renderFunc){
				let packet;
				for ( packet of packets ) {
					renderFunc = packet.pop();
					if (!view[renderFunc]) { console.log('missing: '+renderFunc); continue; }
					view[renderFunc](...packet);
				}
			},
			redirect(url) {
				console.log('redirect function was executed in View: '+url);
				router.redirect(url);
			},
		};

		var tFunc = {
			popUpAlbumImage(d){
				return `<div class="image-container">
							<div class="image-src-side">
								<img src="${GALLERY_PATH+d.path}">
								<div class="leftCarousel"><a href='*' data-action='popup/image/previous'> &#10096; </a></div>
								<div class="rightCarousel"><a href='*' data-action='popup/image/next'> &#10097; </a></div>
							</div>
							<div class="image-data-side">
								<time datetime="${d.created}">${d.created}</time><br><br>
									${d.description}
							</div>
						  </div>`;
			},
			popUpVideo(d){
				return `<div class="video-container">
							<iframe src="https://www.youtube.com/embed/${d.id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
						</div>`;
			},
			videoPlaylist(d){
				let str = "";
				d.forEach(e => {
					str += `<div class="video-box">
						<a href="/video/playlist/${e.id}" title="${e.title} playlist">
							<img src="${e.img}" alt="${e.title} cover">
							<p> Lista: <b>${e.title}</b> (${e.counter}) </p>
						</a></div>`;
				});
				return 	`<div class="video-box-container">${str}</div>`;
			},
			videoList(d){
				console.log(d);
				let str = "";
				d.forEach(e => {
					str += `<div class="video-box">
								<a href="*" data-action="popup/youtube/${e.index}" title="${e.title} playlist">
									<img src="${e.img}" alt="${e.title} cover">
									<p><b>${e.title}</b></p>
							</a></div>`;
				});
				return 	`<div class="video-box-container">${str}</div>`;
			},
			albumList(d,c) {
				let str = "";
				d.forEach(e => {
					str += `<div class='album-box'>
						<a href='/gallery/album/${e.id}' title='${e.title} album: ${e.description}'>
							<img src='${THUMBNAIL_PATH+e.coverImage}' alt='${e.title}'>
							<p><b>${e.title}</b><br><font size='2'>(${e.created})</font></p>
						</a>
					</div>`;
				});
				return `<div class="album-box-container">${str}</div>`;
			},
			albumImageList(data) {
				let [selAlbum, albumList, imageList] = data, albums = "", images = "";
				albumList.forEach(a => {
					albums += `<li><a href='/gallery/album/${a.id}' title='${a.title}'>${a.title}</a></li>`;
				});
				imageList.forEach(i => {
					images += `<div class='image-box'>
						<a href='*' data-action='popup/image/${i.index}' title='${i.description}'>
							<img src='${THUMBNAIL_PATH+i.path}' alt='${i.description}'>
						</a>
					</div>`;
				});

				return `<div class="album-list">
					<ul>
						<li>
							<label for="dropdown01" class="selected-album"><a title='${selAlbum.title}'>${selAlbum.title}</a></label>
							<input id="dropdown01" type="checkbox" class="hidden"/>
							<ul class="album-link-list">
								${albums}
							</ul>
						</li>
					</ul>
				</div>
				<div class="image-box-container">
					${images}
				</div>	`;
			},
			errorMsg(d) { return `<b>Error ${d.id}:</b> ${ERROR_MSG[d.id]}`; },
			loginForm(){ return	`<div class="modal-layer chrr_trnspnt_bg"></div>
						<div class="modal-layer lght_blck_trnspnt_bg"></div>
						<div class="form_window" id="login_Form" data-method="POST" data-action="user/login">
							<h1>Bejelentkezés</h1><br>
							<input id="login_email" name="login_email" type="text" placeholder="Email cím" title="Kérem adjon meg egy valós email címet" data-rule="EMAIL,5,50">
							<input id="login_password" name="login_password" type="password" placeholder="Jelszó" title="Kérem adjon meg egy jelszót, az angol ABC betűit és/-vagy számok felhasználasával" data-rule="ALPHA_NUM,6,32"><br>
							<a href="*" data-action="submit/login"><button class="button col-gray"> Bejelentkezés </button></a>
							<a href="/user/registration"><button class="button col-gray"> Regisztrálás </button></a>
							<br><br>
							<a href="/home"><button class="button col-gray"> Vissza </button></a>
							<br><br>
							<a href="#" class="disabled underlined">Elfelejtette a jelszavat?</a>
						</div>`; },
			signupForm(){ return	`<div class="modal-layer brwn_trnspnt_bg"></div>
						<div class="modal-layer sm_blck_trnspnt_bg"></div>
						<div class="form_window" id="signup_Form" data-method="POST" data-action="user/add">
							<h1>Regisztrálás</h1><br>
							<input id="signup_name" name="signup_name" type="text" placeholder="Teljes név" title="Kérem adja meg a nevét a magyar ABC betűit használva (5-50 karakter)" data-rule="NAME_HUN,5,50">
							<input id="signup_email" name="signup_email" type="email" placeholder="E-mail cím" title="Kérem egy valós email címet adjon meg" data-rule="EMAIL,5,50">
							<input id="signup_password" name="signup_password" type="password" placeholder="Jelszó" title="Kérem adjon meg egy jelszót, az angol ABC betűit és/-vagy számok felhasználasával (6-32 karakter)" data-rule="ALPHA_NUM,6,32">
							<input id="signup_password2" name="signup_password2" type="password" placeholder="Jelszó újra" title="Kérem adjon meg egy jelszót újra ami megegyezik a másik jelszó mezővels" data-same="signup_password"><br>
							<a href="*" data-action="submit/signup" title="Fiók elkeszítése"><button class="button col-gray reg"> Rendben</button></a>
							<a href="/home"><button class="button col-gray"> Vissza </button></a><br><br>
							<a href="/user/login" title="Jelentkezen be ha van már fiókja">... vagy jelentkezen be</a>
						</div>`; },
			homePage(d) {
				return `<main>
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
											${d.home_last_note}
										</div>
									</div>
								</div>
								<br>
								${d.home_about}
							</div>
						</main>
						<aside>
							<div class="fund">
								${d.home_fund}
							</div>
							<div class="social">
								${d.home_social}
							</div>
							<div class="service">
								${d.home_contact}
							</div>
						</aside>`
			},
			scheduleBox(array) {
				let str = '<h1>Program</h1>';
				for (schedule of array) {
					str += `<div class="schedule"><h2>${schedule.event_name}</h2><p>${schedule.event_at}</p></div>`;
				}

				return '<div class="scheduleBox"><div class="content">'+str+'<br><br><br><h3>Mindenkit szeretettel várunk!</h3></div></div>';
			},
			guestBox(array) {
				let str = '<h1>Vendégek</h1>';
				if (array.length > 0) {
					for (guest of array) {
						str += `<div class="guest"><h2>${guest.title}</h2><p>${guest.created}</p></div>`;
					}
				} else {
					str += `<div class="guest"><p>a lista üres</p></div>`
				}
				str += '<div class="calendarIcon"><img src="./img/icons/menu/event.png"></div>';
				return '<div class="guestBox"><div class="content">'+str+'</div></div>';
			},
			eventPage (data) {
				let str = '', hidden = ['id','name', 'user_id'];
				str += this.scheduleBox(data.schedule);
				str += this.guestBox(data.guests);
				str += `<div class="newsBox"><div class="content"><div class="stickyNote">${data.news}</div></div></div>`;
				str += `
				<div class="googleMaps">
					<div class="content">
						<h1>Nagyváradi gyülekezetünk itt található</h1>
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5435.928819643834!2d21.929802999629814!3d47.06054848694138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474647e056cf23f9%3A0x9a1c1b519cdc1b5b!2sStrada+Dun%C4%83rea+13%2C+Oradea!5e0!3m2!1sro!2sro!4v1524975411442" frameborder="0" allowfullscreen></iframe>
						<iframe src="https://www.google.com/maps/embed?pb=!4v1524973259460!6m8!1m7!1sZLPtaM6ornwjZnrdr6jz0w!2m2!1d47.06164013604532!2d21.93405346801144!3f24.20144629559638!4f-2.604647556893454!5f0.7820865974627469" frameborder="0" allowfullscreen></iframe>
					</content>
				</div>`;
				return str;
			},
			guestbookComment( {id, name, created, message} = data ) {
				let bubble = (id, type) => Auth.role > 0 ? `<span class="${type}"><a href="${id}">&times;</a></span>` : '';

				return `<div class="comment" id="comment_${id}">
									<span class="name">${name}</span> <span class="time">${created}</span>${bubble(id, 'delete')}
									<div class="message">${message}</div>
								</div>`;
			},
			guestbook (data) {
					let str = data.length === 0 ? `<h2>Nincs bejegyzés</h2>` : ``, comment,
					//	id, name, created, message,
						form = `<div class="form_window sm_blck_trnspnt_bg" id="addComment_Form" data-method="POST" data-action="user/add">
						<h1>Uj hozzaszolas</h1>
						<input type="text" placeholder="Nev" id="addComment_name" name="addComment_name" data-rule="NAME_HUN,5,50">
						<input type="text" placeholder="email cim" id="addComment_email" name="addComment_email" data-rule="EMAIL,5,50">
						<textarea placeholder="Uzenet" id="addComment_message" name="addComment_message" data-rule="STRING_HUN,5,50"></textarea>
						<br><br>
						<a href="*" data-action="submit/addComment" title="Fiók elkeszítése"><button class="button col-gray reg"> Rendben </button></a>
						<a href="h:addComment_Form" title="Fiók elkeszítése"><button class="button col-gray reg"> Megse </button></a>
						</div>
						`;
					for (comment of data) {
						str += this.guestbookComment(comment);
					}
					/*
					for ({id, name,created, message} of data) {
						str += `<div class="comment" id="comment_${id}">
											<span class="name">${name}</span> <span class="time">${created}</span>${bubble(id, 'delete')}
											<div class="message">${message}</div>
										</div>`;
					}
					*/
					console.log(str);
				 return "<div class='content'>"+form+str+"</div>";
			},
			getFullname(first, last) { return `${first} ${last}`; },
			popUpContentImage(path, filename, uploaded, description) {
				return `
					<div class="image-container">
						<div class="image-src-side">
							<img src="${path}${filename}">
							<div class="leftCarousel"><a href='*' data-action='popup/image/previous'> &#10096; </a></div>
							<div class="rightCarousel"><a href='*' data-action='popup/image/next'> &#10097; </a></div>
						</div>
						<div class="image-data-side">
							<time datetime="${uploaded}">${uploaded}</time><br><br>
								${description}
						</div>
					</div>`;
			},
			popUpContentVideo: function(id){
				return `<div class="video-container">
							<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
						</div>`;
			},

			pageContainer(cntrllr, ctn, tmplt) { return `<div class="${cntrllr}"><div class="${ctn} fadeOut">${tmplt}</div></div>`; },

		};

		var hFunc = {

		};


		function refreshDOMVisibility(){
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
		};

		(function() {
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

			refreshDOMVisibility();
		})();

		function build(data = null) {
			let current = pages.current,
				{ controller, action, param } = current.routeData,
				pageData = pages[controller+'_'+action],
				bone, dom;//var c = new Calendar(setup);
			data = data || [param];
			bone = tFunc.pageContainer(controller, action, tFunc[pageData.template](...data));
			pages.global.pageContent.innerHTML = bone || '';
			dom = pages.global.pageContent.querySelector('.page .'+controller+' .'+action) || null;

			// replace the current page data
			current = Object.assign(current, {
				title: pageData.title,
				bone,
				data,
				dom,
				component: null,
				componentData: {},
			});

			// add page title
			document.title = current.title || '';

			// fix scrollbar issue if page is modalPage (fullscreen like page)
			if (dom && pageData.modalPage) {
				pages.global.body.classList.add("overflow-hidden");
				dom.dataset.modal = true;
			}

			if (!dom) {
				console.log('View not exist, please contact with Admin!');
			}

			if (pageData.component) {
				var pageComponent = pageData.component, component;
				if (!current.component) { current.component = {}; }
				Object.keys(pageComponent).forEach(key => {
					setTimeout(() => {
						component = pageComponent[key];
						current.componentData[key] = component.storeData ? data[0] : {};
						console.log(current.componentData[key]);
						console.log(hFunc);
						current.component[key] = new component['constructor'](component, ajax);

					}, 0);

				});
			}
		}

		function terminate(){
			let {dom, bone, title, data, component, componentData} = pages.current;
			// remove listeners, timers if exist but still we not have
			if (dom && dom.dataset.modal) {
				pages.global.body.classList.remove("overflow-hidden");
			}
			//remove
			if (component) {
				Object.keys(component).forEach(e => {
					if (component[e].remove) {
						component[e].remove();
						componentData[e] = {};
						console.log('remove '+e+' component from page data');
					}
				});
			}
			// remove the page content
			dom.innerHTML = "";
			// total clean
			pages.current = {}

			// if popUp is opened then we close
			if (popUp.dataIndex !== 0) {
				popUp.closeHandler();
			}
		}

		return {
			getContent (template, data){
				return tFunc[template](data);
			},
			render(func, data){
				console.log(func);
				console.log(data);
				if (!rFunc[func](...data)) { return console.log('multicall error: '+func+' not exist');}
			},
			multicall(data){
				var renderFunc, s;
				data.forEach(e => {
					renderFunc = e.pop();
					if (renderFunc === "build") {
						console.log(e);
						build(e);
					} else {
						if (!rFunc[renderFunc]) { return console.log('multicall error: '+renderFunc+' not exist');}
						rFunc[renderFunc](...e)
					}
				});
			},
			build(data = null) {
				build(data);
			},
			visibility(){
				refreshDOMVisibility();
			},
			terminate(){
				terminate();
			}
		}
	};

	// -----------------------------------------------------------
	// ---------------------- controller -------------------------
	// -----------------------------------------------------------


	function Controller(middleware){
		// cachein popUp object properties
		let global = pages.global;
		//popUp = global.popUp;
		global.body = document.querySelector('body');
		global.pageContent = global.body.querySelector('.content.page');
		popUp.window = document.querySelector('.popUp');
		popUp.close = popUp.window.querySelector('.close');
		popUp.content = popUp.window.querySelector('.content');
		global.cacheTrash = document.querySelector('.cacheTrash');

		if (popUp.window.dataset.modal === "true") {
			popUp.modal = document.querySelector('.modal-layer.page-modal');
			//popUp.modal = document.querySelector('.modal-layer.page-modal');
		}
		popUp.close.addEventListener('click', () => {
			popUp.closeHandler();
		});
		// init several view render


		//obj = {controller:'error',action:'index',param: {id:'404',msg:'valami'}};
		//console.log(v.build(obj));

		// assign function for middleware with a keyword
		middleware.add('redirect', setPage);

		function setPage(data){
			let { controller, action, param } = data,
				cache = pages[controller+'_'+action] || null,
				render = cache ? cache.render || null : null,
				dom;

			if (pages.current.dom) {
				view.terminate();
			}

			pages.current.routeData = data;

			if (!cache) { return 'missing page data'; }

			// page is static & don't need interaction with backend
			if (!render || (!render.model && !render.view)) {
				console.log('controller: redirect to view for static page rendering, based on param');
				view.build();
			// page need to get data from our backend or from api
			} else if (render.model) {
				// we get data from api
				if (typeof render.model === "string") {
					console.log('controller: redirect to model and get api data');
					model.getCustomData(render.model, param);
				// we get data from our backend
				} else if (render.model === true) {
					console.log('controller: redirect to model and get data');
					model.getPageData(controller, action, param);
				}
				console.log('model render');
			// i dont know yet, maybe i will remove this option in future
			} else if(render.view && typeof render.view === "string") {
				// i dont know this yet
			}
		}
	}

	// -----------------------------------------------------------
	// ---------------------- Middleware -------------------------
	// -----------------------------------------------------------


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



	// ----------------------------------------------------------
	// ----------------------- Notify ---------------------------
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

		// Types: 'error', 'success', 'notice', 'warning', 'normal'
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
				}, NOTIFY_DURATION * 1000)
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

	// -----------------------------------------------------------
	// ----------------------- Calendar --------------------------
	// -----------------------------------------------------------


	function Calendar(settings={range:{}}) {
		var calendar, calId, calBody, calHeader, selDate, currentDate, calClose, calPrev, calNext, calView, selected, render,
		yearStack = [], yearStackIndex, callback, eventData, selEvents, dateKey, calToggleButtonEvent,
		dayShort = ['Mon', 'Tue', 'Wed', 'Tue', 'Fri', 'Sat', 'Sun'], eventForm, datasource, calToggleButton,
		viewMode, calMode = ['Day', 'Month', 'Year', 'YearStack', 'reserved', 'Event'],
		monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		function nextHandler() {
			if (viewMode === 0) {
				selDate.string = selDate.month === 12 ? `${selDate.year+1} 1 2 01:00:00` : `${selDate.year} ${selDate.month+1} 02 01:00:00`;
			} else if (viewMode === 1) {
				selDate.string = `${selDate.year+1} 1 2 01:00:00`;
			} else if (viewMode === 2) {
				let index = yearStackIndex;
				if (index == (yearStack.length-1)) { return console.log('Year stack upperlimit reached'); }
				index++;
				selDate.string = `${yearStack[index][0]} 1 2 01:00:00`;
				yearStackIndex = index;
			}
			if (selDate.string.substr(0,4) > yearStack[yearStack.length-1][1]) { return console.log('date lowerlimit reached'); }
			return selDate = render['selectNew'+calMode[viewMode]](selDate.string);
		}

		function toggleCalendar () {
			let stat = calendar.style.display;
			if (stat !== 'none') {
				//reser somthing if needed
			}
			calendar.style.display = stat !== 'block' ? 'block' : 'none';
		}

		function setYearStackIndex(year) {
			if (!year && year !== 0) { yearStackIndex = currentDate.yearStackIndex; }
			var i = 0, max = yearStack.length;
			for (; i<max; i++) {
				if (yearStack[i][0] > year) { break; }
				yearStackIndex = i;
			}
		}

		function prevHandler() {
			if (viewMode === 0) {
				selDate.string = selDate.month === 1 ? `${selDate.year-1} 12 2 01:00:00` : `${selDate.year} ${selDate.month-1} 02 01:00:00`;
			} else if (viewMode === 1) {
				selDate.string = `${selDate.year-1} 1 2 01:00:00`;
			} else if (viewMode === 2) {
					console.log('index: '+yearStackIndex);
					if (yearStackIndex < 1) { return console.log('Year stack lowerlimit reached'); }
					yearStackIndex--;
					selDate.string = `${yearStack[yearStackIndex][0]} 1 2 01:00:00`;
			}

			if (selDate.string.substr(0,4) < yearStack[0][0]) { return console.log('date lowerlimit reached'); }

			return selDate = render['selectNew'+calMode[viewMode]](selDate.string);
		}

		function getDateArray (date) {
			return date.split(/[- :]/);
		}

		function validateTime(time){
			return /^([0-1]?[0-9]|[2][0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(time)
				? (time.length === 4 ? '0'+time : time )
				: '';
		}

		function saveEvent() {
			var title = eventForm.title.value.trim(),
				message = eventForm.message.value.trim(),
				date = calView.dataset.lastDate,
				time = validateTime(eventForm.time.value),
				mysqlDate = getDateArray(date).join('-')+' '+time+':00',
				index = parseInt(eventForm.select.value, 10);
				newEvent = {
					id: (index > -1 && selEvents[index] ) ? selEvents[index].id : -1,
					title: title,
					message: message,
					[dateKey]: mysqlDate,
				};
			if (!title || !message || !time) { return alert('Please fill the fields!');}
			// save to database
			// we add only in callback
			ajax.post(
				datasource.add,
				{ param: newEvent },
				data => {
					if (index > -1) {
						selEvents[index].title = newEvent.title;
						selEvents[index].message = newEvent.message;
					}else{
						newEvent = {...newEvent, ...data.modelData};
						console.log(newEvent);
						addEvents({
							list: [newEvent],
							key: dateKey
						});
					}
					changeViewMode(0, date);
				},
				//data => notify.add(data, 'error')
				data => console.log(data.error)
			);

			console.log(eventData);
		}

		function deleteEvent(){
			var index = parseInt(eventForm.select.value, 10),
				date = calView.dataset.lastDate,
				dateArray = getDateArray(date)
				obj = eventData;
			if (index == -1 || !selEvents[index] ) { return alert('Select an existing event what you want remove'); }
			// need ajax remove and we do this in callback


			ajax.get(
				datasource.delete,
				{ param: {id: selEvents[index].id } },
				data => {
					for (key of dateArray) {
						key = parseInt(key, 10);
						if (!obj[key]) { return console.log('date not exist'); }
						obj = obj[key];
						obj.count--;
					}

					obj.list.splice(index, 1);
					changeViewMode(0, date);
				},
				data => console.log(data.error)
			);
		}

		function getEvents(date) {
			var dateArr = getDateArray(date), obj = eventData;
			for (key of dateArr) {
				key = parseInt(key, 10);
				if (obj[key]) { obj = obj[key]; } else { console.log('no event at: '+date);return ''; }
			}

			return obj.list;
		}

		function pickDateHandler(e) {

			var t = e.target, tDate = t.dataset.date;
			if (!tDate) { return; }

			if (viewMode > 0) {
				decreaseViewMode(tDate, e.target.dataset.yearStack);
			}else {
				var t = e.target;
				if (tDate) {
					selected = new Date(tDate);
					changeViewMode (5, tDate, getEvents(tDate));
				}
			}

		}

		function pickEventHandler(e) {
			var eIndex = parseInt(e.target.dataset.event, 10);
			if (selEvents[eIndex]) {
				eventForm.select.selectedIndex = eIndex+1;
				eventForm.title.value = selEvents[eIndex].title;
				eventForm.message.value = selEvents[eIndex].message;
			}

		}

		function changeEventHandler(){
			var index = eventForm.select.value;
			eventForm.title.value = index > -1 ? selEvents[index].title : '';
			eventForm.message.value = index > -1 ? selEvents[index].message : '';
		}

		function changeViewMode (vMode=0, newDate=null, yearStack=null) {

			if (!calMode[vMode]) { return console.log('view mode not exist: '+vMode ); }
			if (viewMode != vMode) {
				if (calBody) { calBody.innerHTML = ""; }
				calendar.classList.remove('v'+calMode[viewMode]);
			}

			calendar.classList.add('v'+calMode[vMode]);
			selDate = render['selectNew'+calMode[vMode]](newDate, yearStack);
			viewMode = vMode;
			console.log('new view mode '+vMode);
		}

		function increaseViewMode(){
			if (viewMode === 5) {
				changeViewMode(0, calView.dataset.lastDate);
			//old condition viewMode < calMode.length - 1
			} else if (viewMode < 3) {
				changeViewMode(viewMode+1, calView.dataset.lastDate);
			}
		}



		function decreaseViewMode(newDate, YearStackIndex=null){
			changeViewMode(viewMode-1, newDate, YearStackIndex);
		}

		function addEvents(RawDates){
			var depth = 3, obj, date_key,
				date, data, i, {list, key} = RawDates;

			dateKey = key;
			if ( !eventData) { eventData = {}; }
			for (data of list) {
				if (!data[key]) { continue; }
				date = getDateArray(data[key]);
				// generate key if not exist like obj[year][month][day]
				// and count the sub childs
				obj = eventData;
				for (i=0;i<depth;i++) {
					date_key = parseInt(date[i], 10);
					if (!obj[date_key]) { obj[date_key] = {}; }
					obj = obj[date_key];
					obj.count = !obj.count ? 1 : obj.count+1;
				}
				// add data to deepest obj like: 2018: { 11: {30: {list: [data] } } }
				if (!obj.list){obj.list=[];}
				obj.list.push(data);
			}
		}

		var template = {
			window(id) { return '<div class="ev-cal" id="cal_'+id+'" style="display:none;"></div>'; } ,
			content: '<div class="head"><div><a class="prev-index">&#8249;</a><p class="view-mode"></p><a class="next-index">&#8250;</a><div class="close">&times;</div></div></div></div></div><div class="body"></div>',
			cell(str) { return "<div class='cell'>"+str+"</div>"; },
			subHead(days) {
				var str = "";
				for (day of days) {
						str += "<div class='cell'>"+day+"</div>";
				}
				return "<div class='subHead'><div class='row'>"+str+"</div></div>";
			},
			events(list) {
				if (!list || list.length < 1) {
					return '<br>No event on this date';
				}
				var str = "";
				list.forEach( (e, i) => {
					str += "<div class='bubble'><h3 data-event="+i+">"+e.title+"</h3><p data-event="+i+">"+e.message+"</p><time>"+e[dateKey]+"</time></div>";
				});
				return str;
			},
			option(value, text) {
				return '<option value="'+value+'">'+text+'</option>';
			},
			newEventForm: '<div class="newEventForm"><input type="text" placeholder="Event title" class="title"> <textarea placeholder="Event description" class="message"></textarea><select></select><input type="text" class="time" placeholder="Time hh:mm" value="08:00"><button class="save">Save</button><button class="remove">Delete</button><div class="eventList"></div></div>'
		}

		function loadData(datasource){

			ajax.get(datasource.get, {}, data => {
					addEvents({
						list: data.modelData[0],
						key: data.modelData[1]
					});
					changeViewMode(viewMode);
				},
				data => notify.add(data, 'error')
			);
		}

		function init() {
			var now = new Date(), c, i, yearStackMin, yearStackMax,
				max, show = settings.show, eventDiv, calId = +new Date();
			if (show) {
				let place = show.place ? show.place : 'footer';
				document.body.querySelector(place)
					.insertAdjacentHTML('afterend', template.window(calId));
				calToggleButton	= document.body.querySelector(show.event[1]);
				calToggleButtonEvent = show.event[0];
				calToggleButton.addEventListener(calToggleButtonEvent, toggleCalendar);
			}
			calendar = document.body.querySelector('.ev-cal#cal_'+calId);
			if (show.position) {
				if (show.position == "middle") {
					calendar.classList.add('middle');
				}
			}
			viewMode = settings.viewMode || 0;
			calendar.classList.add('v'+calMode[viewMode]);
			calendar.innerHTML = template.content;
			calHeader = calendar.querySelector('.head');
			calPrev = calHeader.querySelector('.prev-index');
			calNext = calHeader.querySelector('.next-index');
			calView = calHeader.querySelector('.view-mode');
			calBody = calendar.querySelector('.body');
			calClose = calHeader.querySelector('.close');
			calBody.addEventListener("click", pickDateHandler);
			calPrev.addEventListener("click", prevHandler);
			calNext.addEventListener("click", nextHandler);
			calView.addEventListener("click", increaseViewMode);
			calClose.addEventListener("click", toggleCalendar);

			calHeader.insertAdjacentHTML( 'afterend', template.subHead(dayShort)+template.newEventForm);
			eventDiv = calendar.querySelector('.newEventForm');
			eventForm = {
				time: eventDiv.querySelector('input.time'),
				title: eventDiv.querySelector('input.title'),
				message: eventDiv.querySelector('textarea.message'),
				select: eventDiv.querySelector('select'),
				save: eventDiv.querySelector('button.save'),
				remove: eventDiv.querySelector('button.remove'),
				list: eventDiv.querySelector('.eventList'),
			};

			eventForm.list.addEventListener("click", pickEventHandler);
			eventForm.select.addEventListener("change", changeEventHandler);
			eventForm.save.addEventListener("click", saveEvent);
			eventForm.remove.addEventListener("click", deleteEvent);
			datasource = settings.datasource;
			console.log(eventForm);

			currentDate = {
				day: now.getDate(),
				month: now.getMonth()+1,
				year: now.getFullYear(),
				yearStackIndex: null,
				string: now.getFullYear()+' '+(now.getMonth()+1)+' '+now.getDate()
			};

			selDate	= currentDate;
			yearStackMin = settings.range.min || currentDate.year - 71;
			yearStackMax = settings.range.max || currentDate.year + 72;
			if (datasource) {
				loadData(datasource);
			}

			i = 0;
			for (c=yearStackMin; c <=yearStackMax;c+=12) {
				console.log(c+'-'+yearStackMax);
				max = (c+12 > yearStackMax) ? yearStackMax+1 : c+12;
				yearStack.push([c, max-1]);
				if (currentDate.year >= c && currentDate.year < (max+1)){
					currentDate.yearStackIndex = i;
				}
				i++;
			}

			if (!datasource) {
				changeViewMode(viewMode);
			}
			console.log(selDate);
		}

		function createCell (day, dateArr, status, date="", newYearStack=false){
			var div = document.createElement('div'),
				className = ['inactive', null, 'selected'],
				classArr = ['cell'];
			div.dataset.date = date;
			if (newYearStack!==false) { div.dataset.yearStack = newYearStack; }

			if (className[status]) {classArr.push(className[status]); }

			if (currentDate.string === date) {
				classArr.push('today');
			}

			if ( eventData && dateArr) {
				if (typeof dateArr === "object") {
					var i = 0, obj = eventData;
					for (key of dateArr) {
						if (!obj[key]) { obj=null;break; }
						obj = obj[key];
					}
					if (obj && obj.count && obj.count > 0) {
						div.dataset.counter = obj.count;
					}
				} else if (typeof dateArr === "number") {
					var stack = yearStack[dateArr];
					if (stack) {
						let count = 0, start = stack[0], end = stack[1],
							i = start;
						for (; i<end; i++) {
							if (eventData[i] && eventData[i].count) {
								count += eventData[i].count;
							}
							console.log('i: '+i+'        '+count);
						}
						if (count > 0) {
							div.dataset.counter = count;
						}
					}
				}
			}

			div.appendChild(document.createTextNode(day));
			div.classList.add(...classArr);
			return div;
		}

		function createRow (){
			var div = document.createElement('div');
			div.classList.add('row');
			return div;
		}

		var render = {
			selectNewDay (dateTime=null) {
				var row, cell, selected, c, r, maxRow = 6, status = 0,
					fragment = document.createDocumentFragment(), selDate, iDay, iMonth, iYear;
				calBody.innerHTML='';
				selected = dateTime ? new Date(dateTime) : new Date();
				selected.day = selected.getDate();
				selected.month = selected.getMonth()+1;
				selected.year = selected.getFullYear();
				selected.days = new Date(selected.year, (selected.month), 0).getDate();
				selected.firstDay = new Date(selected.year, (selected.month-1), 1).getDay();
				selected.lastDay = new Date(selected.year, (selected.month), 0).getDay();
				setYearStackIndex(selected.year);
				calView.dataset.lastDate = selected.year+' '+selected.month+' '+selected.day+' 01:00:00';
				console.log('year'+selected.year);

				prev = new Date(selected.year, (selected.month - 2), 1);
				if(selected.month==0){prev = new Date(selected.year-1, 11, 1);}
				prev = new Date(prev.getFullYear(), (prev.getMonth() + 1), 0).getDate();
				iDay = prev - selected.firstDay-6;
				iYear = selected.year;
				iMonth = iDay > 1 ? selected.month-1 : selected.month;
				if (iMonth == 0) { iMonth = 12; iYear--;}
				if (prev-iDay>6) {
					iDay += 7;
				}
				console.log(iDay);
				for (r=0; r<maxRow; r++){
					row = createRow();
					for (c=0; c<7;c++){
						iDay++;

						if ((iDay > prev && status == 0) || (iDay > selected.days && status == 1)) {
							status = status === 0 ? 1 : 0;
							iDay = 1;
							if (iMonth > 11) {
								iYear++;
								iMonth = 0;
							}
							iMonth++;
						}

						selDate = iYear+' '+('0' + iMonth).slice(-2)+' '+('0' + iDay).slice(-2);
						row.appendChild(
							createCell(
								iDay,
								[iYear, iMonth, iDay],
								(currentDate.year === iYear &&  currentDate.month === iMonth && currentDate.day === iDay) ? 2 : status,
								selDate
							)
						);
					}
					fragment.appendChild(row);
				}

				calBody.appendChild(fragment);
				calView.innerHTML = monthName[selected.month-1]+' '+selected.year;
				return selected;
			},

			selectNewMonth(dateTime=null) {
				var row, cell, selected, c, r, i = 0, status, year,
					fragment = document.createDocumentFragment(), selDate;

				calBody.innerHTML='';
				selected = dateTime ? new Date(dateTime) : new Date();
				selected.day = selected.getDate();
				selected.month = selected.getMonth()+1;
				selected.year = selected.getFullYear();
				year = selected.year;
				calView.dataset.lastDate = year+' '+selected.month+' '+selected.day+' 01:00:00';
				setYearStackIndex(year);

				console.log('year'+year);

				for (r=0; r<4; r++){
					row = createRow();
					for (c=0; c<3;c++){
						i++;
						selDate = year+' '+(i)+' 1';
						status = (currentDate.year === year &&  currentDate.month === i) ? 2 : 1;
						row.appendChild(createCell(monthName[i-1], [year, i], status, selDate));

					}
					fragment.appendChild(row);
				}

				calBody.appendChild(fragment);
				calView.innerHTML = selected.year;
				return selected;
			},

			selectNewYear(dateTime=null, index=null) {
				var row, cell, selected, c, r, i = 0, status, year,
					selYearStack = isNaN(yearStackIndex) ? currentDate.yearStackIndex : yearStackIndex,
					start = yearStack[selYearStack][0],
					end = yearStack[selYearStack][1],
					fragment = document.createDocumentFragment(), selDate;
				calBody.innerHTML='';
				yearStackIndex = index;

				if (!start || !end) { return console.log('invalid stack date');}

				selected = dateTime ? new Date(dateTime) : new Date();
				selected.day = selected.getDate();
				selected.month = selected.getMonth()+1;
				selected.year = selected.getFullYear();
				year = selected.year;
				calView.dataset.lastDate = year+' '+selected.month+' '+selected.day+' 01:00:00';
				setYearStackIndex(year);

				i = start;

				for (r=0; r<12; r++){
					row = createRow();
					for (c=0; (c<3);c++){
						if (i>end) { break; }
						selDate = i+' '+1+' 1';
						status = (currentDate.year === i) ? 2 : 1;
						row.appendChild(createCell(i,[i], status, selDate));
						i++;
					}
					fragment.appendChild(row);
				}

				calBody.appendChild(fragment);
				calView.innerHTML = start !== end ? start+' - '+end : start;
				return selected;
			},

			selectNewYearStack(dateTime=null) {
				var row, cell, selected, c, r, i, status,
					start = 0, name,
					end = yearStack.length,
					fragment = document.createDocumentFragment(), selDate;
				calBody.innerHTML='';

				if (end == 0) { return console.log('year stack not defined');}

				selected = dateTime ? new Date(dateTime) : new Date();
				selected.day = selected.getDate();
				selected.month = selected.getMonth()+1;
				selected.year = selected.getFullYear();
				calView.dataset.lastDate = selected.year+' '+selected.month+' '+selected.day+' 01:00:00';

				i = 0;
				for (r=0; r<12; r++){
					row = createRow();
					for (c=0; c<3; c++){
						if (!yearStack[i]) { break; }
						selDate = yearStack[i][0]+' '+1+' 1';
						status = (currentDate.yearStackIndex === i) ? 2 : 1;
						name = yearStack[i][0] !== yearStack[i][1] ? yearStack[i][0]+' - '+yearStack[i][1] : yearStack[i][0];
						row.appendChild(createCell(name,i, status, selDate, i));
						i++;
					}
					fragment.appendChild(row);
				}

				calBody.appendChild(fragment);
				calView.innerHTML = yearStack[0][0]+' - '+yearStack[yearStack.length-1][1];
				return selected;
			},

			selectNewEvent(date=null, events=null) {
				var	options;
				eventFormVisibility();
				calView.innerHTML = date.split(' ').join('. ')+'.';
				calView.dataset.lastDate = date;
				selEvents = events;

				options = template.option(-1, 'New');
				if (events) {
					var i = 0, len = events.length;
					for (; i<len; i++) {
						options += template.option(i, events[i].title);
					}
				} else {
					eventForm.title.value = '';
					eventForm.message.value = '';
				}
				eventForm.select.innerHTML = options;
				eventForm.list.innerHTML = template.events(events);
			}
		};

		function eventFormVisibility() {
			let access = Auth.role > 0;
			console.log(access);
			Object.keys(eventForm).forEach(e => {
				eventForm[e].style.display = (e === 'list' || access) ? 'inline-block' : 'none';
			});
		}

		function remove() {
			eventForm.list.removeEventListener("click", pickEventHandler);
			eventForm.select.removeEventListener("change", changeEventHandler);
			eventForm.save.removeEventListener("click", saveEvent);
			eventForm.remove.removeEventListener("click", deleteEvent);
			calBody.removeEventListener("click", pickDateHandler);
			calPrev.removeEventListener("click", prevHandler);
			calNext.removeEventListener("click", nextHandler);
			calView.removeEventListener("click", increaseViewMode);
			calClose.removeEventListener("click", toggleCalendar);
			if (calToggleButton){
				calToggleButton.addEventListener(calToggleButtonEvent, toggleCalendar);
			}
			console.log('remove eventlisteners from component');
		}


		init();

		return {
			dom: calendar,
			remove() {
				remove();
			}
		};
	};

	// ---------------------------------------------------------------
	// ---------------------- FormWindow Component -------------------
	// ------- Create then show & hide form window or pages ----------
	// ---------------------------------------------------------------

	function FormComponent (setup, ajax) {
		let componentKey = Object.keys(setup)[0];
		//alert(pages.current.componentData[componentKey]);
		//alert(typeof tFunc);
		//alert(JSON.stringify(setup));
		return {
			start(){
				alert(222);
			}
		}
	}

	function FormWindow (setup,ajax) {
	//	alert(typeof tFunc);
		//alert(that);
		//alert(JSON.stringify(setup));
	}

	// ---------------------------------------------------------------
	// ---------------------- Create objects -------------------------
	// ---------------------------------------------------------------

	var ajax = new Ajax();
	let middleware = new Middleware();
	let router = new Router(middleware);
	var model = new Model(middleware);
	var view = new View(middleware);
	let controller = new Controller(middleware, model, view);
	let notify = new Notify();

	router.init();

	setTimeout(()=>{
		console.log(pages.current);
	},1000);

})();

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
