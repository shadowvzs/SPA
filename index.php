<!DOCTYPE html>
<html>
	<head>
		<title>JS SPA - MVC</title>
		<meta charset="UTF-8">
		<meta name="description" content="Atm moment only test page for SPA">
		<meta name="keywords" content="HTML,CSS,JavaScript,JSON,Ajax,SPA,ES6">
		<meta name="author" content="Varga Zsolt">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/css/index.css" type="text/css"/>
	</head>
	<body>
		<div class="grid" id="App">
			<div class="header-line">
				<div class="burger">
					<input type="checkbox" id="burgerCheckbox" />
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

	<link rel="stylesheet" href="/css/delayed.css" type="text/css" />
	<script src="/js/App.js?s=<?php echo time(); ?>" type="text/javascript"></script>
	</body>
</html>
