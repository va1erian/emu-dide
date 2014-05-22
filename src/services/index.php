<?php
require 'flight/Flight.php';

Flight::route('/', function(){
    include 'emu-dide.html';
});

Flight::route('POST /login', function() {

});

Flight::route('POST /register', function() {
    
});

Flight::route('GET /programs', function() {
    error_log('top kek');
    Flight::json(  [ [ 'name' => 'kek', 'lastUpdate' => 'lul'], [ 'name' => 'kik', 'lastUpdate' => 'kuk'] ] );
});

Flight::route('GET /programs/@id', function($id) {

});

Flight::route('POST /programs/@id', function($id) { 
    
});

Flight::route('PUT /programs', function($id) {
    
});

Flight::route('DELETE /programs/@id', function($id) {
    
});

Flight::route('/phpinfo', function() {
    phpinfo();
});

Flight::start();

