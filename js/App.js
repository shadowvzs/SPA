"use strict";

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
		USER_STATUS = ['Inactive', 'Active', 'Banned', 'Deleted'],
		USER_RANK = ['Guest', 'Member', 'Moderator', 'Admin', 'Owner'],

		VALIDATOR = {
			'NUMBER': /^[0-9]+$/,
			'PHONE': /^[\+ 0-9]+$/,
			'ALPHA': /^[a-zA-Z]+$/,
			'ALPHA_NUM': /^[a-zA-Z0-9]+$/,
			'STR_AND_NUM': /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/,
			'LOW_UP_NUM': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
			'SLUG': /^[a-zA-Z0-9-_]+$/,
			'NAME': '',
			'NAME_HUN': /^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû]+)$/,
			'ADDRESS_HUN': /^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû\,\.\-]+)$/,
			'STRING': 'ESCAPE_STRING',	// it is special
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
		},
		MOUSE_BUTTON = ['left', 'middle', 'right'],
		SERVER_TIME_ZONE = 7200,
		CLIENT_TIME_ZONE = new Date().getTimezoneOffset()*60,
		ALLOWED_STATUS_DIFFERENCE = 30,	// if difference is higher then user is offline
		debug = data => (	// ajax error debug
			console.log(data.error || data)
		);

	// default auth
	let Auth = localStorage.getItem("Auth")
		? JSON.parse(localStorage.getItem("Auth"))
		: {
			hash: '',			// user session token
			role: 0,			// user rank value in front end
			name: 'Guest',
			userId: 0,
			domain: '',		// domain token
		};

	// ------------------------------------------------------
	// ---------------------- Ajax -------------------------
	// ------------------------------------------------------

	function Ajax () {

		function serialize(obj, prefix) {
			let str = [], p;
			for(p in obj) {
				if (obj.hasOwnProperty(p)) {
				  let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				  str.push((v !== null && typeof v === "object") ?
					serialize(v, k) :

					encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
			}
			return str.join("&");
		};

		function request (url, method, data={}, success, error) {
			if (typeof error != "function" || typeof success != "function") { return alert('Missing classback(s)....'); }
			if (!url) { return error('no settings for request'); }
			let type = "POST", timeout = 3000;
			const isFile = method === 'FILE',
			 	contentType = isFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
				httpRequest = new XMLHttpRequest();

			if (isFile) {
				timeout = 15000;
				data.append('hash', Auth.hash || '');
				data.append('domain', Auth.domain || '');
			} else {
				type = (!/(GET|POST|PUT|DELETE|FILE)/.test(method)) ? "GET": method,

				data.hash = Auth.hash || '';
				data.domain = Auth.domain || '';
				if ((!data || (Object.keys(data).length === 0 && data.constructor === Object))) {
					data = null;
				} else if (type === "GET") {
					url += (~url.indexOf("?") ? "&" : "?") + serialize(data);
					data = null;
				}
			}

			httpRequest.onreadystatechange = function(event) {
				if (this.readyState === 4) {
					if (this.status === 200) {
						if (!this.response) { error("no returned data"); return false; }
						let newAuth = this.response.auth,
							notifyMsg = this.response.notify;
						if (newAuth) {
							const roleChanged = Auth.role != newAuth.role;
							if (Auth.hash != newAuth.hash || roleChanged || Auth.domain != newAuth.domain) {
								Auth = { ...newAuth };
								localStorage.setItem("Auth", JSON.stringify(Auth));
								if (roleChanged) {	view.visibility(); }
							}
						}

						if (notifyMsg) { notify.add(...notifyMsg); }
						if (!this.response.success) { return error(this.response); }
						success (this.response.data || this.response);

					} else {
						error(this.status);
					}
				}
			};

			httpRequest.responseType = 'json';
			httpRequest.open(type, url, true);

			httpRequest.timeout = timeout; // time in milliseconds
			httpRequest.ontimeout = function (e) {
				let loader = document.body.querySelector('.loader.middle');
				if (loader) { loader.remove(); }
			   	notify.add("Request timeout (limit: "+(timeout/1000)+"s)", "error");
			};

			if (type !== "POST" || !data) {
				httpRequest.send();
			} else if (isFile) {
				httpRequest.send(data);
			} else {
				httpRequest.setRequestHeader('Content-Type', contentType);
				httpRequest.send(serialize(data));
			}
		}

		return {
			get(url, data=null, success=null, error=null){
				request (url, 'GET', data, success, error);
			},
			post(url, data=null, success=null, error=null){
				request (url, 'POST', data, success, error);
			},
			raw(setup, success, error){
				request (setup.url, setup.method, setup.data, success, error);
			},
			file(url, data=null, success=null, error=null) {
				request (url, 'FILE', data, success, error);
			}
		}
	}

	// ------------------------------------------------------
	// ---------------------- Router ------------------------
	// ------------------------------------------------------


	function Router(middleware) {
		let path = () => {
			let tmp_path = encodeURI(location.href).split('#'),
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
			//url: prefix/controller/view | prefix | auth group | validation for params
			//['/admin/home/:id/:name', 'admin', 1, ['NUMBER', 'SLUG']],
			['/article', false, null, false],
			['/article/add', false, 3, false],
			['/article/add/:slug', false, 3, ['SLUG']],
			['/article/:category_slug', false, null, ['SLUG']],
			['/article/view/:slug', false, null, ['SLUG']],
			['/home', false, null, false],
			['/event', false, null, false],
			['/guestbook', false, null, false],
			['/video/playlist/:id/:index', false, null, ['SLUG','SLUG']],
			['/video/playlist/:id', false, null, ['SLUG']],
			['/video', false, null, false],
			['/gallery/album/:slug/:index', false, null, ['SLUG','NUMBER']],
			['/gallery/album/:slug', false, null, ['SLUG']],
			['/gallery', false, null, false],
			['/user/login', false, null, false],
			['/user/logout', false, null, false],
			['/user/registration', false, null, false],
			['/user', false, 2, false],
			['/error/:id', false, null, ['NUMBER']],
		];

		function validateRoute(){
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
				len, i, route_url, firstChar, shiftIndex, route;

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
						data[dataKeys[i + 1 - shiftIndex]] = url_array[i];
					} else if (firstChar === ":" && route_url[i].length > 0 && i > 0) {
						// verification for dynamic params like :id
						if (Array.isArray(route[3])) {
							if (VALIDATOR[route[3][paramCount]].test(url_array[i])) {
								data.param[route_url[i].substr(1)] = url_array[i];
							} else {
								// if incorrect data with dynamic param like :id
								return redirect(NOT_FOUND_URL, 'Not Found');
							}
						}
						paramCount++;

					} else {
						// skip every checking if first param not same
						break;
					}
					if (i === len - 1 ) {
						if (!isNaN(parseInt(route[2])) && Auth.role < route[2] ) {
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
						}
						return data;
					}
				}
			}
			return redirect(NOT_FOUND_URL, 'Not Found');
		}

		function redirect(newUrl=null, title=null, obj=null) {
			if (newUrl) {
				history.pushState( null , title, BASE_ROOT+path().base_path );
				history.replaceState( null , title, BASE_ROOT+newUrl );
			}
			const data = validateRoute();
			if (data) {
				console.log('Redirecting in router: '+JSON.stringify(data));
				middleware.run("redirect", data );
			}
		}



		function eventRegistation() {
			// event handler if user click to a link
			document.addEventListener("click", e => {
			if (e.button > 0) { return console.log('it was not left click, it was '+(MOUSE_BUTTON[e.button] || 'unknow')+' button'); }
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
				// special link - components - form submit etc
				} else if (href === '*') {
					console.log('special link was detected');
					let action = (t.dataset.action || []).split('/');
					if (!action) { return console.log('Warning: data-action is empty'); }
					let actionType = action.splice(0, 1)[0],
					 		actionData = action.join('/');
					if (!t.dataset.allow) {
						e.preventDefault();
					}

					if (actionType === 'submit') {
						model.submitForm(actionData+"_Form");
					} else if (actionType === 'update') {
						// form update
					} else if (actionType === 'component') {
						let component = pages.current.component[action[0]];
						if (component) {
							component[action[1]](...action.slice(2));
						} else {
							console.log("missing component", action);
						}
					} else if (actionType === 'toggle') {
						// show/hide if click to it, you can give multiple element if you separate with ","
						let targets = action[0].indexOf(",") === -1 ? [action] : action[0].split(','), e, t;
						for (t of targets) {
							e = document.getElementById(t);
							if (!e) { continue; }
							const bool = e.style.display === "none";
							e.style.display = bool ? "block" : "none";
							if (bool) {	e.scrollIntoView(false); }
						}
					} else if (actionType === 'selectAll') {
						// i dont need array for this at moment, else i would use this again
						// targets = action.indexOf(",") === -1 ? [action] : action.split(','),
						const targets = action,
							state = t.checked,
							parentElem = document.querySelector(targets),
							targetElems = parentElem.querySelectorAll('input[type="checkbox"]');

						for (let e of targetElems) {
							e.checked = state;
						}
					}
				} else {
					console.log('normal link redirect to other page');
				}
			});

			// event handler if user click to BACK button
			window.addEventListener('popstate', event => {
				let href = location.href;
				redirect();
				// history.back();
				event.preventDefault();
				// Uncomment below line to redirect to the previous page instead.
				// window.location = document.referrer // Note: IE11 is not supporting this.
				// history.pushState(null, null, window.location.pathname);

			}, false);
		}

		if (document.readyState === 'complete') {
			eventRegistation();
		} else {
			document.onreadystatechange = () => {
			  	if (document.readyState === 'complete') {
				 	eventRegistation();
			  	}
			};
		}

		function virtualRedirect(newUrl) {
			history.pushState( null, null, location.href );
			history.replaceState( null, null, newUrl );
			console.log(newUrl);
		}

		function setUrl(urlAddon=false) {
			let newUrl = BASE_ROOT+'/';
			const r = pages.current.routeData,
				paramKeys = Object.keys(r.param || {});
			if (r.prefix) {
				newUrl += r.prefix;
			}
			newUrl += r.controller+'/'+r.action;
			if (paramKeys.length) {
				for (let key of paramKeys) {
					newUrl += '/'+r.param[key];
				}
			}
			if (urlAddon) {
				newUrl += '/'+urlAddon;
			}

			virtualRedirect(newUrl);
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
			setFullUrl(newUrl){
				virtualRedirect(newUrl);
			},
			setUrl(urlAddon=false) {
				setUrl(urlAddon);
			},
			// not dry but maybe easier to read, anyway not too much plus
			init() {
				return redirect();
			}
		}
	};


	// ------------------------------------------------------
	// ---------------------- model -------------------------
	// ------------------------------------------------------

	function Model(injectedRouter=false){
		// let store the ongoing requests in this object until we have callback
		// example: user click to home, then we send request to Home.php for data
		// and we disable request sending for same url until we get a success or error
		let activeRequest = {},
		Api = {
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
					const local = this.localData;
					if ((local.playList.length > 0) && (!d.id)) {
						return view.build([local.playList]);
					} else if (d.id && local.videoList && local.videoList[d.id] && local.videoList[d.id].length) {
						return view.build([local.videoList[d.id]]);
					}

					function youTubePlaylistHandler (data) {
						let playlist = local.playList;
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
						return view.build([playlist]);
					}




					function youTubeVideoListHandler (data){
						let i = 0, videoList = local.videoList[d.id] || [],
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
		function getFormData(form=null) {
			// select inputs in "form" element
			// store input value with key but we remove the prefix
			// form is login, then input id and name mut have "login_" prefix
			// ex. in login form <input name="login_password"> but we store "password"
			if (!form) { return console.log('form not exist') ;}
			let inputs = form.querySelectorAll('input, select, textarea'), value, rule, val_len, pattern,
			name, prefix = form.id.split('_')[0], len = prefix.length+1, param = {};

			for (let input of inputs) {
				name = input.getAttribute('name');
				if  (!name && name.length > len) { continue; }
				name = name.substr(len);
				value = input.value;
				if (input.dataset.rule) {
					val_len = value.length;
					rule = input.dataset.rule.split(',');
					// temporary for test i skip regex
					pattern = VALIDATOR[rule[0]];
					if (!pattern) { param[name] = value; continue; }
					//function escapeRegExp(string) {
					if (pattern === "ESCAPE_STRING") {
						if (input.dataset.empty && !value) { param[name] = value; continue; }
						if (val_len < rule[1] || val_len > rule[2]) {
							return input.title ? input.title : `Invalid data at ${name} field (${rule[1]}, ${rule[2]})`;
						}
						param[name] = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					} else if (!(pattern.test(value) || (input.dataset.empty && !value)) || val_len < rule[1] || val_len > rule[2]) {
						input.focus();
						return input.title ? input.title : `Invalid data at ${name} field (${rule[1]}, ${rule[2]})`;
					}
				}
				if (input.dataset.same) {
					rule = document.getElementById(input.dataset.same);
					if (!rule || value !== rule.value) {
						input.focus();
						return input.title ? input.title : name+' not same than '+rule.name+' field';
					}
				}
				param[name] = value;
			}
			return param;
		}

		// send form data to server and wait to answer
		function sendForm(form, url, nonFormData={}, handler=null){
			let formMethod = form.dataset.method,
			formAction = form.dataset.action.split('/'),
			requestKey = formAction[0]+'_'+formAction[1],
			param, data;

			// we get the input values and if not object then we make error
			param = getFormData(form);
			if (typeof param === "string") {
				return notify.add(param,'error');
			}

			// set url (default or definied)
			url = url || getModelPath(formAction[0]);

			//add additional data to form what isnt in form (optional)
			data = {
				action: formAction[1],
				param: Object.assign(param, nonFormData),
			};

			// set url, method, data for ajax
			sendRequest ({
				url: url,
				method: formMethod,
				data: data
			}, true, handler);

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
			if (str === "redirect") {
				injectedRouter.redirect(data.url);
			}
			if (str === "build" || str === "multicall") { return view[str](data); }
			let s = str.split('.');
			if (s.length !== 2) { return console.log('invalid render function string'); }
			if (!view[s[0]](s[1], data)) { return console.log('render function not exist'); }
		}

		function sendRequest(ajaxData, lock=true, handlerFunc=null){
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
				if (requestKey) { delete activeRequest[requestKey]; }
 				// to render function we give modelData array
				// if render function need more param then modelData.length = arg.length

        		if (handlerFunc) {
					handlerFunc(data);
				} else if (data.renderFunc) {
					jumpToRender(data.renderFunc, data.modelData)
				}
			}

			// handler: unlock the request and write error msg
			function errorHandler(data){
				if (requestKey) { delete activeRequest[requestKey]; }
				// if renderfunction true then content will be wiped
				if (data.data && data.data.renderFunc) {
					let loader = document.body.querySelector('.loader.middle');
					if (loader) {
						loader.outerHTML = "";
						router.redirect('/error/404');
					}
				}
			}

			// send every data with ajax
			ajax.raw( ajaxData, successHandler, errorHandler );
		}

		return {

			getPageData(controller, action, param){
				return getPageData(controller, action, param);
			},

			submitForm(str, url=null, nonFormData={}, handler=null){
				if (typeof str !== "string") { return console.log('invalid submit link'); }
				const form = document.getElementById(str);
				if (!form) { return alert('Invalid form!'); }
				return sendForm(form, url, nonFormData, handler);
			},

			getCustomData(key, param){
				if (key.length > 4 && key.substr(0, 4) === 'Api.') {
					key = key.substr(4);
					if (!Api[key] || !Api[key]['getData']) { return console.log('Api undefined ('+key+')'); }
					Api[key].getData(param);
				}
			}

		}
	};

	// -----------------------------------------------------------------
	// ------------ static data about pages in json form ---------------
	// -----------------------------------------------------------------

	const pages = {
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
			cacheTrash: null,   // dom
			cache: {},		    // chached stuff key
			component: {		// permanent components
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
				},
				modal: {
					name: 'modal',
					constructor: ModalComponent
				},
				audioPlayer: {
					name: 'audioPlayer',
					datasource: {
						get: MODEL_PATH+'Audio.php?action=get',
					},
					constructor: AudioPlayer
				},
				messageCenter: {
					name: 'messageCenter',
					condition: {
						role: 1
					},
					refresh: {
						period: 15, // in seconds
						iconPath: 'a.badge.unreaded-msg[data-count]'
					},
					datasource: {
						refresh: MODEL_PATH+'User.php?action=save_status',
						send: MODEL_PATH+'Message.php?action=send_msg',
						delete: MODEL_PATH+'Message.php?action=delete_msg',
						sent: MODEL_PATH+'Message.php?action=get_sent',
						inbox: MODEL_PATH+'Message.php?action=get_inbox',
						write: MODEL_PATH+'Message.php?action=get_users',
						view: MODEL_PATH+'Message.php?action=get_single_mail',
					},
					constructor: MessengerComponent
				}
			}
		},
		article_add: {
			render: {
				model: true,
			},
			title: 'Cikk hozzáadása',
			template: 'articleAddPage',
		},
		article_index: {
			title: 'Cikkek',
			render: {
				model: true,
			},
			template: 'articlePage',
		},
		article_view: {
			title: 'Cikkek',
			render: {
				model: true,
			},
			template: 'articleViewPage',
		},
		home_index: {
			title: 'A Gyülekezet Főoldala',
			render: {
				model: true,
			},
			template: 'homePage',
			component: {
				newsCalendar: {
					name: 'newsCalendar',
					// start with day view mod (0-3)
					viewMode: 0,
					id: 'news',
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
		user_view: {
			title: "Profil",
			render: {
				model: true,
			},
			template: 'userView',
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
			component: {
				youtubeViewer: {
					name: 'youtubeViewer',
					storeData: true,
					relationship: {
						modal: 'modal'
					},
					constructor: YoutubeViewerComponent
				}
			},
			template: 'videoList',
		},
		gallery_index: {
			title: "Albumok",
			render: {
				model: true,
			},
			template: 'albumList',
			component: {
				albumAdministration: {
					condition: {
						role: 2
					},
					workArea: '.album-box-container',
					storeData: true,
					name: 'albumAdministration',
					selectElem: '#admin_album_list',
					datasource: {
						add: MODEL_PATH+'Gallery.php?action=addAlbum',
						delete: MODEL_PATH+'Gallery.php?action=deleteAlbum',
						upload: MODEL_PATH+'Image.php?action=upload',
					},
					// these component will be connected with .action method with this component
					// ex.: pages.current.component[setup.relationship.menu].action(data);
					relationship: {
						menu: 'contextMenu',
						upload: 'fileUploader'
					},
					constructor: AlbumManager
				},
				contextMenu: {
					condition: {
						role: 2
					},
					style: {
						width: 200,
					},
					className: 'context-menu',
					name: 'contextMenu',
					relationship: 'albumAdministration',
					constructor: ContextMenu
				},
				fileUploader: {
					condition: {
						role: 2
					},
					limit: {
						size: 2048, 	// 2048 kbyte, default php upload limit
						upload: 2 		// paralel upload
 					},
					className: 'file-uploader',
					name: 'fileUploader',
					constructor: FileUploader
				}
			},
		},
		gallery_album: {
			title: "Képek",
			render: {
				model: true,
			},
			template: 'albumImageList',
			component: {
				imageViewer: {
					name: 'imageViewer',
					storeData: true,
					relationship: {
						modal: 'modal'
					},
					constructor: ImageViewerComponent
				},
				imageAdministration: {
					condition: {
						role: 2
					},
					workArea: '.image-box-container',
					name: 'imageAdministration',
					selectElem: '#admin_album_list',
					datasource: {
						add: MODEL_PATH+'Image.php?action=addImage',
						edit: MODEL_PATH+'Image.php?action=edit',
						move: MODEL_PATH+'Image.php?action=move',
						delete: MODEL_PATH+'Image.php?action=deleteImage',
						upload: MODEL_PATH+'Image.php?action=upload',
					},
					relationship: {
						viewer: 'imageViewer',
						menu: 'contextMenu',
						upload: 'fileUploader'
					},
					constructor: ImageManager
				},
				contextMenu: {
					condition: {
						role: 2
					},
					style: {
						width: 200,
					},
					className: 'context-menu',
					name: 'contextMenu',
					relationship: 'imageAdministration',
					constructor: ContextMenu
				},
				fileUploader: {
					condition: {
						role: 2
					},
					limit: {
						size: 2048, 	// 2048 kbyte, default php upload limit
						upload: 2 		// paralel upload
 					},
					className: 'file-uploader',
					name: 'fileUploader',
					constructor: FileUploader
				}
			},
		},
		event_index: {
			title: "Események",
			render: {
				model: true,
			},
			template: 'eventPage', // fix to event index
			component: {
				guestCalendar: {
					name: 'guestCalendar',
					viewMode: 0,
					range: {
						min: 2000,
						max: 2143,
					},
					id: 'guestbook',
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
					name: 'newsCalendar',
					viewMode: 0,
					range: {
						min: 2000,
						max: 2143,
					},
					id: 'news',
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
				Guestbook: {
					name: 'Guestbook',
					content: '.guestbook .index .content h1',
					form: {
						name: 'addComment',
						prefix: 'comment_',
					},
					storeData: true,
					datasource: {
							add: MODEL_PATH+'Guestbook.php?action=add',
							delete: MODEL_PATH+'Guestbook.php?action=delete',
					},
					constructor: GuestbookComponent
				}
			}
		},
		error_index: {
			title: 'Hiba, az oldal leállt!',
			template: 'errorMsg',
		},
	};

	// ------------------------------------------------------
	// ---------------------- View -------------------------
	// ------------------------------------------------------


	function View () {

		const rFunc = {
			preloadImage(cacheKey, pathKey = 'path'){
				let global = pages.global,
					cacheTrash = global.cacheTrash,
					cache = global.cache,
					data, path, images = "", timer;
				if (cache[cacheKey] || !cacheTrash) { return console.log('the image group was already cached'); }

				//but now we want async preload
				timer = setTimeout(() => {
					const imageList = pages.current.data[0][2];
					for (data of imageList) {
						path = data[pathKey];
						if (!path) { continue; }
						images += `<img src='${THUMBNAIL_PATH+path}'>`;
						images += `<img src='${GALLERY_PATH+path}'>`;
					}
					console.log('preloaded: '+imageList.length+' image');
					cacheTrash.innerHTML = images;
				}, 1);
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
		},
		globalComponent = pages.global.component,
		gcKeys = Object.keys(globalComponent); 		// global component keys


		const tFunc = {
			audioPlayer(setup) {
				return `<div id="audioPlayer">
						<div class="header not_selectable">
							${setup.title}
							<div class="close"><a href="*" data-action="toggle/audioPlayer">&times;</a></div>
						</div>
						<div class="details not_selectable">
							<div class="title"> Select something</div>
							<div class="track-timer">
								<span class="currentTime"> 00:00 </span> / <span class="duration"> 00:00 </span>
							</div>
							<input class="track" type="range" min="0" max="0"><br>

							<div class="volume_row">
								<span class="loop_icon" href="*" data-action="component/${setup.name}/button/loopButton" title="If audio reach to the end then jump to next audio file">&infin;</span>
								<span class="anchor_icon" href="*" data-action="component/${setup.name}/button/anchorButton" title="If loop is on then same audio will be played after it is ended">&#9875;</span>
								<span class="random_icon" href="*" data-action="component/${setup.name}/button/randomButton" title="Next audio will be random">&#x2608;</span>
								<span class="spacer"></span>
								<span class="speaker_icon" title="Change audio volume">&#128266;</span>
								<span class="volume_bar">
									<div class="volume_dir">-</div>
									<input class="volume" type="range" min="0" max="100">
									<div class="volume_dir">+</div>
								</span>
							</div>
							<center>
								<div href="*" data-action="component/${setup.name}/button/playButton" class="button play">&#9205;</div>
								<div href="*" data-action="component/${setup.name}/button/pauseButton" class="button pause">&#9208;</div>
								<div href="*" data-action="component/${setup.name}/button/stopButton" class="button stop">&#9209;</div>
							</center>
						</div>
						<div class="container">
							<div class="list content"></div>
							<input type="range" class="scrollBar" value="0" min="0" max="100">
						</div>
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
				let str = "";
				d.forEach(e => {
					str += `<div class="video-box">
								<a href="*" data-action="component/youtubeViewer/show/${e.id}" title="${e.title} playlist">
									<img src="${e.img}" alt="${e.title} cover">
									<p><b>${e.title}</b></p>
							</a></div>`;
				});
				return 	`<div class="video-box-container">${str}</div>`;
			},
			albumCreate(e, chckbx=null) {
				if (chckbx == null) {
					chckbx = Auth.role > 2 ? "<input type='checkbox' name='albums[]'>" : '';
				}
				return `<div class='album-box' id='album_${e.id}' data-id="${e.id}" data-context="true">
						${chckbx}
						<a href='/gallery/album/${e.slug}' title='${e.title} album: ${e.description}'>
							<img src='${THUMBNAIL_PATH+(e.coverImage || "empty.png")}' alt='${e.title}'>
							<p><span class="title">${e.title}</span>(${e.created})</p>
						</a>
					</div>`;
			},

			albumList(d,c) {
				let str = "";
				const chckbx = Auth.role > 2 ? "<input type='checkbox' name='albums[]'>" : '';
				d.forEach(e => {
					if (e.status == 1 || chckbx) {
						str += tFunc.albumCreate(e, chckbx);
					}
				});
				return `<div class="album-box-container">${str}</div>`;
			},
			albumImageCreate(i, chckbx=null) {
				if (chckbx == null) {
					chckbx = Auth.role > 2 ? "<input type='checkbox' name='albums[]'>" : '';
				}
				return `<div class='image-box' id='image_${i.id}' data-id="${i.id}" data-context="true">
						${chckbx}
						<a href='*' data-action="component/imageViewer/show/${i.index}" title='${i.description}'>
							<img src='${THUMBNAIL_PATH+i.path}' alt='${i.description}'>
						</a>
					</div>`;
			},
			albumImageList(data) {
				const chckbx = Auth.role > 2 ? "<input type='checkbox' name='images[]'>" : '';
				let [selAlbum, albumList, imageList] = data, albums = "", images = "";
				albumList.forEach(a => {
					albums += `<li><a href='/gallery/album/${a.slug}' title='${a.title}'>${a.title}</a></li>`;
				});
				imageList.forEach(i => {
					images += tFunc.albumImageCreate(i, chckbx);
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
			adminSidePanelBone(data=['','']) {
				return `<div id="${data[0]}" class="adminSideComponent">
							<label for="adminSideCheckbox">
							<div class="toggleButton">
								<div>Admin</div>
							</div>
							</label>
							<input type="file" multiple accept="image/.jpeg,.jpg" data-hide="true">
							<input type="checkbox" id="adminSideCheckbox" data-hide="true">
							<div class="wrapper">
							<div class="content">
								${data[1]}
							</div>
							</div>
						</div>`;
			},
			errorMsg(d) { return `<b>Error ${d.id}:</b> ${ERROR_MSG[d.id]}`; },
			loginForm() { return	`<div class="modal-layer chrr_trnspnt_bg"></div>
						<div class="modal-layer lght_blck_trnspnt_bg"></div>
						<div class="form_window" id="login_Form" data-method="POST" data-action="user/login">
							<h1>Bejelentkezés</h1><br>
							<input id="login_email" name="login_email" type="text" placeholder="Email cím" title="Kérem adjon meg egy valós email címet" data-rule="EMAIL,5,50">
							<input id="login_password" name="login_password" type="password" placeholder="Jelszó" title="Kérem adjon meg egy jelszót, az angol ABC betűit és/-vagy számok felhasználasával" data-rule="ALPHA_NUM,6,32"><br>
							<a href="*" data-action="submit/login"><button class="button col-gray"> Bejelentkezés </button></a>
							<a href="/user/registration"><button class="button col-gray"> Regisztrálás </button></a>
							<br><br>
							<a href="/home"><button class="button col-gray"> Vissza </button></a>
						</div>`; },
						//<a href="#" class="disabled underlined">Elfelejtette a jelszavat?</a>
			signupForm() { return	`<div class="modal-layer brwn_trnspnt_bg"></div>
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
			userView(d, a) {
				let table='', pagination= '';
				return `<div class="userView"><h1>Felhasználók</h1>
								${d}
								</div>`;
			},
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
			scheduleBox(data) {
				let str = "<h1>Program</h1>",
					inputs = `<div id="scheduleEdit_Form" data-method="POST" data-action="schedule/edit">`,
					edit = Auth.role > 2 ? `<a href="*" data-action="toggle/schedule_view_div,schedule_edit_div" class="btn type-4 edit">⚙</a>` : ``,
					editDiv = "",
					ids = [];

				for (let schedule of data) {
					str += `<div class="schedule"><h2>${schedule.event_name}</h2><p>${schedule.event_at}</p></div>`;
					inputs += `<input id="scheduleEdit_event_name" name="scheduleEdit_event_name_${schedule.id}" value="${schedule.event_name}" type="text" placeholder="Megnevezés" title="A megnevezés hossza 3 és 100 karakter között kell lennie" data-rule="STRING,3,100">
						<input id="scheduleEdit_event_at" name="scheduleEdit_event_at_${schedule.id}" value="${schedule.event_at}" type="text" placeholder="Megnevezés" title="A megnevezés hossza 3 és 100 karakter között kell lennie" data-rule="STRING,3,100">`;
					ids.push(schedule.id);
				}

				inputs += `<input id="scheduleEdit_id" name="scheduleEdit_ids" value="${ids.join(',')}" type="text" data-rule="STRING,0,11" class="hide">
				<br><br><a href="*" data-action="submit/scheduleEdit" title="Mentés" class="btn type-3"> Ment </a></div>`;
				if (Auth.role > 2) { editDiv = `<div class="edit_box text-center" style="display: none;" id="schedule_edit_div"><h3>Változtatás!</h3><br> ${inputs} </div>`; }
				return `<div class="scheduleBox">${edit}
						<div class="content">
							<div id="schedule_view_div"> ${str}<br><br><br><h3>Mindenkit szeretettel várunk!</h3></div>
							${editDiv}
						</div></div>`;
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
				str += '<div class="calendarIcon"><a href="*" data-action="toggle/cal_guestbook"><div class="calendar-icon icon-48"></div></a></div>';
				return '<div class="guestBox"><div class="content">'+str+'</div></div>';
			},
			userCreateRow(data="") {
				if (data == "") { return; }
				const [u, componentName] = data,
					msgLink = Auth.userId != u.id ? `<a href="*" data-action="component/messageCenter/userTarget/${u.id}"><div class="mini-icon pm-icon focusable-icon"></div></a>` : '';
				return `<tr href="*" data-action="component/${componentName}/select/${u.id}" data-id="${u.id}">
					<td data-field="name">${u.name}</td>
					<td data-field="rank" class="hide-phone">${USER_RANK[u.rank] || 'Unknown'}</td>
					<td data-field="status">${USER_STATUS[u.status] || 'Unknown'}</td>
					<td data-field="phone" class="hide-phone">${u.updated || u.created}</td>
					<td data-field="tools">${msgLink}</td>
					</tr>`;
			},
			usersPage(data) {
				return `<main>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th class="hide-phone">Rank</th>
								<th>Status</th>
								<th class="hide-phone"> Last login</th>
								<th></th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</main>`;
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
			articleAddPage(data) {
				const { categories, article = {title: "", id: 0, category_slug: "", content: ""} } = data,
					cat_slugs = Object.keys(categories), maxRank = USER_RANK.length,
					title = article.title.length ? "Cikk szerkesztés" : 'Cikk hozzáadása';
				let catOpts = "", rankOpts = "";
				document.title = title;
				for (let slug of cat_slugs) {
					catOpts += `<option value="${slug}" ${slug == article.category_slug ? "selected" : ""}>${categories[slug]}</option>`;
				}
				for (let i=0;i<maxRank;i++ ) {
					rankOpts += `<option value="${i}" ${i == article.rank ? "selected" : ""}>${USER_RANK[i]}</option>`;
				}
				return `<div class="form_content" id="articleAdd_Form" data-method="POST" data-action="article/add">
							<h1>${title}</h1><br>
							<input id="articleAdd_id" class="hide" name="articleAdd_id" value="${article.id}" type="number" title="Wrong id" data-rule="INTEGER,0,11">
							<div class="wrapper">
								<select id="articleAdd_category_slug" name="articleAdd_category_slug">${catOpts}</select>
								<select id="articleAdd_rank" name="articleAdd_rank">${rankOpts}</select>
								<input id="articleAdd_title" name="articleAdd_title" value="${article.title}" type="text" placeholder="Teljes név" title="A cím hossza 3 és 100 karakter között kell lennie" data-rule="STRING,3,100">
							</div>
							<textarea id="articleAdd_content" name="articleAdd_content" placeholder="Szöveg" title="A szöveg hossza 5 és 65535 karakter között kell lennie" data-rule="STRING,5,65535">${article.content}</textarea>
							<a href="*" data-action="submit/articleAdd" class="btn type-3" title="Cikk lementése"> Elment </a>
						</div>`;
			},
			articleViewPage (data) {
				const article = data.article,
					toolbar = Auth.role > 2 ? `<div class="tools text-right">
						<div class="form_content" id="articleDel_Form" data-method="POST" data-action="article/delete" class="hide">
							<input id="articleDel_id" name="articleDel_id" value="${article.id}" type="hidden" data-rule="INTEGER,0,11" class="hide">
						</div>
						<a href="/article/add/${article.slug}" class="btn type-3">⚙</a>
						<a href="*" data-action="submit/articleDel" class="btn type-2">&times;</a>
					</div>` : ``;
				if (!article) {
					return `<div class="content"><div class="no_article">... nem található ez a cikk ...</div></div>`;
				}
				setTimeout( () => document.title = 'Cikk: '+article.title, 100);

				return `${toolbar}
					<div class="title">${article.title}</div>
					<div class="content">${article.content}</div>`;
			},
			articlePage (data) {
				const {categories, selected, articles} = data,
					addButton = Auth.role > 2 ? `<a href="/article/add" class="add-link"><div class="menu-icon add-icon"></div></a>` : ``;
				setTimeout( () => document.title = 'Cikkek: '+categories[selected], 100);
				let catList = "", artList = "", slugs = Object.keys(categories);
				for (let slug of slugs) {
					if (slug == selected) { continue; }
					catList += `<a href="/article/${slug}" title="Kiválaszt: ${categories[slug]}">${categories[slug]}</a>`;
				}

				if (articles.length) {
					for (let article of articles) {
						artList += `<a href="/article/view/${article.slug}">${article.title}</a>`;
					}
				} else {
					artList = `<div class="no_article">... nem található egy cikk sem ...</div>`;
				}

				return `
					<input type="checkbox" id="article_toggle">
					<label for="article_toggle"><a title="${categories[selected]}">${categories[selected]}${catList}</a></label>
					${addButton}
				<div class="content"><div>${artList}</div></div>`;
			},
			guestbookComment( {id, name, created, message, userId} = data ) {
				let condition =  (Auth.role > 1 || (userId == Auth.userId) && userId != 0),
					del = (id, type) => condition ? `<span class="${type}"><a href="*" data-action="component/Guestbook/delete/${id}">&times;</a></span>` : '',
					edit = (id, type, userId) => condition ? `<span class="${type}"><a href="*" data-action="component/Guestbook/fill/${id}">&#9881;</a></span>` : '';
				return `<div class="comment" id="comment_${id}">
							<span class="name">${name}</span> <span class="time">${created}</span>${del(id, 'delete')+edit(id, 'edit', userId)}
							<div class="message">${message}</div>
						</div>`;
			},
			guestbook (data) {
					let str = data.length === 0 ? `<h2>Nincs bejegyzés</h2>` : ``, comment,
						addLink = "<h1 class='title'><a href='*' data-action='component/Guestbook/newComment' title='Új hozzászólás írása'> Új hozzászólás </a></h1>",
						form = `<div id="addComment_Form" data-method="POST" data-action="guestbook/add">
						<div class="modal-layer sm_blck_trnspnt_bg"></div>
						<div class="form_window sm_blck_trnspnt_bg">
						<h1>Új hozzászólás</h1><br>
						<input type="text" placeholder="Nev" id="addComment_name" name="addComment_name" data-rule="NAME_HUN,5,50">
						<input type="text" placeholder="email cim" id="addComment_email" name="addComment_email" data-rule="EMAIL,5,50">
						<input type="hidden" id="addComment_id" name="addComment_id" data-rule="NUMBER,0,11">
						<textarea placeholder="Uzenet" id="addComment_message" name="addComment_message" data-rule="STRING,0,5000"></textarea>
						<br><br>
						<a href="*" data-action="component/Guestbook/add"><button class="button col-gray reg"> Rendben </button></a>
						<a href="*" data-action="toggle/addComment_Form"><button class="button col-gray reg"> Megse </button></a>
						</div>
						</div>`;
					for (comment of data) {
						str += this.guestbookComment(comment);
					}
				 return "<div class='content'>"+addLink+form+str+"</div>";
			},
			getFullname(first, last) { return `${first} ${last}`; },
			audioTableRow(d) {
				let str = '', a;
				for (a of d) {
					str += `<tr class="audio_id_${a.id}">
										<td>${a.title}</td>
										<td>${a.duration}</td>
										<td>remove/edit</td>
									</tr>`;
				}
				return str;
			},
			audioList(d) {
				return `<div class="audioList"><h1>Dicséretek</h1>
								<table>${this.audioTableRow(d)}</table>
								</div>`;
			},
			pageContainer(cntrllr, ctn, tmplt) { return `<div class="${cntrllr}"><div class="${ctn} fadeOut">${tmplt}</div></div>`; },
		};

		function refreshDOMVisibility() {
			let group = [
				['.guest_only', Auth.role === 0],
				['.logged_only', Auth.role > 0],
				['.member_only', Auth.role > 1],
				['.moderator_only', Auth.role > 2],
				['.admin_only', Auth.role > 3],
			], visibility;
			refreshGlobalComponents();
			for (visibility of group){
				applyVisibility(...visibility);
			}
		};

		function applyVisibility(key, visible=false){
			let elements = document.body.querySelectorAll(key), e,
					action = visible ? 'remove' : 'add';
			for (e of elements) {
				if (e.classList.contains('hidden') === visible){
					e.classList[action]("hidden");
				}
			}
		}

		(function() {
			// i use these links in page what not part of content (header or menu)
			// link, title text, icon path, label, auth placeholder, data-action
			let menu = [
				["/home","Vissza a főoldalra","home","Főoldal",'',0],
				["/event","Események megtekintése","events","Naptár",'',0],
				["/video","Videók megtekintése","videos","Videók",'',0],
				["/gallery","Kép galéria megtekintése","albums","Képek",'',0],
				["*","Dicséretek halgatása","worship","Énekek",'toggle/audioPlayer',2],
				["*","Dicséretek halgatása","worship","Énekek",'toggle/audioPlayer',1],
				["http://biblia.gyozelem.ro","Ugrás az Online Biblia oldalra","bible","Biblia",'',0],
				["/guestbook","Üzenőfal megtekintése","wall","Üzenőfal",'',0],
				["/article","Cikkek megtekintése","articles","Cikkek",'',0],
				["/user","Felhasználók megtekintése","users","Felhasználók",'',1],
				["*","Üzenetek megtekintése","messages",null,'component/messageCenter/toggle',1],
				["*","Beállítások megtekintése","settings",null,'component/settingsManager/toggle',1],
				["/user/logout","Kijelentkezés","logout",null,'',1],
				["/user/login","Bejelentkezés","login",null,'',2],
			],
			shrtTmplt = {
				link(d) {
					const msgAttr = d[2] === "messages" ? 'class="badge unreaded-msg" data-count="0"' : '';
					return `<a href="${d[0]}" title="${d[1]}" data-action="${d[4]}" ${msgAttr}>`;
				},
				icon(d) { return `<div class="menu-icon ${d[2]}-icon"></div>`; }
			},
			templates = {
				normal: {
					parent: ["page-menu"],
					selector: [0],
					template (d) { return `${shrtTmplt.link(d)} <span class="menuButton">${shrtTmplt.icon(d)} <span class="buttonName"> ${d[3]} </span></span></a>`; },
				},
				normal_log: {
					parent: [null, "page-logged", "page-login"],
					selector: [1, 2],
					template (d) { return `${shrtTmplt.link(d)} ${shrtTmplt.icon(d)} </a>`; },
				},
				burger: {
					parent: ["burger-menu", "burger-logged", "burger-login"],
					selector: [ 0, 1, 2 ],
					template (d) { return `${shrtTmplt.link(d)} <span class="menuButton"> ${shrtTmplt.icon(d)}</span></a>`; },
				},
			}, n, attrLen, haystack,
			childDOM, selector, parentDOM, parentID, i,
			dataLen = menu.length, newDOM = {},
			dom = document.querySelector('#App'), pageBone = dom.innerHTML;

			// creating and storeing new dom elements (string form)
			Object.keys(templates).forEach( e => {
				for ( n=0; n<dataLen; n++) {
					selector = templates[e].selector[menu[n][5]];
					parentID = templates[e].parent[menu[n][5]];
					if (!parentID) { continue; };
					attrLen = menu[n].length > 0 ? menu[0].length-1 : 0;
					//childDOM = templates[e].template;
					childDOM = templates[e].template(menu[n]);
					// old version with string replace
					//for (i=0; i<attrLen; i++){
					//	childDOM = childDOM.replace("{{"+i+"}}", menu[n][i]);
					//	}
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

		function refreshGlobalComponents() {
			// need add if not added and remove if added but no condition
			const component = pages.global.component;
			if (component && typeof component == "object" && component != null ) {
				const keys = Object.keys(component),
					currentComp = pages.current.component || {},
					cKeys = Object.keys(currentComp);

				if (!cKeys.length) { pages.current.component = {}; }
				let condition, c, action = "add", allow, exist;
				for (let key of keys) {
					condition = component[key].condition;
					exist = cKeys.indexOf(key) !== -1;
					if (condition) {
						allow = false;
						if (condition.role) {
							allow = Auth.role >= condition.role;

						}
						if (allow && !exist) {
							action = "add";
						} else if (!allow && exist && currentComp[key].remove) {
							action = "remove";
						} else {
							continue;
						}
					} else {
						if (exist) { continue; }
						action = "add";
					}
					if (action == "add") {
						pages.current.component[key] = 'soon ready';
						setTimeout(() => {
							c = component[key];
							pages.current.component[key] = new c['constructor'](c, ajax);
						}, 300);
					} else {
						currentComp[key].remove();
						delete pages.current.component[key];
						delete pages.current.componentData[key];
					}
				}
			}
		}

		function build(data = null) {
			let current = pages.current,
				{ controller, action, param } = current.routeData,
				pageData = pages[controller+'_'+action],
				bone, dom;
			data = data || [param];
			bone = tFunc.pageContainer(controller, action, tFunc[pageData.template](...data));
			pages.global.pageContent.innerHTML = bone || '';
			dom = pages.global.pageContent.querySelector('.page .'+controller+' .'+action) || null;
			// replace the current page data
				current = Object.assign(current, {
				title: pageData.title,
				bone,
				data,
				dom
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
				const pageComponent = pageData.component;
				let component;

				if (!current.component) { current.component = {}; }

				Object.keys(pageComponent).forEach(key => {
					if (current.component[key]) {
						if (current.component[key].hasOwnProperty('reload')) {
							current.component[key].reload();
						}
						return;
					}
					setTimeout(() => {
						component = pageComponent[key];
						if (component.condition) {
							const condition = component.condition;
							if (condition.role) {
								if (Auth.role < condition.role) {
									return console.log('Component '+key+' need higher permission!');
								}
							}
						}
						current.componentData[key] = component.storeData ? data[0] : {};
						current.component[key] = new component['constructor'](component, ajax);
					}, 0);
				});
			}
		}

		function terminate() {
			let {dom, bone, title, data, component, componentData} = pages.current;
			// remove listeners, timers if exist but still we not have
			if (dom && dom.dataset.modal) {
				pages.global.body.classList.remove("overflow-hidden");
			}
			if (component) {
				// check the current components
				// compare if they are global component or page specific component and remove it
				//if it is global then we check the condition still fullfilled or no
				Object.keys(component).forEach(e => {
					if (gcKeys.indexOf(e) > -1 || !component[e].remove) {
						return;
					}
					component[e].remove();
					delete pages.current.component[e];
					delete pages.current.componentData[e];
				});
			}
			// remove the page content
			dom.innerHTML = "";
			// a bigger cleanup
			const cpData = Object.keys(pages.current);
			for (let key of cpData) {
				if (key != "component" && key != "componentData") {
					delete pages.current[key];
				}
			}
		}

		return {
			getContent (template, data) {
				return tFunc[template](data);
			},
			render(func, data){
				if (!rFunc[func](...data)) { return console.log('multicall error: '+func+' not exist');}
			},
			multicall(data) {
				let renderFunc, s;
				data.forEach(e => {
					renderFunc = e.pop();
					if (renderFunc === "build") {
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
			visibility() {
				refreshDOMVisibility();
			},
			terminate() {
				terminate();
			}
		}
	};

	// -----------------------------------------------------------
	// ---------------------- controller -------------------------
	// -----------------------------------------------------------


	function Controller(middleware){
		let global = pages.global;
		global.body = document.querySelector('body');
		global.pageContent = global.body.querySelector('.content.page');
		global.cacheTrash = document.querySelector('.cacheTrash');


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
			}
		}
		run (label, data) {
			if (typeof label === "string" && typeof this.handler[label] ==="function") {
				this.handler[label](data);
			}
		}
		remove (label){
			if (typeof label === "string" && this.handler[label]) {
				delete this.handler[label];
			}
		}
	}



	// ----------------------------------------------------------
	// ----------------------- Notify ---------------------------
	// ----------------------------------------------------------

	function Notify() {
		const BOX_CLASS = "notify",
			CONTAINER_CLASS = "notify-container",
			CONTAINER_ID = "notifyContainer",
			NOTIFY_WIDTH = 300,
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
			notifyCloseHandler = function() {
				close(this.parentElement.id);
			};
		let notifyList = {},
			container = document.getElementById(CONTAINER_ID),
			lastId = 0;

		function createContainer() {
			container = document.createElement("div");
			container.className = CONTAINER_CLASS;
			container.id = CONTAINER_ID;
			document.body.appendChild(container);
		}

		// Types: 'error', 'success', 'notice', 'warning', 'normal'
		function newNotify (message, type="normal", NOTIFY_DURATION=5) {
			const id = 'notification_' + lastId;
			if(!container) {
				 createContainer();
			}

			const newNotify = document.createElement("div"),
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
			const notify = notifyList[id].dom;
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


	function Calendar(settings={range:{}}, req) {
		let calendar, calId, calBody, calHeader, selDate, currentDate, calPrev, calNext, calView, selected, render,
		yearStack = [], yearStackIndex, callback, eventData, selEvents, dateKey,
		dayShort = ['Mon', 'Tue', 'Wed', 'Tue', 'Fri', 'Sat', 'Sun'], eventForm, datasource,
		viewMode, calMode = ['Day', 'Month', 'Year', 'YearStack', 'reserved', 'Event'],
		monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		function nextButton() {
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

		function setYearStackIndex(year) {
			if (!year && year !== 0) { yearStackIndex = currentDate.yearStackIndex; }
			let i = 0, max = yearStack.length;
			for (; i<max; i++) {
				if (yearStack[i][0] > year) { break; }
				yearStackIndex = i;
			}
		}

		function prevButton() {
			if (viewMode === 0) {
				selDate.string = selDate.month === 1 ? `${selDate.year-1} 12 2 01:00:00` : `${selDate.year} ${selDate.month-1} 02 01:00:00`;
			} else if (viewMode === 1) {
				selDate.string = `${selDate.year-1} 1 2 01:00:00`;
			} else if (viewMode === 2) {
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

		function saveButton() {
			let title = eventForm.title.value.trim(),
				message = eventForm.message.value.trim(),
				date = calView.dataset.lastDate,
				time = validateTime(eventForm.time.value),
				mysqlDate = getDateArray(date).join('-')+' '+time+':00',
				index = parseInt(eventForm.select.value, 10),
				newEvent = {
					id: (index > -1 && selEvents[index] ) ? selEvents[index].id : -1,
					title: title,
					message: message,
					[dateKey]: mysqlDate,
				};
			if (!title || !message || !time) { return alert('Please fill the fields!');}
			// save to database
			// we add only in callback
			req.post(
				datasource.add,
				{ param: newEvent },
				data => {
					if (index > -1) {
						selEvents[index].title = newEvent.title;
						selEvents[index].message = newEvent.message;
					} else {
						newEvent = {...newEvent, ...data.modelData};
						addEvents({
							list: [newEvent],
							key: dateKey
						});
					}
					changeViewMode(0, date);
				},
				debug
			);
		}

		function deleteButton() {
			let index = parseInt(eventForm.select.value, 10),
				date = calView.dataset.lastDate,
				dateArray = getDateArray(date),
				obj = eventData;
			if (index == -1 || !selEvents[index] ) { return alert('Select an existing event what you want remove'); }
			// need ajax remove and we do this in callback


			req.get(
				datasource.delete,
				{ param: {id: selEvents[index].id } },
				data => {
					for (let key of dateArray) {
						key = parseInt(key, 10);
						if (!obj[key]) { return console.log('date not exist'); }
						obj = obj[key];
						obj.count--;
					}

					obj.list.splice(index, 1);
					changeViewMode(0, date);
				},
				debug
			);
		}

		function getEvents(date) {
			let dateArr = getDateArray(date), obj = eventData;
			for (let key of dateArr) {
				key = parseInt(key, 10);
				if (obj[key]) {
					obj = obj[key];
				} else {
					return console.log('no event at: '+date);
				}
			}
			return obj.list;
		}

		function pickDateHandler(e) {
			const t = e.target, tDate = t.dataset.date;
			if (!tDate) { return; }

			if (viewMode > 0) {
				decreaseViewMode(tDate, e.target.dataset.yearStack);
			} else {
				selected = new Date(tDate);
				changeViewMode (5, tDate, getEvents(tDate));
			}
		}

		function pickEventHandler(e) {
			const eIndex = parseInt(e.target.dataset.event, 10);
			if (selEvents[eIndex]) {
				eventForm.select.selectedIndex = eIndex+1;
				eventForm.title.value = selEvents[eIndex].title;
				eventForm.message.value = selEvents[eIndex].message;
			}
		}

		function changeEventHandler() {
			const index = eventForm.select.value;
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
		}

		function increaseViewButton() {
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
			let depth = 3, obj, date_key,
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

		let template = {
			window(id) { return '<div class="ev-cal" id="cal_'+id+'" style="display:none;"></div>'; } ,
			content: `<div class="head"><div>
				<a class="prev-index" href="*" data-action="component/${settings.name}/prevButton">&#8249;</a>
				<p class="view-mode" href="*" data-action="component/${settings.name}/increaseViewButton"></p>
				<a class="next-index" href="*" data-action="component/${settings.name}/nextButton">&#8250;</a>
				<a class="close" href="*" data-action="toggle/cal_${settings.id}">&times;</a></div></div>
				</div></div><div class="body"></div>`,
			cell(str) { return "<div class='cell'>"+str+"</div>"; },
			subHead(days) {
				let str = "";
				for (let day of days) {
						str += "<div class='cell'>"+day+"</div>";
				}
				return "<div class='subHead'><div class='row'>"+str+"</div></div>";
			},
			events(list) {
				if (!list || list.length < 1) {
					return '<br>No event on this date';
				}
				let str = "";
				list.forEach( (e, i) => {
					str += "<div class='bubble'><h3 data-event="+i+">"+e.title+"</h3><p data-event="+i+">"+e.message+"</p><time>"+e[dateKey]+"</time></div>";
				});
				return str;
			},
			option(value, text) {
				return '<option value="'+value+'">'+text+'</option>';
			},
			newEventForm: `<div class="newEventForm">
				<input type="text" placeholder="Event title" class="title">
				<textarea placeholder="Event description" class="message"></textarea>
				<select></select>
				<input type="text" class="time" placeholder="Time hh:mm" value="08:00">
				<button href="*" class="save" data-action="component/${settings.name}/saveButton">Save</button>
				<button href="*" class="remove" data-action="component/${settings.name}/deleteButton">Delete</button>
				<div class="eventList"></div>
				</div>`

		}

		function loadData(datasource){
			req.get(datasource.get, {}, data => {
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
			let now = new Date(), c, i, yearStackMin, yearStackMax,
				max, show = settings.show, eventDiv, calId = settings.id;
			if (show) {
				let place = show.place ? show.place : 'footer';
				document.body.querySelector(place)
					.insertAdjacentHTML('afterend', template.window(calId));
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
			calView = calHeader.querySelector('.view-mode');
			calBody = calendar.querySelector('.body');
			calBody.addEventListener("click", pickDateHandler);
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
			datasource = settings.datasource;

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
		}

		function createCell (day, dateArr, status, date="", newYearStack=false){
			let div = document.createElement('div'),
				className = ['inactive', null, 'selected'],
				classArr = ['cell'];
			div.dataset.date = date;
			if (newYearStack!==false) { div.dataset.yearStack = newYearStack; }

			if (className[status]) {classArr.push(className[status]); }

			if (currentDate.string === date) {
				classArr.push('today');
			}
			if ( eventData && (dateArr || dateArr === 0)) {
				if (typeof dateArr === "object") {
					let i = 0, obj = eventData;
					for (let key of dateArr) {
						if (!obj[key]) { obj=null;break; }
						obj = obj[key];
					}
					if (obj && obj.count && obj.count > 0) {
						div.dataset.counter = obj.count;
					}
				} else if (typeof dateArr === "number") {
					let stack = yearStack[dateArr];
					if (stack) {
						let count = 0, start = stack[0], end = stack[1],
							i = start;
						for (; i<=end; i++) {

							if (eventData[i] && eventData[i].count) {
								count += eventData[i].count;
							}
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
			const div = document.createElement('div');
			div.classList.add('row');
			return div;
		}

		render = {
			selectNewDay (dateTime=null) {
				let row, cell, selected, c, r, maxRow = 6, status = 0,
					fragment = document.createDocumentFragment(), selDate, iDay, iMonth, iYear, prev, next;
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
				let row, cell, selected, c, r, i = 0, status, year,
					fragment = document.createDocumentFragment(), selDate;

				calBody.innerHTML='';
				selected = dateTime ? new Date(dateTime) : new Date();
				selected.day = selected.getDate();
				selected.month = selected.getMonth()+1;
				selected.year = selected.getFullYear();
				year = selected.year;
				calView.dataset.lastDate = year+' '+selected.month+' '+selected.day+' 01:00:00';
				setYearStackIndex(year);

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
				let row, cell, selected, c, r, i = 0, status, year,
					selYearStack = index || currentDate.yearStackIndex,
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
				let row, cell, selected, c, r, i, status,
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
						row.appendChild(createCell(name, i, status, selDate, i));
						i++;
					}
					fragment.appendChild(row);
				}

				calBody.appendChild(fragment);
				calView.innerHTML = yearStack[0][0]+' - '+yearStack[yearStack.length-1][1];
				return selected;
			},

			selectNewEvent(date=null, events=null) {
				let	options;
				eventFormVisibility();
				calView.innerHTML = date.split(' ').join('. ')+'.';
				calView.dataset.lastDate = date;
				selEvents = events;

				options = template.option(-1, 'New');
				if (events) {
					let i = 0, len = events.length;
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
			Object.keys(eventForm).forEach(e => {
				eventForm[e].style.display = (e === 'list' || access) ? 'inline-block' : 'none';
			});
		}

		function remove() {
			eventForm.list.removeEventListener("click", pickEventHandler);
			eventForm.select.removeEventListener("change", changeEventHandler);
			calBody.removeEventListener("click", pickDateHandler);
		}

		init();

		return {
			nextButton() {
				nextButton();
			},
			prevButton() {
				prevButton();
			},
			deleteButton() {
				deleteButton();
			},
			saveButton() {
				saveButton()
			},
			increaseViewButton() {
				increaseViewButton();
			},
			dom: calendar,
			remove() {
				remove();
			}
		};
	};

	// ---------------------------------------------------------------
	// ---------------------- Guestbook Component --------------------
	// ------- Client side handler for guestbook crud actions --------
	// ---------------------------------------------------------------

	function GuestbookComponent (setup, req) {
		const componentKey = setup.name,
			formPrefix = setup.form.name,
			formName = formPrefix+'_Form',
			content = document.querySelector(setup.content),
			form = document.getElementById(formName);

			function deleteData(id) {
				req.post(
					setup.datasource.delete,
					{ param: {id:id} },
					data => {
						if (data.modelData.deleted) {
							const component = pages.current.componentData[componentKey];
							document.getElementById(setup.form.prefix+id).outerHTML = "";
							for (let [index, record] of component.entries()) {
								if (record.id === id) {
									component.splice(index, 1);
									notify.add('Hozzászólás törölve', 'success')
								}
							}
						}
					},
					debug
				);
			}

			function addSuccess(data) {
				let comments = data.modelData, comment, dom,
					componentData = pages.current.componentData[componentKey];

				for (comment of comments) {
					dom = document.getElementById(setup.form.prefix+comment.id);
					if (!dom) {
						componentData.push(comment);
						content.insertAdjacentHTML('afterend', view.getContent ('guestbookComment', comment));
					} else {
						componentData.forEach( (e, index) => {
							if (e.id == comment.id) {
								componentData[index] = comment;
							}
						});
						dom.outerHTML = view.getContent ('guestbookComment', comment);
					}
					form.style.display = 'none';
				}
			}

			function add() {
				model.submitForm(formName, setup.datasource.add, {user_id: Auth.userId}, addSuccess);
			}

			function setContent(data) {
				let fields = Object.keys(data), dom;
				fields.forEach(f => {
					dom = document.getElementById(formPrefix+'_'+f);
					dom.value = data[f][0];
					dom.style.display = data[f][1];
				});
				form.style.display = 'block';
			}

			function fill(id) {
				let comments = pages.current.componentData[componentKey], comment;
				for (comment of comments) {
					if (comment.id == id) {
						setContent({
							name: [comment.name, 'none'],
							email: [comment.email, 'none'],
							id: [id, 'none'],
							message: [comment.message, 'block'],
						});
					}
				};
			}

			function newComment(){
				const b = Auth.userId > 0;
				setContent({
					name: [b ? 'session' : '', b ? 'none' : 'block'],
					email: [b ? 'session@session.com' : '', b ? 'none' : 'block'],
					id: ['0', 'block'],
					message: ['', 'block'],
				});
			}

		return {
			add() {
				add();
			},
			fill(id) {
				fill(id);
			},
			newComment() {
				newComment();
			},
			delete(id) {
					deleteData(id);
			},
			remove() {
				// if exist event listener then we remove it but we dont have
			}
		}
	}


	// --------------------------------------------------------------------------
	// ------------------------- Audioplayer contructor -------------------------
	// --------------------------------------------------------------------------


	function AudioPlayer (setup, req=false) {
		document.getElementById('App').insertAdjacentHTML('afterend', view.getContent ('audioPlayer', {title: "Lejátszó", name: setup.name}));
		let audio = new Audio(), str = '', id = Math.random().toString(36).substr(2, 9),
			player = {
				dom: {
					//rest is needed
					app: document.querySelector('#audioPlayer'),
					head: null,
					list: null,
					main: null,
					duration: null,
					currentTime: null,
					title: null,
					volume: null,
					spearkerIcon: null,
					loopIcon: null,
					anchorIcon: null,
					randomIcon: null,
					container: null,
					close: null,
				},
				list: [],
				button: {
					play: {},
					pause: {},
					stop: {},
				},
				currentSong: -1,
				play: false,
				currentTime: 0,
				loop: true,
				anchor: false,
				random: false,
				select(index) {
					if (player.currentSong !== -1) {
						document.getElementById("audio_"+id+"_"+player.currentSong).classList.remove('selected');
					}
					player.handler.stopButton();
					player.currentSong = index;
					player.handler.playButton();
				},
				handler: {
					playButton() {
						if (player.play) { return; }
						let dom = player.dom;
						if (player.currentSong === -1) {
							player.currentSong = 0;
						}
						player.play = true;
						let currentSong = player.list[player.currentSong];
						audio.src = currentSong.src;
						audio.play();
						document.getElementById("audio_"+id+"_"+player.currentSong).classList.add('selected');
						dom.title.innerHTML = currentSong.title;
						dom.title.title = currentSong.title;
						dom.duration.innerHTML = currentSong.duration;
						dom.currentTime.classList.remove('blink');
					},
					stopButton() {
						let dom = player.dom;
						player.currentTime = 0;
						dom.currentTime.innerHTML = getDuration(player.currentTime);
						dom.track.value = 0;
						audio.pause();
						player.play = false;
						dom.currentTime.classList.remove('blink');
					},
					pauseButton() {
						if (!player.play) { return; }
						player.currentTime = ~~audio.currentTime;
						audio.pause();
						player.play = false;
						player.dom.currentTime.classList.add('blink');
					},
					changeAudio(e) {
						let index = e.target.dataset.index;
						if (index) { player.select(e.target.dataset.index); }
					},
					loopButton() {
						player.loop = !player.loop;
						player.dom.loopIcon.classList[player.loop ? 'add' : 'remove']('select');
					},
					anchorButton() {
						player.anchor = !player.anchor;
						player.dom.anchorIcon.classList[player.anchor ? 'add' : 'remove']('select');
					},
					randomButton(){
						player.random = !player.random;
						player.dom.randomIcon.classList[player.random ? 'add' : 'remove']('select');
					},
					setVolume (e){
						setVolume(e.target.value);
					},
					audioEnded () {
						if (player.loop) {
							let currentSong = player.currentSong, index;

							if (player.anchor) {
								index = currentSong;
							} else if (player.random) {
								index = ~~(Math.random() * player.list.length);
							} else {
								index = (+currentSong+1) < player.list.length ? +currentSong + 1 : 0;
							}

							player.select(index);
						}
					},
				}
			}, dummyAudio = [], dummyLen,
			setCurrentTime = function() {
				audio.currentTime = ~~player.currentTime;
			},
			setVolume = function(vol){
				let icons = ['&#x1f508;', '&#x1f509;', '&#x1f50a;'],
					icon = icons[0];
				audio.volume = vol/100;
				if (vol > 30) {
					icon = icons[2];
				} else if(vol > 1) {
					icon = icons[1];
				}
				player.dom.spearkerIcon.innerHTML = icon;
			},
			setTrackMaxValue = function () {
				player.dom.track.max = ~~audio.duration;

			},
			setTrack = function(e) {
				let val = e.target.value;
				audio.currentTime = val;
				player.dom.currentTime.innerHTML = getDuration(val);
			},
			handler, listTimer, playTimer, playlist;

		//  ---- Player variable declaration end ---- :DD

		function init(list) {
			let dom = player.dom, main, handler = player.handler, app = dom.app;
			dummyLen = list.length;
			player.list = list;
			dom.head = app.querySelector('.header');
			dom.list = app.querySelector('.list');
			dom.main = app.querySelector('.details');
			main = dom.main
			dom.duration = main.querySelector('.duration');
			dom.currentTime = main.querySelector('.currentTime');
			dom.title = main.querySelector('.title');
			dom.volume = main.querySelector('.volume');
			dom.track = main.querySelector('.track');
			dom.container = dom.app.querySelector('.container');
			dom.spearkerIcon = main.querySelector('.speaker_icon');
			dom.loopIcon = main.querySelector('.loop_icon');
			dom.anchorIcon = main.querySelector('.anchor_icon');
			dom.randomIcon = main.querySelector('.random_icon');

			audio.addEventListener('play', setCurrentTime);
			audio.addEventListener('loadedmetadata', setTrackMaxValue);
			dom.volume.addEventListener('change', handler.setVolume);
			dom.track.addEventListener('change', setTrack);
			audio.addEventListener('ended', handler.audioEnded);

			setVolume(dom.volume.value);
			player.loop = !player.loop;
			player.anchor = !player.anchor;
			player.random = !player.random;
			handler.loopButton();
			handler.anchorButton();
			handler.randomButton();

			player.list.forEach((a, i) => {
				dummyAudio[i] = [new Audio(), i];
				dummyAudio[i][0].src = a.src;
			});


			listTimer = setInterval(() => {
				if (dummyLen === 0) {
					clearInterval(listTimer);
					loadList();
				}
				dummyAudio.forEach( (a, i) => {
					if (a && a[0].readyState > 0) {
						player.list[a[1]].duration = getDuration(~~a[0].duration);
						dummyAudio.splice(i, 1);
						dummyLen--;
					}
				});
			}, 200);
		};

		req.get(setup.datasource.get, {}, data => init(data.modelData), debug);

		function getDuration(s=0) {
			return ('00'+~~(s/60)).slice(-2)+':'+('00'+s%60).slice(-2);
		}

		// when all audio is ready to play then we insert to playlist
		function loadList() {
			let str = "", dom = player.dom;
			player.list.forEach((a, i) => {
				str += '<li id="audio_'+id+'_'+i+'" data-index="'+i+'" title="'+a.title+'">'+a.title+' - <span data-index="'+i+'"> '+a.duration+' </span></li>';
			});
			dom.list.insertAdjacentHTML('afterbegin', '<ul id="playlist_'+id+'">'+str+'</ul>');
			playlist = document.getElementById("playlist_"+id);
			playlist.addEventListener('click', player.handler.changeAudio);
			dom.container.style.display = 'block';
			dragdrop(dom.app, dom.head);
			// we add our custom scrollbar and drag and drop functionality to window
			player.scrollBar = new ScrollBar(player.dom.container);
			// if element is hidden then the scrollbar adding not work
			// we just hide into left: -9999px and if it is loaded then we put back and hide normally
			dom.app.style.left = 0+'px';
			dom.app.style.display = 'none';
		}

		playTimer = setInterval(() => {
			if (player.play) {
				player.dom.track.value = ~~audio.currentTime;
				player.dom.currentTime.innerHTML = getDuration(~~audio.currentTime);
			}
		}, 1000);

		function ScrollBar(containerDOM) {
			let container = (typeof containerDOM === "string"
					? document.querySelector(containerDOM)
					: containerDOM) || null,
				content = container.querySelector(".content") || null,
				scrollBar = container.querySelector("input[type=range]") || null;

			if (!container || !content || !scrollBar) { return console.log('missing one or more dom element (ex. container[div], .content[div], .scrollBar[input=type[range]])'); }

			let	cntnrH = container.offsetHeight,
				scrllH = content.scrollHeight,
				diffH = scrllH - cntnrH+20,
				scrllBrH = scrollBar.offsetHeight;
			if (scrllH < cntnrH) {
				content.style.right = -40+'px';
				return scrollBar.outerHTML = "";
			}
			scrollBar.style.width = cntnrH-20+"px";
			scrollBar.style.right = (scrllBrH-cntnrH/2+10)+'px';
			scrollBar.addEventListener('change', () => {
				content.scrollTop = diffH/100*scrollBar.value;
			});

			content.addEventListener('scroll', () => {
				scrollBar.value = 100/(scrllH-cntnrH+20)*content.scrollTop;
			});
		};
		return {
			button(which) {
				if (player.handler[which]) {
					player.handler[which]();
				}
			},
			remove() {
				// i dont add here anything because it is permanent component
			}
		}
	};

	// --------------------------------------------------------------------------
	// ------------------------- ContextMenu constructor -------------------------
	// --------------------------------------------------------------------------

	function ContextMenu (setup, req) {
		const width = setup.style.width || 200,
			id = 'contextmenu_'+Date.now();
		let dom;

		function init() {
			dom = document.createElement("div");
			dom.classList.add(setup.className);
			dom.setAttribute("tabindex","-1");
			dom.style.width = width+'px';
			dom.textContent = "asdas";
			dom.id = id;
			document.body.appendChild(dom);
			dom.addEventListener('blur', blurEvent);
			dom.onclick = function() { setTimeout( blurEvent, 100); };
		}

		function blurEvent() {
			dom.classList.remove('show');
		}

		function moveContextMenu(e) {
			const px = e.pageX,
				  py = e.pageY,
				  cx = dom.offsetWidth,
				  cy = dom.offsetHeight,
			 	  wx = document.body.clientWidth,
 			  	  wy = document.body.clientHeight;
			let	nx, ny;

			ny = (py+cy > wy) ? (wy-cy > 0 ? wy-cy : 0) : py;
			nx = (px+cx > wx) ? (wx-cx > 0 ? wx-cx : 0) : px;

			dom.style.top = py+'px';
			dom.style.left = ((px+cx > wx) ? (wx-cx > 0 ? wx-cx : 0) : px)+'px';
			dom.classList.add('show');
			dom.focus();
		}

		function populateContextMenu(list) {
			let str = "";
			while (dom.firstChild) {dom.removeChild(dom.firstChild)};
			if (list) {
				const ul = document.createElement('ul');
				for (let row of list) {
					if (row[2] == 'url') {
						str = `href="${row[1]}"`;
					} else {
						str = `href="*" data-action="component/${row.splice(1).join('/')}"`;
					}
					ul.insertAdjacentHTML('beforeend', `<li ${str}>${row[0]}</li>`);
				}
				dom.appendChild(ul);
			}
		}

		init();

		return {
			getId() {
				return dom.id || false;
			},
			remove(){
				dom.removeEventListener('blur', blurEvent);
			},
			action(e, list=[]) {
				populateContextMenu(list);
				moveContextMenu(e);
				e.preventDefault();
			}
		}
	}


	// --------------------------------------------------------------------------
	// ------------------------- FileUploader constructor -------------------------
	// --------------------------------------------------------------------------

	function FileUploader (setup, req) {
		const limit = setup.limit;
		let core = {
			queue: [],
			done: [],
			progress: [],
		};

		let dom = {}

		const templates = {
			main: `<header>
						<div class="title hide"> <span class="text">Upload</span> <span class='done'>0</span>/<span class='max'>0</span></div>
						<div class="minimize" href="*" data-action="component/${setup.name}/toggleBar">-</div>
					</header>
					<main>
						<p data-value="0">Uploading</p>
						<div class="progress-container">
							<div class="progress-bar"></div>
						</div>
					</main>`,

		}

		function init() {
			let e = document.createElement('div');
			e.classList.add('uploadPanel');
			e.innerHTML = templates.main;
			document.body.appendChild(e);
			dom.panel = e;
			dom.title = dom.panel.querySelector('.title');
			dom.headerText = dom.title.querySelector('.text');
			dom.headerDone = dom.title.querySelector('.done');
			dom.headerMax = dom.title.querySelector('.max');
			dom.main = dom.panel.querySelector('main');
			dom.mainText = dom.panel.querySelector('p');
			dom.bar = dom.panel.querySelector('.progress-bar');
		}

		init();

		// the trick, we need attach more callback, because:
		// - we need to use callback for other component (like AlbumManager)
		// - but we need calback to our UploadFile component to,
		// so i use this factory function for this

		function uploadAnalyzer(callback, file, success=false) {
			return function(data) {
				core.done.push(file);
				const keys = Object.keys(core.progress);
				for (let key of keys) {
					if (core.progress[key] === file) {
						core.progress.splice(key, 1);
						break;
					}
				}
				// the original callback
				callback(data);
				refreshDOM();
				if (!core.queue.length && !core.progress.length) {
					slidePanel();
				}
			}
		}

		function pushUpload() {
			if (!core.queue.length) { return console.log('Nothing to push'); }
			let arr, max = limit.upload - core.progress.length, file, formData;
			for(let i=0;i<max;i++) {
				if (!core.queue[0]) { return refreshDOM(); }
				formData = new FormData();
				arr = core.queue.splice(0, 1)[0];
				file = arr.file;
				if (file.size > (limit.size * 1024)) {
					notify.add(file.name+' too large... Skipped!','error');
					i--;
					continue;
				}
				formData.append('image', file, file.name);
				if (arr.data) {
					const keys = Object.keys(arr.data);
					for (let key of keys) {
						formData.append('param['+key+']', arr.data[key]);
					}
				}
				core.progress.push(file);
				if (core.done.length) {
					slidePanel();
				}
				req.file(arr.url, formData, uploadAnalyzer(arr.success, file, true), uploadAnalyzer(arr.error, arr, false));
			}
			refreshDOM();
		}

		function slidePanel() {
			if (!core.queue.length && !core.progress.length) {
				setTimeout( () => dom.panel.classList.remove('show'), 1000);
			} else {
				dom.panel.classList.add('show');
			}
		}

		function resetDOM() {
			dom.headerText.textContent = 'Idle';
			dom.headerDone.textContent = 0;
			dom.headerMax.textContent = 0;
			dom.mainText.textContent = 'Idle';
			dom.mainText.dataset.value = 0;
			dom.bar.style.left = '-100%';
		}

		function refreshDOM() {
			const max = core.queue.length+core.done.length+core.progress.length;
			if (max == 0) { return resetDOM(); }
			const uploading = core.progress.length > 0,
				rate = Math.round(core.done.length * 100 / max);

			dom.headerText.textContent = uploading ? 'Uploading' : 'Uploaded';
			dom.headerDone.textContent = core.done.length;
			dom.headerMax.textContent = max;

			dom.mainText.textContent = uploading ? 'Uploading' : 'Uploaded';
			dom.mainText.dataset.value = rate;
			dom.bar.style.left = '-'+(100-rate)+'%';
			if (core.progress.length < limit.upload) {
				return pushUpload();
			}
		}

		function add(url, data=null, files, success=null, error=null) {

			if (!core.queue.length && !core.progress.length && core.done.length > 0) {
				core.done = [];
				dom.bar.style.left = '-100%';
			}
			for(let file of files) {
				core.queue.push({ url, data, file, success, error} );
			}

			if (core.progress.length < limit.upload) {
				pushUpload();
			}
		}

		return {
			action(url, data=null, files, success=null, error=null) {
				add(url, data, files, success, error);
			},
			getId() {
				return dom.id || false;
			},
			remove() {
				dom.panel.remove();
			},
			toggleBar() {
				dom.title.classList.toggle('hide');
				dom.main.classList.toggle('hide');
			}
		}
	}


		// --------------------------------------------------------------------------
		// ------------------------- AlbumManager constructor -------------------------
		// --------------------------------------------------------------------------

		function AlbumManager (setup, req) {
			let albumData = pages.current.componentData[setup.name], e, dom, selAlbum, title, description, thumbContainer, chckbx, files, selectedAlbum;
			const templates = {
				main(setup) { return view.getContent ('adminSidePanelBone', ['albumManagerDiv',`
								<h2> Szerkeszt </h2>
								<div id="setAlbum_Form" data-method="POST" data-action="albums/add">
									<select id="admin_album_list" name="setAlbum_id">
										<option value="0">Új Album</option>
									</select>
									<input type="text" name="setAlbum_title" placeholder="Album név" data-rule="STRING,3,100">
									<textarea name="setAlbum_description" placeholder="Album leírás" data-rule="STRING,0,5000"></textarea>
								</div>
								<a href="*" data-action="component/${setup.name}/rename"><div class="btn type-1">Átnevez</div></a>
								<br>
								<div class="separator"></div>
								<h2> Csoport <input type="checkbox" id="select_all_album" href="*" data-action="selectAll/${setup.workArea}" data-allow="true"> </h2>
								<div id="delAlbum_Form" data-method="POST" data-action="albums/delete">
									<a href="*" data-action="component/${setup.name}/removeAlbum"><div class="btn type-2"> Töröl </div></a>
								</div>`]);
				}
			},

			renderFunc = {
				add(data) {
					albumData.push(data);
					const opt = document.createElement("option");
					opt.text = data.title;
					opt.value = data.id;
					selAlbum.add(opt);
					thumbContainer.insertAdjacentHTML('beforeend', view.getContent('albumCreate', data));
					return notify.add('Album created!','success');
				},
				update(data) {
					const len = albumData.length;
					let i = 0;
					for (;i<len;i++) {
						if (albumData[i].id == data.id) {
							albumData[i] = data;
							e = document.getElementById('album_'+data.id);
							if (e) {
								e.querySelector('p .title').textContent = data.title;
							}
							for (e of selAlbum) {
								if (e.value == data.id) {
									e.textContent = data.title;
									break;
								}
							}
							return notify.add('Album updated!','success');
						}
					}
				},
				remove(ids) {
					let len = albumData.length, i = 0, id;

					// remove from administation fields
					if (selectedAlbum) {
						if (ids.indexOf(selectedAlbum.id) !== -1) {
							selectedAlbum = null;
							title.value = "";
							description.value = "";
						}
					}

					//remove from select
					for (e of selAlbum) {
						if (ids.indexOf(e.value) !== -1) {
							e.remove();
						}
					}

					// remove from data array
					for (;i<len;i++) {
						if (!albumData[i]) { continue; }
						id = albumData[i].id;
						if (ids.indexOf(id) !== -1) {
							e = document.getElementById('album_'+id);
							if (e) {
								e.remove();
							}
							albumData.splice(i, 1);
							i--;
							len--;
						}
					}
				}
			};

			function init(list) {
				pages.current.dom.insertAdjacentHTML('afterend', templates.main(setup));
				dom = document.getElementById('albumManagerDiv');
				selAlbum = dom.querySelector(setup.selectElem);
				title = dom.querySelector('input[name="setAlbum_title"]');
				description = dom.querySelector('textarea[name="setAlbum_description"]');
				chckbx = dom.querySelector('#adminSideCheckbox');
				files = dom.querySelector('input[type="file"]');
				for (e of albumData) {
					addAlbumOptions(e);
				}
				thumbContainer = pages.current.dom.querySelector(setup.workArea);
				selAlbum.addEventListener('change', selectAlbum);
				thumbContainer.addEventListener('contextmenu', contextMenuHandler, true);
				files.addEventListener('change', fileUploadHandler);
			};

			function successUpload(data) {
				const id = data.modelData.albumId;
				let len = albumData.length, i = 0;
				for (;i<len;i++) {
					if (albumData[i].id == id) {
						albumData[i].coverImage = data.modelData.path;
						albumData[i].imageId = data.modelData.id;
						const domAlbum = thumbContainer.querySelector('#album_'+id+' img');
						if (domAlbum) {
							domAlbum.src = THUMBNAIL_PATH+data.modelData.path;
						}
						return;
					}
				}
			}

			function errorUpload(data){
				debug(data);
			}

			function fileUploadHandler(e) {
				if (!files.files.length) { return; }
				const data = [
					setup.datasource.upload,
					{album_id: files.dataset.id},
					files.files,
					successUpload,
					errorUpload
				];
				pages.current.component[setup.relationship.upload].action(...data);
			}

			function contextMenuHandler(e){
				let i = 0, t, el = e.target, maxLevel = 5;
				for (;i<maxLevel;i++) {
					if (el.dataset.context) {
						t = el;
						break;
					}
					el = el.parentElement;
					if (!el) { return; }
				}

				if (t) {
					const id = t.dataset.id
					const list = [
						['Open', `/gallery/album/${id}`, 'url'],
						['Upload', setup.name, 'upload', id],
						['Edit', setup.name, 'edit', id],
						['Delete', setup.name, 'removeAlbum', id],
						['Properties', setup.name, 'properties', id],
					];
					pages.current.component[setup.relationship.menu].action(e, list);
				}
			}

			function getAlbum(id){
				for (let e of albumData) {
					if (e.id == id) {
						return e;
					}
				}
				return false;
			}

			function selectAlbum(id=null) {
				const target = id || this.value;
				if (id) {
					Object.keys(selAlbum).forEach( (i) => {
						if (selAlbum[i].value == id) {
							return selAlbum.selectedIndex = i;
						}
					});
				}

				for (e of albumData) {
					if (e.id == target) {
						title.value = e.title;
						description.value = e.description;
						selectedAlbum = e;
						return;
					}
				}
			}

			function addAlbumOptions(e) {
				selAlbum.options[selAlbum.options.length] = new Option(e.title, e.id);
			}

			function addSuccess (data){
				if (data.modelData && data.renderFunc && renderFunc[data.renderFunc]) {
					renderFunc[data.renderFunc](data.modelData);
				}
			}

			function removeSuccess (data){
				if (data.modelData && data.modelData.ids) {
					const ids = data.modelData.ids.split(',');
					if (ids.some(a => Number.isNaN(a))) {
						notify.add('Wrong ids!','error');
					}
					renderFunc[data.renderFunc](data.modelData.ids.split(','));
				}
			}

			function getSelectedAlbums(){
				const chckbxs = thumbContainer.querySelectorAll('input[type="checkbox"]:checked');
				let ids = [];
				if (!chckbxs.length) {
					notify.add('Please select atleast 1 album!','error');
					return false;
				}
				for(e of chckbxs) {
					ids.push(e.parentElement.id.replace('album_',''));
				}
				return ids;
			}

			function renameAlbum(id) {
				model.submitForm('setAlbum_Form', setup.datasource.add, null, addSuccess);
			}

			function removeAlbum(id) {
				let ids;
				if (!id) {
					ids = getSelectedAlbums();
					if (!ids) { return; }
				} else {
					ids = [id];
				}
				model.submitForm('delAlbum_Form', setup.datasource.delete, ids, removeSuccess);
			}

			init();

			return {
				removeAlbum(id=null){
					removeAlbum(id);
				},
				remove() {
					// this executed when component removed with page content
					thumbContainer.removeEventListener('contextmenu', contextMenuHandler);
					selAlbum.removeEventListener('change', selectAlbum);
					files.removeEventListener('change', fileUploadHandler);
					dom.remove();
				},
				rename(id=null) {
					renameAlbum(id);
				},
				edit(id=null) {
					if (!id) { return; }
					selectAlbum(id);
					chckbx.checked = true;
					title.focus();
				},
				upload(id=null) {
					if (!id) { return; }
					files.dataset.id = id;
					files.click();
				},
				properties(id=null) {
					const album = getAlbum(id);
					if (!album) { return; }
					alert(`Id: ${album.id}\nTitle: ${album.title}\nDescription:${album.description}\nUser Id: ${album.user_id}\nStatus: ${album.status}\nCreated: ${album.created}`);
				},
			}
		};


		// --------------------------------------------------------------------------
		// ------------------------- ImageManager constructor -------------------------
		// --------------------------------------------------------------------------

		function ImageManager (setup, req) {
			let e, dom, selAlbum, description, thumbContainer, chckbx, files, selectedImage,
				[currentAlbum, albumData, imageData] = pages.current.componentData[setup.relationship.viewer];
			const albumId = pages.current.routeData.param.id || 0,
			 	templates = {
					main(setup) { return view.getContent ('adminSidePanelBone', ['imageManagerDiv',`
									<h2> Szerkeszt </h2>
									<div id="setImage_Form" data-method="POST" data-action="albums/add">
										<textarea name="setImage_description" placeholder="Kép leírás" data-rule="STRING,0,5000" disabled></textarea>
									</div>
									<a href="*" data-action="component/${setup.name}/edit"><div class="btn type-1">Átnevez</div></a>
									<br>
									<div class="separator"></div>
									<input type="checkbox" id="select_all_image" href="*" data-action="selectAll/${setup.workArea}" data-allow="true"><select id="admin_album_list" name="setImage_id"></select>

									<a href="*" data-action="component/${setup.name}/move"><div class="btn type-3"> Áthelyez </div></a>
									<a href="*" data-action="component/${setup.name}/removeImage"><div class="btn type-2"> Töröl </div></a>
									<a href="*" data-action="component/${setup.name}/upload"><div class="btn type-4"> Feltölt </div></a>
									<div id="delImage_Form" data-method="POST" data-action="images/delete">
									</div>`]);
					}
				},
				renderFunc = {
					remove(ids) {
						if (selectedImage && ids.indexOf(selectedImage.id) > -1) {
							selectedImage = null;
							description.value = '';
							description.disabled = true;
						}
						let len = imageData.length, i = 0, id;
						for (;i<len;i++) {
							if (!imageData[i]) { continue; }
							id = imageData[i].id;
							if (ids.indexOf(id) !== -1) {
								e = document.getElementById('image_'+id);
								if (e) { e.remove(); }
								imageData.splice(i, 1);
								i--;
								len--;
							}
						}
					}

				};

			function init(list) {
				pages.current.dom.insertAdjacentHTML('afterend', templates.main(setup));
				dom = document.getElementById('imageManagerDiv');
				selAlbum = dom.querySelector(setup.selectElem);
				description = dom.querySelector('textarea[name="setImage_description"]');
				chckbx = dom.querySelector('#adminSideCheckbox');
				files = dom.querySelector('input[type="file"]');
				for (e of albumData) {
					addAlbumOptions(e);
				}
				thumbContainer = pages.current.dom.querySelector(setup.workArea);
				thumbContainer.addEventListener('contextmenu', contextMenuHandler, true);
				files.addEventListener('change', fileUploadHandler);
			};

			function successUpload(data) {
				const images = data.modelData,
					id = images.id;
					imageData.push(images);
				thumbContainer.insertAdjacentHTML('beforeend', view.getContent('albumImageCreate', images));
			}

			function errorUpload(data){
				debug(data);
			}

			function fileUploadHandler(e) {
				if (!files.files.length) { return; }
				const data = [
					setup.datasource.upload,
					{album_id: albumId},
					files.files,
					successUpload,
					errorUpload
				];
				pages.current.component[setup.relationship.upload].action(...data);
			}

			function contextMenuHandler(e){
				let i = 0, t, el = e.target, maxLevel = 5;
				for (;i<maxLevel;i++) {
					if (el.dataset.context) {
						t = el;
						break;
					}
					el = el.parentElement;
					if (!el) { return; }
				}

				if (t) {
					const id = t.dataset.id
					const list = [
						['Open', setup.name, 'open', id],
						['Upload', setup.name, 'upload', id],
						['Edit', setup.name, 'select', id],
						['Delete', setup.name, 'removeImage', id],
						['Properties', setup.name, 'properties', id],
					];
					pages.current.component[setup.relationship.menu].action(e, list);
				}
			}

			function getImage(id){
				for (let e of imageData) {
					if (e.id == id) {
						return e;
					}
				}
				return false;
			}

			function addAlbumOptions(e) {
				selAlbum.options[selAlbum.options.length] = new Option(e.title, e.id);
			}

			function editSuccess(data){
				let image = getImage(data.modelData.id);
				if (image) {
					image.description = data.modelData.description;
					notify.add('Image changes was saved!','success');
				}
			}

			function editImage() {
				const data = {
					id: selectedImage.id,
					album_id: albumId,
				};
				model.submitForm('setImage_Form', setup.datasource.edit, data, editSuccess);
			}

			function selectImage(id) {
				let image = getImage(id);
				if (image) {
					selectedImage = image;
					chckbx.checked = true;
					description.disabled = false;
					description.value = image.description;
					description.focus();
				}
			}

			function removeSuccess (data){
				if (data.modelData && data.modelData.ids) {
					const ids = data.modelData.ids.split(','),
						action = data.modelData.move ? 'moved' : 'deleted';
					if (ids.some(a => Number.isNaN(a))) {
						notify.add('Wrong ids!','error');
					}

					notify.add(ids.length+` image was ${action}!`,'success');
					renderFunc.remove(ids);
				}
			}

			function removeImage(id, move=false) {
				const albumId = selAlbum[selAlbum.selectedIndex].value;
				let ids, data;
				const url = setup.datasource[move ? 'move' : 'delete'];
				if (!id) {
					ids = getSelectedImages();
					if (!ids) { return; }
				} else {
					ids = [id];
				}
				data = move ? {ids, albumId} : ids;
				model.submitForm('delImage_Form', url, data, removeSuccess);
			}

			function getSelectedImages(){
				const chckbxs = thumbContainer.querySelectorAll('input[type="checkbox"]:checked');
				let ids = [];
				if (!chckbxs.length) {
					notify.add('Please select atleast 1 image!','error');
					return false;
				}
				for(e of chckbxs) {
					ids.push(e.parentElement.id.replace('image_',''));
				}
				return ids;
			}

			init();

			return {
				open(id=null){
					const dom = thumbContainer.querySelector(`#image_${id} a[href="*"]`);
					if (!dom) { return; }
					dom.click();
				},
				removeImage(id=null) {
					removeImage(id);
				},
				move(id=null) {
					removeImage(id, true);
				},
				remove() {
					// this executed when component removed with page content
					thumbContainer.removeEventListener('contextmenu', contextMenuHandler);
					files.removeEventListener('change', fileUploadHandler);
					dom.remove();
				},
				select(id=null) {
					if (!id) { return; }
					selectImage(id);
				},
				edit() {
					if (!selectedImage) { return; }
					editImage();
				},
				upload() {
					if (!albumId) { return; }
					files.dataset.id = albumId;
					files.click();
				},
				properties(id=null) {
					const image = getImage(id);
					if (!image) { return; }
					alert(`album name: ${currentAlbum.title}\nalbum id: ${albumId}\nimage id: ${image.id}\nDescription:${image.description}\nUser Id: ${image.userId}\nStatus: ${image.status}\nCreated: ${image.created}`);
				},
			}
		};


	// --------------------------------------------------------------------------
	// ------------------------- window drag and drop ---------------------------
	// --------------------------------------------------------------------------

	function dragdrop(e1, e2 = null) {
		e1 = typeof e1 === "string" ? document.body.querySelector(e1) : e1;
		e2 = typeof e1 === "string" ?  document.body.querySelector(e2 || e1) : e2;
		e2.addEventListener('mousedown', dragHandler);
		let body = document.body,
			html = document.documentElement,
			eWidth = e1.offsetWidth,
			eHeight = e1.offsetHeight,
			mWidth = Math.max(body.offsetWidth, html.offsetWidth)-eWidth,
			mHeight =  Math.max(body.offsetHeight, html.offsetHeight)-eHeight,
			cX, cY, x, y, pos = e1.style.position,
			shiftX, shiftY,
			moving = false;
		e1.style.position = 'fixed';

		function move(x, y) {
			e1.style.left = x+'px';
			e1.style.top = y+'px';
		}

		function mousemove (e) {
			x = e.clientX-shiftX;
			y = e.clientY-shiftY;
			cX = x >  mWidth ? mWidth : x < 0 ? 0 : x;
			cY = y >  mHeight ? mHeight : y < 0 ? 0 : y;
		move(cX, cY);
		}

		function mouseup () {
			body.removeEventListener('mousemove', mousemove);
			body.removeEventListener('mouseup', mouseup);
			moving = false;
		}

		function dragHandler(e){
			if (moving) return;
			moving = true;
			body.addEventListener('mousemove', mousemove);
			// use window => mouse could be released when pointer isn't over the body
			window.addEventListener('mouseup', mouseup);
			shiftX = e.clientX - e1.offsetLeft;
			shiftY = e.clientY - e1.offsetTop;
		}

		return {
			remove() {
				body.removeEventListener('mousemove', mousemove);
				window.removeEventListener('mouseup', mouseup);
				e2.removeEventListener('mousedown', dragHandler);
			}
		}
	}



	// --------------------------------------------------------------------------
	// ------------------------- SettingsManager constructor -------------------------
	// --------------------------------------------------------------------------

	function SettingsManager (setup, req=false) {
		let dom, inputs;
		const template = `
		<div class="${setup.name}">
			<div class="form_window" id="settings_Form" data-method="POST" data-action="user/settings">
				<h1> Beállítások </h1><br>
				<input id="settings_name" name="settings_name" type="text" placeholder="Teljes Név" title="Kérem adjon a nevét" data-rule="NAME_HUN,5,50">
				<input id="settings_city" name="settings_city" type="text" placeholder="Város" title="Város név csak magyar karaktereket tartalmazhat" data-empty="true" data-rule="ADDRESS_HUN,0,50">
				<input id="settings_address" name="settings_address" type="text" placeholder="Cím" title="Címe csak magyar karaktereket tartalmazhat" data-empty="true" data-rule="ADDRESS_HUN,0,50">
				<input id="settings_phone" name="settings_phone" type="text" placeholder="Telefon" title="Kérem adjon a telefon számat" data-empty="true"  data-rule="PHONE,0,50">
				<input id="settings_email" name="settings_email" type="text" placeholder="Email cím" title="Kérem adjon meg az email címét" data-rule="EMAIL,5,50">
				<input id="settings_password" name="settings_password" type="password" value="" placeholder="Jelenlegi jelszó" title="Kérem adjon meg a jelenlegi jelszavát" data-empty="true" data-rule="ALPHA_NUM,0,32">
				<input id="settings_password_new1" name="settings_password_new1" disabled type="password" data-empty="true" placeholder="Új jelszó" title="Kérem adjon meg egy jelszót, az angol ABC betűit és/-vagy számok felhasználasával" data-rule="">
				<input id="settings_password_new2" name="settings_password_new2" disabled type="password" data-empty="true" placeholder="Jelszó újra" title="Egyeznie kell az előző mezővel!" data-same=""><br>
				<br>
				<div href="*" data-action="component/${setup.name}/submit" class="btn btn-type-5"> Mentés </div>
				<div href="*" data-action="component/${setup.name}/toggle" class="btn btn-type-6"> Bezár </div>
				</div>
		</div>`;

		function init() {
			document.body.insertAdjacentHTML('beforeend', template);
			dom = document.querySelector(`.${setup.name}`);
			inputs = {
				passOld: dom.querySelector(`#settings_password`),
				passNew1: dom.querySelector(`#settings_password_new1`),
				passNew2: dom.querySelector(`#settings_password_new2`)
			};
			inputs.passOld.onkeyup = changeOldPassword;
			inputs.passOld.onchange = changeOldPassword;
			req.get(setup.datasource.get, {}, updateFields, debug);
		}

		function updateFields(data) {
			const user = data.modelData,
			 	fields = ['name', 'email', 'address', 'phone', 'city'];
			for (let field of fields) {
				dom.querySelector(`#settings_${field}`).value = user[field];
			}
			if (data.renderFunc == "update") {
				notify.add(`User settings was updated!`,'success');
				dom.classList.toggle('slideFromTop');
			}
		}

		function changeOldPassword() {
			const e = inputs.passOld,
				active = e.value.trim().length > 0;
				inputs.passNew1.disabled = !active;
				inputs.passNew2.disabled = !active;
				inputs.passNew1.dataset.rule = active ? 'ALPHA_NUM,6,32' : '';
				inputs.passNew2.dataset.same = active ? 'settings_password_new1' : '';
		}

		init();

		return {
			submit(){
				model.submitForm('settings_Form', setup.datasource.edit, {}, updateFields);
			},
			toggle() {
				dom.classList.toggle('slideFromTop');
			},
			remove() {
				dom.remove();
			}
		}
	}


	// --------------------------------------------------------------------------
	// ------------------- MessengerComponent constructor -----------------------
	// --------------------------------------------------------------------------

	function MessengerComponent (setup, req=false) {
		let dom, tabs = {}, tab_names = [], e, msgList=[],sentList=[],
			targetUser, inboxTable, sentTable,inpSubject, inpContent, msgIcons,
			timerId, timerPeriod = setup.refresh.period * 1000, timerUrl = setup.datasource.refresh;

		const template = {
			main() {return `<div class="wrapper">
						<header>
							<ul></ul>
						</header>
						<main></main>
					</div>`;},
			nav(label, action, prefix) {
				return `<li href="*" data-action="component/${setup.name}/${prefix}${action}">${label}</li>`
			},
			write() {
				return `
				<div id="message_Form" data-method="POST" data-action="message/send_msg">
					<h1>Új Üzenet Küldése</h1><br>
					<input id="message_subject" name="message_subject" type="text" placeholder="Üzenet címe" title="A cím 1 és 255 karakter között lehet!" data-rule="STRING,1,255">
					<textarea id="message_content" name="message_content" placeholder="Üzenet szövege" title="A szöveg 1 és 5000 karakter között lehet!" data-rule="STRING,1,5000"></textarea><br>
					<footer>
						<select id="message_user_id" name="message_user_id"></select>
						<a href="*" data-action="component/${setup.name}/submit" title="Az üzenet küldése" class="btn btn-type-5"> Küldöm </a>
					</footer>
				</div>`;
			},
			inbox() {
				return `<table><thead>
						<tr><th>Name</th><th>Subject</th><th>Date</th><th></th></tr>
						</thead><tbody></tbody></table>`;
			},
			sent() {
				return `<table><thead>
						<tr><th>Name</th><th>Subject</th><th>Date</th><th></th></tr>
						</thead><tbody></tbody></table>`;
			},
			view(msg=null) {
				if (!msg) { return '' };
				const backPage = Auth.userId == msg.sender_id ? 'sent' : 'inbox';
				msg.created = msg.created.split('-').join('.');
				msg.updated = msg.updated ? msg.updated.split('-').join('.') : 'Unreaded';
				return `<header>
							<div class="sender">
								<span class="hide-phone bold">From: </span><span data-role="sender_name">${msg.sender_name}</span>
								<time datetime="${msg.created}">${msg.created}</time>
							</div>
							<div class="target">
								<span class="hide-phone bold">To: </span><span data-role="target_name">${msg.target_name}</span>
								<time datetime="${msg.update}">${msg.updated}</time>
							</div>
						</header>
						<main>
							<div>
								<span class="hide-phone bold">Subject: </span><span data-role="subject">${msg.subject}</span><br>
								<span class="hide-phone bold">Content: </span><span data-role="subject">${msg.content}</span>
							</div>
						</main>
						<footer>
							<a href="*" data-action="component/${setup.name}/reply/${msg.id}" data-role="reply"><div class="btn type-1"> Válasz </div></a>
							<a href="*" data-action="component/${setup.name}/deleteUser/0" data-role="delete"><div class="btn type-2"> Töröl </div></a>
						</footer>`;

			},
			tableRow(data) {
				const reply = Auth.userId != data.sender_id ? `<a href="*" data-action="component/${setup.name}/reply/${data.id}" class="reply">&#x21b6;</a>` : '';
				return `<tr data-id=${data.id} data-status="${data.status}" href="*" data-action="component/${setup.name}/view/${data.id}">
						<td>${data.name}</td>
						<td>${data.subject}</td>
						<td>${data.created}</td>
						<td>
							${reply}
							<a href="*" data-action="component/${setup.name}/delete/${data.id}" class="delete">&#x2718;</a>
						</td>
						</tr>`;
			}
		},
		renderFunc = {
			write(data) {
				const userList = data.modelData;
				targetUser.innerHTML = '';
				for (let user of userList) {
					targetUser.options[targetUser.options.length] = new Option(user.name, user.id);
				}
			},
			sent(data) {
				populateTableRow(data.modelData, sentTable);
			},
			inbox(data) {
				populateTableRow(data.modelData, inboxTable);
			},
			view(data) {
				const msg = data.modelData;
				tabs['view'].innerHTML = template.view(msg);
				decreaseMsgCounter(msg);
			},
			refresh(data) {
				const n = data.modelData.count;
				for (let icon of msgIcons) {
					icon.dataset.count = n;
				}
			}
		};

		function init() {
			const nav_links = [
				['Bezár', 'toggle',''],
				['Kimenő', 'sent', 'switchTo/'],
				['Bejövő', 'inbox', 'switchTo/'],
				['Küldés', 'write', 'switchTo/'],
			];
			dom = document.createElement('div');
			dom.classList.add('minimizeEffect');
			dom.id = "messenger";
			dom.innerHTML = template.main();

			const ul = dom.querySelector('header ul'),
				main = dom.querySelector('main');

			for(let nav_link of nav_links) {
				ul.insertAdjacentHTML('beforeend', template.nav(...nav_link));
				if (nav_link[1] == "toggle") { nav_link[1] = "view"; }
				e = document.createElement('div');
				e.classList.add(nav_link[1]);
				if (nav_link[1] == "sent" || nav_link[1] == "inbox") {
					e.classList.add('msg-list');
				}
				e.innerHTML = template[nav_link[1]]();
				main.appendChild(e);
				tabs[nav_link[1]] = e;
				tab_names.push(nav_link[1]);
			}

			tabs['write'].style.display = 'block';
			document.body.appendChild(dom);
			targetUser = dom.querySelector('#message_user_id');
			inboxTable = tabs['inbox'].querySelector('table tbody');
			sentTable = tabs['sent'].querySelector('table tbody');
			inpSubject = tabs['write'].querySelector('input[name="message_subject"]');
			inpContent = tabs['write'].querySelector('textarea[name="message_content"]');
			msgIcons = document.body.querySelectorAll(setup.refresh.iconPath);
			switchPage('write');
			if (msgIcons.length) {
				periodicTimer();
			}
		}

		function decreaseMsgCounter(msg) {
			if (msg.target_id == Auth.userId && msg.status == 0) {
				for (let icon of msgIcons) {
					icon.dataset.count = icon.dataset.count-1;
				}
			}
		}

		function periodicTimer() {
			req.get(timerUrl, {}, renderFunc['refresh'], debug);
			timerId = setTimeout(periodicTimer, timerPeriod);
		}

		function populateTableRow(data, table, append=false) {
			let str = "";
			if (!append) {	table.innerHTML = ""; }
			msgList = append ? [...msgList, data] : data;
			if (data && data.length) {
				for(let msg of data) {
					str += template.tableRow(msg);
				}
				table.insertAdjacentHTML("beforeend", str);
			}
		}

		function sendMsg(data) {
			notify.add(`Message was sent!`,'success');
			inpSubject.value = '';
			inpContent.value = '';
			populateTableRow(data.modelData, sentTable, true);
		}

		function deleteMsg(data) {
			const msg = data.modelData.msg,
				len = msgList.length;
			if (!msg || !msg.id) { return; }
			let i = 0;
			for (;i<len;i++) {
				if (msgList[i].id == msg.id) {
					const row = dom.querySelector(`tr[data-id="${msg.id}"]`);
					if (row) { row.remove(); }
					msgList.splice(i, 1);
					return notify.add(`Message deleted!`,'success');
				}
			}
		}

		function getMsg(id) {
			if (!msgList.length) { return false; }
			for (let m of msgList) {
				if (m.id == id) { return m; }
			}
			return false;
		}

		function selectUser(id) {
			const len = targetUser.length;
			if (!len) { return false; }
			let i = 0;
			for (;i<len;i++) {
				if (targetUser[i].value == id) { return targetUser.selectedIndex = i; }
			}
			return false;
		}

		function reply(id) {
			const msg = getMsg(id);
			if (!msg) { return notify.add(`Message not exist !`,'error'); }
			switchPage('write');
			inpSubject.value = 'Re: '+msg.subject;
			inpContent.value = '---'+msg.content+'---';
			selectUser(msg.sender_id);
		}

		init();

		function switchPage(slug, id=null) {
			const data = id ? { param: { id }} : {};
			for (let name of tab_names) {
				tabs[name].classList.add('hide');
			}
			tabs[slug].classList.remove('hide');
			req.get(setup.datasource[slug], data, renderFunc[slug], debug);
		}

		return {
			switchTo(slug) {
				if (!slug) { return; }
				switchPage(slug);
			},
			submit() {
				const name = targetUser[targetUser.selectedIndex].textContent;
				model.submitForm('message_Form', setup.datasource.send, {name}, sendMsg);
			},
			toggle() {
				dom.classList.toggle('minimizeEffect');
			},
			view(id=null) {
				switchPage('view', id);
			},
			userTarget(id=null) {
				switchPage('write');
				selectUser(id);
				dom.classList.remove('minimizeEffect');
			},
			reply(id=null) {
				reply(id);
			},
			delete(id=null) {
				if (!id) { return; }
				ajax.get(setup.datasource.delete, {param:{id}}, deleteMsg, debug);
			},
			remove() {
				dom.remove();
				clearTimeout(timerId);
			}
		}
	}


	// --------------------------------------------------------------------------
	// ------------------- UserManagerComponent constructor -----------------------
	// --------------------------------------------------------------------------

	function UserManagerComponent (setup, req=false) {
		let dom, placeholder, table, tbody, delLink,
			userList = pages.current.componentData[setup.name],
			selectedUser, selStatus, selRank, chckbx, inpEmail;
		const template = {
			main(setup) {
				const maxRank = USER_RANK.length;
				let optsS = "", optsR = "", i = 0;
				for (let status of USER_STATUS) {
					optsS += `<option value="${i++}">${status}</option>`;
				}

				for (i=1;i<maxRank;i++) {
					optsR += `<option value="${i}">${USER_RANK[i]}</option>`;
				}

				return view.getContent ('adminSidePanelBone', ['userManager',`
							<h2> Szerkeszt </h2>
							<div id="setUser_Form" data-method="POST" data-action="users/admin_add">
								<select id="admin_user_status" name="setUser_status">${optsS}</select>
								<select id="admin_user_rank" name="setUser_rank">${optsR}</select>
								<input type="text" name="setUser_email" placeholder="Email" data-rule="EMAIL,3,100">
							</div>
							<a href="*" data-action="component/${setup.name}/save"><div class="btn type-1">Mentés</div></a>
							<br>
							<div class="separator"></div>
							<h2> Végleges </h2>
							<a href="*" data-action="component/${setup.name}/deleteUser/0" data-role="delete"><div class="btn type-2"> Töröl </div></a>
							`]);
			},
			row (user) {
				return view.getContent( 'userCreateRow', [user, setup.name]);
			}
		};

		function init(reload=false) {
			table = document.querySelector(setup.table);
			tbody = table.querySelector('tbody');
			if (!reload) {
				document.body.insertAdjacentHTML("beforeend", template.main(setup));
			}
			dom = document.getElementById(setup.name);
			selStatus = document.getElementById('admin_user_status');
			selRank = document.getElementById('admin_user_rank');
			chckbx = dom.querySelector('#adminSideCheckbox');
			inpEmail = dom.querySelector('input[name$="_email"]');
			delLink = dom.querySelector('a[data-role="delete"]');
			selRank.selectedIndex = 0;
			populateTable();

		}

		function populateTable(list=false) {
			const data = list || userList;
			let str = "", u;
			if (!list) {
				tbody.innerHTML = "";
			} else {
				userList.push(...list);
			}

			for (u of data) {
				str += template.row(u);
			}
			tbody.insertAdjacentHTML("beforeend", str);
		}

		init();

		function editSuccess(data) {
			const id = data.modelData.id;
			if (!id) { return; }
			const row = table.querySelector(`tr[data-id="${id}"]`)
			let user = getUser(id);
			if (!user) { return notify.add(`Something went wrong and user data not exist in client side!`,'error'); }
			Object.assign(user, data.modelData);
			if (row) {
				const statusCell = row.querySelector(`td[data-field="status"]`),
					rankCell = row.querySelector(`td[data-field="rank"]`);
				statusCell.textContent = USER_STATUS[user.status];
				rankCell.textContent = USER_RANK[user.rank];
			}
			notify.add(`Changes was saved!`,'success');
		}

		function editUser() {
			const data = {
				id: selectedUser.id,
			};
			model.submitForm('setUser_Form', setup.datasource.edit, data, editSuccess);
		}

		function selectUser(id) {
			let user = getUser(id);
			if (user) {
				if (id != Auth.userId && user.rank >= Auth.role) {
					return notify.add(`Selected user got same or higher rank than you!`,'error');
				}
				delLink.classList[Auth.userId == id ? 'add' : 'remove']('disabled');
				selectedUser = user;
				chckbx.checked = true;
				inpEmail.value = user.email;
				selStatus.selectedIndex = user.status;
				selRank.selectedIndex = user.rank-1;
			}
		}

		function getUser(id) {
			for (let e of userList) {
				if (e.id == id) {
					return e;
				}
			}
			return false;
		}

		function deleteSuccess(data) {
			const len = userList.length,
				id = data.modelData.id || 0;
			let i = 0;
			if (!id) { return; }
			for (;i<len;i++) {
				if (userList[i].id == id) {
					const row = table.querySelector(`tr[data-id="${id}"]`);
					row.remove();
					userList.splice(i, 1);
					chckbx.checked = false;
					return notify.add(`User deleted!`,'success');
				}
			}
		}

		return {
			view(id=null) {
				alert(id);
			},
			deleteUser() {
				if (!selectedUser) { return; }
				ajax.get(setup.datasource.delete, {param:{id: selectedUser.id}}, deleteSuccess, debug);
			},
			message(id=null) {
				alert('msg: '+id);
			},
			select(id=null) {
				selectUser(id);
			},
			save() {
				editUser();
			},
			reload() {
				init(true);
			},
			remove() {
				dom.remove();
			}
		}
	}

	// ---------------------------------------------------------------
	// ---------------------- ModalComponent -------------------------
	// ---------------------------------------------------------------

	function ModalComponent(setup, req) {
		let dom, content, urlSuffix,
			isOpen = false,
			options = {
				layer: true,

			};
		const	template = {
				main() {
					return `<div href="*" data-action="component/${setup.name}/close" class="close"> &times; </div>
							<div class="content"></div>`;
				}
			};

		function init() {
			dom = document.createElement('div');
			dom.dataset.modal = true;
			dom.classList.add('modal-window', 'hidden', 'fade-in');
			dom.innerHTML = template.main();
			document.body.appendChild(dom);
			content = dom.querySelector('.content');
		}

		init();

		// str = conent string
		// urlAddon = string what will be added to url
		// init = page started with this prefix (then true)
		function setContent(str, urlAddon=false, init=false) {
			if (str || str === '') {
				content.innerHTML = str;
			}
			if (urlAddon) {
				if (!init) {
					router.setUrl(urlAddon);
				}
				urlSuffix = urlAddon;
			}
			if (!isOpen) {
				show();
			}
		}

		function close() {
			if (urlSuffix) {
				router.setUrl("");
				urlSuffix = null;
			}

			dom.classList.add('hidden');
			content.innerHTML = "";
			isOpen = false;
		}

		function show() {
			isOpen = true;
			dom.classList.remove('hidden');
		}

		return {
			close() {
				close();
			},
			show() {
				show();
			},
			toggle() {
				if (isOpen) {
					close();
				} else {
					show();
				}
			},
			getDOM() {
				return dom;
			},
			setContent(str=false, urlAddon=false, init=false) {
				setContent(str, urlAddon, init);
			},
			getContent() {
				return content;
			}
		}
	}

	// ---------------------------------------------------------------
	// ------------------ YoutubeViewerComponent ---------------------
	// ---------------------------------------------------------------

	function YoutubeViewerComponent(setup, req) {
		let dataList = pages.current.componentData[setup.name];
		const component = pages.current.component,
			modalName = setup.relationship.modal,
			template = {
				main(video) {
					return `<div class="video-container">
							<iframe src="https://www.youtube.com/embed/${video.id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
						</div>`;
				}
		}

		function init() {
			const videoIndex = pages.current.routeData.param.index;
			if (videoIndex) {
				setTimeout( () => show(videoIndex, true), 500);
			}
		}

		init();

		function show(id, init=false) {
			for(let video of dataList) {
				if (video.id === id) {
					return component[modalName].setContent(template.main(video), video.id, init);
				}
			}
		}

		return {
			show(id=null) {
				show(id);
			},
			remove() {

			}
		}
	}

	// ---------------------------------------------------------------
	// -------------------- ImageViewerComponent ---------------------
	// ---------------------------------------------------------------

	function ImageViewerComponent(setup, req) {
		let dataList = pages.current.componentData[setup.name][2],
			currentIndex = 1, image, title, date;
		const component = pages.current.component,
			modalName = setup.relationship.modal,
			template = {
				main(image) {
					let leftArrow = image.index > 1 ? `<div class="leftCarousel"><a href='*' data-action='component/${setup.name}/previous'> &#10096; </a></div>` : ``,
						rightArrow = image.index < dataList.length ? `<div class="rightCarousel"><a href='*' data-action='component/${setup.name}/next'> &#10097; </a></div>` : ``;
					return `<div class="image-container">
								<div class="image-src-side">
									<img src="${GALLERY_PATH+image.path}">
									${leftArrow}
									${rightArrow}
								</div>
								<div class="image-data-side">
									${image.description}<br>
									<time datetime="${image.created}">${image.created.split('-').join('.')}</time>
								</div>
							  </div>`;
				}
		}

		function init() {
			const videoIndex = pages.current.routeData.param.index;
			if (videoIndex) {
				setTimeout( () => show(videoIndex, true), 500);
			}
		}

		init();

		function show(index,init=false) {
			const image = dataList[index-1];
			if (!image) { return; }
			currentIndex = index;
			return component[modalName].setContent(template.main(image), image.index, init);
		}

		function changeImage(direction) {
			const nIndex = direction === 'next' ? +currentIndex+1 : +currentIndex-1;
			show(nIndex);
		}

		return {
			show(id=null) {
				show(id);
			},
			next() {
				changeImage("next");
			},
			previous() {
				changeImage("prev");
			},
			remove() {

			}
		}
	}

	// ---------------------------------------------------------------
	// ---------------------- Create objects -------------------------
	// ---------------------------------------------------------------

	let ajax = new Ajax();
	let middleware = new Middleware();
	let router = new Router(middleware);
	let model = new Model(router);
	let view = new View();
	let controller = new Controller(middleware);
	// maybe better if i put Notufy into components but longer to access
	let notify = new Notify();

	router.init();

})();
