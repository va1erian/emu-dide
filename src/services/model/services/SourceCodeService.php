<?php

namespace model\services;

class SourceCodeService {
    private $pdo;
    
    public function __construct($pdo){ // database attributes
        $this->pdo = $pdo;
    }
    
    public function findById($id, $userId){

        $stmt = $this->pdo->prepare(
                'SELECT * '
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
}