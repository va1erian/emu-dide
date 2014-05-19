<br><br><?php
if(isset($_SESSION['pseudo']) && $_SESSION['pseudo']!="" && $_GET['page']!='deconnexion')
	echo "<a href='index.php?page=deconnexion'>Deconnexion</a><br>";
else
	echo "<a href='index.php?page=login'>Login</a>/<a href='index.php?page=register'>Register</a><br>";
?>