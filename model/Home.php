<?php
spl_autoload_register(function ($class) {
    include './'.$class.'.php';
});
class Home extends Model {
	public function index($data=null) {
		$newsTable = "news";
		$role = static::$auth['role']+1;
		$sql = "SELECT u.name, n.title, n.message FROM `news` as n LEFT JOIN `users` as u on n.user_id = u.id WHERE n.status <= $role ORDER BY n.created DESC LIMIT 0,1";
		$result = static::execQuery($sql);
		$lastNews = !empty($result)
			? $result[0]
			: [
				'name' => 'Admin',
				'title' => 'Üdvözlet!',
				'message' => 'Üdvözölek az oldalon és kívánok egy szép napot neked és az Úr áldását az életedre!',
			];
		$data = [
		"home_last_note" =>
			"<h2>".$lastNews['title']."</h2>
			<p>".$lastNews['message']."</p>
			<div class='calendarIcon'><img src='./img/icons/menu/event.png'></div>",
      //.guestCalendar
      //more button col-gray
		"home_social" =>
			"Követhet minket a követkző helyeken: <br>
			<br><br><h3>Facebook:</h3> <a href='https://www.facebook.com/gyozelemgyulekezet' target='_blank'><img src='./img/icons/social/facebook.png'></a>
			<br><br><h3>YouTube:</h3> <a href='https://www.youtube.com/channel/UCju4wi5kFZ80lV8QHrm8lXg' target='_blank'><img src='./img/icons/social/youtube.png'></a>",
		"home_about" =>
			"<h2>Rólunk:</h2> Gyülekezetünk 15 éve jött létre és 7 helységben vannak gyülekezeteink: Nagyvárad, Szalonta, Székelyhíd, Mónospetri, Bogyoszló, Margitta, Érmihályfalva.<br><br>
			<h2>Hitünk:</h2> Hiszünk az egy igaz Istenben, Jézus Krisztusban mint Isten fiában aki a mi megváltónk, a Szent Szellemben mint vígasztaló és tanító, a Bibliában mint Isten igéjeben ami Istentől ihletett útmutatónk.<br><br>
			<h2>Hitvallás:</h2> Jézus nem vallást teremtett hanem keresztény életformát, ez egy helyreállításról szól Isten és emberközt, nem ember által alkotott tradiciókra épül hanem egy élő kapcsolatra.<br>Isten nem egy vallás, nem egy felekezet hanem egy személyes kapcsolat...<br><br>
			<h2>Célunk:</h2> Célunk, hogy emberek megtérjenek, megtapasztálják a Isten szeretetét, áldásait amit Jézus Krisztusban kijelentett az egész világ számára....<br><br>",
		"home_fund" =>
			"Ha szeretnéd támogatni anyagilag a gyülekezetet vagy missziókat:
			<br><br><h3>Bank adress:</h3> BANCPOST S.A. str. Tudor Vladimirescu nr. 1
			<br><i><b>ASOCIATIA CENTRUL CRESTIN BIRUINTA</b></i> str. Dunarea nr.13 ORADEA RO
			<br><br><h3>Bank account number:</h3> RO38BPOS05003108254ROL01
			<br><br><span class='red'><b>Swift code:</b></span> BPosRoBu",
		"home_contact" =>
			"<h2>Alkalmaink:</h2><br>
			<b>Istentisztelet:</b> <span class='main-service'>Vasárnap 16:00</span><br>
			<b>Imaalkalom:</b> <span class='pray-service'>Csütörtök 19:00</span><br>
			<b>Imaéjszaka:</b> <span class='night-service'>Minden hó utolsó szombata 19:00</span><br><br>
			<b>Címünk:</b> <p>Románia, Nagyvárad/Oradea, Dunarea utca, 13-as szám.<br>
			<a href='http://maps.google.ro/maps?hl=ro&client=firefox-a&hs=jOB&rls=org.mozilla:en-GB:official&q=oradea%20dunarii%2013&um=1&ie=UTF-8&sa=N&tab=wl'> google map </a> -
			<a href='http://maps.google.ro/maps?f=q&source=s_q&hl=ro&geocode=&q=oradea+dunarii+13&aq=&sll=47.061791,21.934934&sspn=0.007177,0.013797&g=oradea+dunarea+13&ie=UTF8&hq=&hnear=Strada+Dun%C4%83rea,+Oradea&ll=47.061674,21.933931&spn=0.001794,0.003449&z=18&layer=c&cbll=47.061709,21.933823&panoid=PxLWmzGtTo3-Es2FfLygjg&cbp=12,19.47,,0,23.9'>google map 2</a>
			</p><br>
			<b>Email cím:</b> office@gyozelem.ro"
		];
		// i hope this make it asier to understand
		// btw the $arg will be spread in js, so renderFun(...arg)
		$arg = [$data, 0];
		$renderFunc = 'build';
		return $this->sendResponse($arg, $renderFunc);
	}
}

$home = new Home();
