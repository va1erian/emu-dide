<?php

namespace model\services;

class SourceCodeService {
    private $pdo;
    
    public function __construct($pdo){ // database attributes
        $this->pdo = $pdo;
    }
    
    public function findById($id, $userId){

        $stmt = $this->pdo->prepare(
                'SELECT id, app_user_id, name, last_update, content '
                . 'FROM app_sourcecode '
                . 'WHERE  id = :id '
                . 'AND    app_user_id = :userid');
        
        
        if($stmt->execute([':id' => $id, ':userid' => $userId])) {
            return $stmt->fetchObject('\model\entities\SourceCode');
        } else {
            error_log('SourceCodeService byid query failed');
            return false;
        }
    }
    
    
    public function findAllByUserId($userId){

        $stmt = $this->pdo->prepare(
                'SELECT id, app_user_id, name, last_update, content '
                . 'FROM app_sourcecode '
                . 'WHERE  app_user_id = :userid');
        
        
        if($stmt->execute([':userid' => $userId])) {
            return $stmt->fetchAll(\PDO::FETCH_CLASS, '\model\entities\SourceCode');
        } else {
            error_log('SourceCodeService allByUserId query failed');
            return false;
        }
    }
    
    public function add($sourceCode){
        $stmt = $this->pdo->prepare(
            'INSERT INTO app_sourcecode(app_user_id, name, last_update, content) '
            . 'VALUES ( :app_user_id , :name , :last_update, :content )');


        if($stmt->execute([':app_user_id' => $sourceCode->app_user_id,
            ':name' => $sourceCode->name, ':last_update' => $sourceCode->last_update,
                ':content' => $sourceCode->content])) {
            return $this->pdo->lastInsertId();
        } else {
            var_dump('SourceCodeService add query failed');
            return $this->pdo->errorInfo();
        }
    }
    
    public function update($sourceCode){
        /* Name unchanged because author does not change */
        $stmt = $this->pdo->prepare(
                'UPDATE app_sourcecode '
                . 'SET   content = :content,'
                . 'last_update = :last_update'
                . 'WHERE  id = :id'
                . 'AND    app_user_id = :app_user_id');
        
        if($stmt->execute([':content' => $sourceCode->content,
            ':last_update' => $sourceCode->last_update, ':id' => $sourceCode->id,
            ':app_user_id' => $sourceCode->app_user_id])) {
            return true;
        } else {
            error_log('SourceCodeService edit query failed');
            return false;
        }
    }
    
    // TODO
    /*
     * DELETE FROM table_name
    WHERE some_column=some_value;
     */
    public function remove($sourceCode){
        $stmt = $this->pdo->prepare(
                'DELETE FROM app_sourcecode '
                . 'WHERE  id = :id '
                . 'AND    app_user_id = :userid');
        
        
        if($stmt->execute([':id' => $sourceCode->id, ':userid' => $sourceCode->app_user_id])) {
            return true;
        } else {
            error_log('SourceCodeService remove query failed');
            return false;
        }
    }
}