<?php

session_start();
if(isset($_GET['page']) && $_GET['page']=="deconnexion")
	session_destroy();

	
mysql_connect("localhost","root","root");
mysql_select_db("emudide");


?>