<?php

namespace model\entities;

class User {
    private $id;
    private $nickname;
    private $passHash;
    
    function __construct($id, $nickname, $passHash) {
        $this->id = $id;
        $this->nickname = $nickname;
        $this->passHash = $passHash;
    }

    public function getId() {
        return $this->id;
    }

    public function getNickname() {
        return $this->nickname;
    }

    public function getPassHash() {
        return $this->passHash;
    }

}