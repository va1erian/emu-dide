<?php

namespace model\entities;

class SourceCode {
    private $id;
    private $user;
    private $name;
    private $lastUpdate;
    private $content;
    function __construct($id, $user, $name, $lastUpdate, $content) {
        $this->id = $id;
        $this->user = $user;
        $this->name = $name;
        $this->lastUpdate = $lastUpdate;
        $this->content = $content;
    }
    
    public function getId() {
        return $this->id;
    }

    public function getUser() {
        return $this->user;
    }

    public function getName() {
        return $this->name;
    }

    public function getLastUpdate() {
        return $this->lastUpdate;
    }

    public function getContent() {
        return $this->content;
    }

    public function setName($name) {
        $this->name = $name;
        return $this;
    }
    
    public function setLastUpdate($lastUpdate) {
        $this->lastUpdate = $lastUpdate;
        return $this;
    }

    public function setContent($content) {
        $this->content = $content;
        return $this;
    }
    
}