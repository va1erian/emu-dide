<?php
require 'flight/Flight.php';
use \model\entities\User;
use \model\entities\SourceCode;

$dbdata = [ 'path' => 'C:\Users\cedri_000\Documents\GitHub\emu-dide\build\db\emudide'];

$pdo = new PDO('sqlite:' . $dbdata['path']);

session_start();

Flight::register('userService', '\model\services\UserService', [$pdo]);
Flight::register('sourceCodeService', '\model\services\SourceCodeService', [$pdo]);

Flight::route('/', function(){
    include 'emu-dide.html';
});

/*
 * POST parameters: nickname, password
 * 
 * Check the given credentials and log the user if OK
 * 
 * return the user object if ok or 404 if not
 */
Flight::route('POST /login', function() {
    $request = Flight::request();
    $nickname = $request->data['nickname'];
    $pass     = $request->data['password'];
    
    $userServ = Flight::userService();
    
    $user = $userServ->findByName($nickname);
    if(password_verify($pass, $user->passhash)) {
        //create session
        $_SESSION['user'] = serialize($user);
        $user->passhash = 'topsecret';
        
        Flight::json(['user' => $user, 'status' => 'ok']);
    } else {
        Flight::json(['status' => 'ko', 'error' => 'Invalid credentials' ]);
    }
});

/*
 * POST parameters: none
 * 
 * Log the user out.
 */
Flight::route('POST /logout', function() {
});

/*
 *  POST parameters: nickname, password
 * 
 *  Register a new user and log him in
 */
Flight::route('POST /register', function() {
    $request = Flight::request();
    
    
    $nickname = $request->data['nickname'];
    $pass     = $request->data['password'];
    
    $userServ = Flight::userService();
    
    $user = $userServ->findByName($nickname);
    if($user) {
        Flight::json(['status' => 'ko', 'error' => 'The User already exists in the database']);
    } else {
        $usr = new User();
        $usr->nickname = $nickname;
        $usr->passhash = $pass;
        $id = $userServ->add($usr);
        if(!$id) {
            Flight::json(['status' => 'ko', 'error' => 'Insertion failed']);
        } else {
            Flight::json(['status' => 'ok', 'id' => $id]);
        }
    }
});

/*
 * No parameters
 * 
 * Return a list of program for the logged in user
 */
Flight::route('GET /programs', function() {
    error_log('top kek');
    
    $sourceServ = Flight::sourceCodeService();
    
    $program = $sourceServ->findById(1, 1);
    
    //var_dump($program);
    
    Flight::json(  ['lel' => $program] );
});


/*
 *  GET parameters : id - source code id
 *  
 * Return the source code for the given source code id and using the
 * logged in user id
 */
Flight::route('GET /programs/@id', function($id) {

});

/*
 *  GET parameters : id - source code id 
 *
 * Update the source code content for the given source code id and using the
 * logged in user id
 */
Flight::route('POST /programs/@id', function($id) { 
    
});

/*
 *  PUT parameters: name - program name, content - program content
 * 
 * Add to the database a new program using the given parameters
 */
Flight::route('PUT /programs', function($id) {
    
});

/*
 *  GET parameters : id - source code id
 *  
 * Delete the source code for the given id and using the
 * logged in user id
 */
Flight::route('DELETE /programs/@id', function($id) {
    
});

Flight::route('/phpinfo', function() {
    phpinfo();
});

Flight::start();

