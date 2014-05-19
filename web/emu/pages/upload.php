<?php
if(isset($_POST['valider']) && isset($_POST['code'])){
	if(empty($_POST['code'])){
		echo "Veuillez rentrer un code";
		exit(1);
		}
	if(!isset($_SESSION['id']) || empty($_SESSION['id'])){
		echo "Erreur! Vous devez etre connecté!";
		exit(1);
	}
	$id=$_SESSION['id'];
	$code=addcslashes(mysql_real_escape_string($_POST['code']), '%_');
	
	mysql_query("INSERT INTO code(membre,code) VALUES('$id','$code')");
	echo "Code envoyé avec succés!";
}	
echo "<a href='index.php?page=mescodes'>Mes codes</a>";
?>

<form action="index.php?page=upload" method="post">
<textarea rows="3" cols="30" name="code">
   Texte affiché dans la balise textarea
</textarea> 
<input type="submit" name="valider">
</form>