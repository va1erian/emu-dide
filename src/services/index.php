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
    unset($_SESSION['user']);
    session_destroy();
    Flight::json(['status' => 'ok']);
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
 *  GET parameters : id - source code id
 *  
 * Return the source code for the given source code id and using the
 * logged in user id
 */
Flight::route('GET /programs/@id', function($id) {
    $sourceServ = Flight::sourceCodeService();
    if(isset($_SESSION['user'])){
        $user = unserialize($_SESSION['user']);
        $programs = $sourceServ->findById($id, $user->id);
        Flight::json(['sources' => $programs, 'status' => 'ok']);
    } else {
        Flight::json(['status' => 'ko', 'error' => 'No connected users'] );
    }
});

/*
 * No parameters
 * 
 * Return a list of program for the logged in user
 */
Flight::route('GET /programs', function() {
    
    $sourceServ = Flight::sourceCodeService();
    if(isset($_SESSION['user'])){
        $user = unserialize($_SESSION['user']);
        $programs = $sourceServ->findAllByUserId($user->id);
        Flight::json(['sources' => $programs, 'status' => 'ok']);
    } else {
        Flight::json(['status' => 'ko', 'error' => 'No connected users'] );
    }
    
});

/*
 *  GET parameters : id - source code id 
 *
 * Update the source code content for the given source code id and using the
 * logged in user id
 */
Flight::route('POST /programs/@id', function($id) { 
    $request = Flight::request();
    
    $content = $request->data['content'];
    $actual_date = date('d/m/Y H:i:s');
    
    $sourceServ = Flight::sourceCodeService();
    if(isset($_SESSION['user'])){
        $user = unserialize($_SESSION['user']);
        
        $srcCode = new SourceCode();
        $srcCode->last_update = $actual_date;
        $srcCode->content = $content;
        $srcCode->id = $id;
        $srcCode->app_user_id = $user->id;
        
        if($sourceServ->update($srcCode)){
            Flight::json(['status' => 'ko', 'error' => 'Problem on update'] );
        } else {
            Flight::json(['status' => 'ok']);
        }
        
    } else {
        Flight::json(['status' => 'ko', 'error' => 'No connected users'] );
    }
});

/*
 *  PUT parameters: name - program name, content - program content
 * 
 * Add to the database a new program using the given parameters
 */
Flight::route('PUT /programs', function() {
    $request = Flight::request();
    // TODO : change attributes name on data
    $name = $request->data['name'];
    $content  = $request->data['content'];
    $actual_date = date('d/m/Y H:i:s');
    
    $sourceServ = Flight::sourceCodeService();
    if(isset($_SESSION['user'])){
        $user = unserialize($_SESSION['user']);
        
        $srcCode = new SourceCode();
        $srcCode->last_update = $actual_date;
        $srcCode->content = $content;
        $srcCode->name = $name;
        $srcCode->app_user_id = $user->id;
        
        $sourceServ->add($srcCode);
        Flight::json(['status' => 'ok']);
    } else {
        Flight::json(['status' => 'ko', 'error' => 'No connected users'] );
    }
});

/*
 *  GET parameters : id - source code id
 *  
 * Delete the source code for the given id and using the
 * logged in user id
 */
Flight::route('DELETE /programs/@id', function($id) {
    
    $sourceServ = Flight::sourceCodeService();
    if(isset($_SESSION['user'])){
        $user = unserialize($_SESSION['user']);
        
        $srcCode = new SourceCode();
        $srcCode->id = $id;
        $srcCode->app_user_id = $user->id;
        
        $sourceServ->remove($srcCode);
        Flight::json(['status' => 'ok']);
    } else {
        Flight::json(['status' => 'ko', 'error' => 'No connected users'] );
    }
});

Flight::route('/phpinfo', function() {
    phpinfo();
});

Flight::start();

