<?php
include("header.php");

$page=(!empty($_GET['page'])) ? $_GET['page'] : 'acceuil';

$page='pages/'.$page.'.php';
if(is_file($page)){
	
	include($page);
}
else
	echo "erreur la page n'existe pas!";

include("footer.php");
?>