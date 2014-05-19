<?php

if(isset($_POST['valider']) && isset($_POST['pseudo']) && isset($_POST['pass'])){
	if(empty($_POST['pseudo'])||empty($_POST['pass'])){
		echo "Erreur! Veuillez remplir tous les champs";
		exit(1);
	}
	
	$pseudo=addcslashes(mysql_real_escape_string($_POST['pseudo']), '%_');
	$pass=md5($_POST['pass']);
		

	
	$rq=mysql_query("select * from membre where pseudo='$pseudo' && mdp='$pass'");
	
	if(mysql_num_rows($rq)>0){
		$ligne=mysql_fetch_array($rq);
		$_SESSION['pseudo']=$ligne['pseudo'];
		$_SESSION['mail']=$ligne['mail'];
		$_SESSION['id']=$ligne['id'];
		echo "Connexion réussi!";
	}
	else{
		echo "Erreur! Combinaison login/pass incorrect.";
	}
	
	
}

if(isset($_SESSION['pseudo']) && !empty($_SESSION['pseudo'])){
		echo "Bonjour ".$_SESSION['pseudo']."\n";
		echo "<a href='index.php?page=mescodes'>Mes codes</a>";
	}
	else{
?>
<form action="index.php?page=login" method="post">
<table>
	<tr>
		<td>Pseudo:</td>
		<td><input type="text" name="pseudo"></td>
	</tr>
	<tr>
		<td>Mot de passe:</td>
		<td><input type="password" name="pass" ></td>
	</tr>
	<tr>
		<td>Valider:</td>
		<td><input type="submit" name="valider"></td>
	</tr>
</table>

</form>
<?php } ?>