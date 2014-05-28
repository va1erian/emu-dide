<?php

namespace model\services;

class UserService {
    private $pdo;
    
    public function __construct($pdo){ // database attributes
        $this->pdo = $pdo;
    }
    
    public function findById($id){
        
    }

    
    public function findByName($name){
            $stmt = $this->pdo->prepare(
                'SELECT id, nickname, passhash ' // Ou SELECT * ?
                . 'FROM app_user '
                . 'WHERE  nickname = :name ');
        
        
        if($stmt->execute([':name' => $name])) {
            return $stmt->fetchObject('\model\entities\User');
        } else {
            error_log('UserService byName query failed');
            return false;
        }
    }
    
    public function add($user){
        $password = password_hash($user->passhash , PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare(
            'INSERT INTO app_user(nickname, passhash) '
            . 'VALUES ( :name , :password )');


        if($stmt->execute([':name' => $user->nickname, ':password' => $password])) {
            return $this->pdo->lastInsertId();
        } else {
            var_dump('UserService add query failed');
            return $this->pdo->errorInfo();
        }
    }
}