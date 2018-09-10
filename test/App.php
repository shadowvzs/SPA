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
	<script type="text/javascript" src="/test/events.json"></script>		
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
				<div class="loader middle"></div>
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
	<link rel="stylesheet" href="/test/css/calendar.css" type="text/css" />
	<script type="text/javascript" src="/test/js/calendar.js"></script>
<script src="/test/js/App.js" type="text/javascript"></script> 		
<script>
setup = {
	callback: function(date, event) { 
		var str = 'Ths is a callback for date '+date+'\n\n';
		if (event) {
			for (e of event) {
				str += 'Event: '+e.title+'\nMessag: '+e.message+'\nDate: '+e[this.data.key]+'\n\n';
			}
		}
		console.log(str);
	},
	// if we select a day then will be placed in this input
	output: '#output',
	// start with day view mod (0-3)
	viewMode: 0,
	// limit on years
	range: {
		min: 2000,
		max: 2143,
	},
	// calendar place and event when appear
	show: {
		event: ['click', '.more.button.col-gray'],
		position: 'middle',
		//position: '#App header',
	},
	// data and event date key
	data: {
		key: 'created',
		list: JSON.parse(data)
	}
};



setTimeout(function(){
	//var c = new Calendar(setup);
}, 3000);
</script>
	</body>
</html>