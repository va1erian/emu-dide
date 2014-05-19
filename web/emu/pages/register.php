<?php


if(isset($_POST['valider']) && isset($_POST['pseudo']) && isset($_POST['pass']) &&  isset($_POST['mail'])){
	if(empty($_POST['mail']) || empty($_POST['pseudo']) || empty($_POST['pass']) ){
		echo "Erreur! Veuillez remplir tous les champs";
		exit(1);
	}
	
	$pseudo=addcslashes(mysql_real_escape_string($_POST['pseudo']), '%_');
	$mail=addcslashes(mysql_real_escape_string($_POST['mail']), '%_');
	$pass=md5($_POST['pass']);
	
	
	mysql_query("INSERT INTO membre(pseudo,mdp,email) VALUES('$pseudo','$pass','$mail')");
	
	echo "Inscription réussi";
}

?>
<form action="index.php?page=register" method="post">
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
		<td>Mail:</td>
		<td><input type="text" name="mail"></td>
	</tr>
	
	<tr>
		<td>Valider:</td>
		<td><input type="submit" name="valider"></td>
	</tr>
</table>

</form>