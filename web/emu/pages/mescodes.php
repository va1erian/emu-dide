<?php
if(isset($_SESSION['id']) && !empty($_SESSION['id'])){
	$id=$_SESSION['id'];
	$rq=mysql_query("select * from code where membre='$id'");
	
	if(mysql_num_rows($rq)<=0){
		echo "Vous n'avez pas de code!  <a href='index.php?page=upload'>Upload</a>";

		exit(0);
	}
	echo "<a href='index.php?page=upload'>Upload</a> <br>";
	while($ligne=mysql_fetch_array($rq)){
		echo $ligne['code'].'<br><br>';
	}
}
?>