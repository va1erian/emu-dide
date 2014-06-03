
-- Table: app_user
CREATE TABLE app_user ( 
    id       INTEGER        PRIMARY KEY AUTOINCREMENT
                            NOT NULL,
    nickname VARCHAR( 30 )  NOT NULL,
    passhash VARCHAR        NOT NULL 
);


-- Table: app_sourcecode
CREATE TABLE app_sourcecode ( 
    id          INTEGER  PRIMARY KEY AUTOINCREMENT
                         NOT NULL,
    app_user_id INTEGER  NOT NULL
                         REFERENCES app_user ( id ),
    name        VARCHAR  NOT NULL,
    last_update DATETIME NOT NULL,
    content     TEXT     NOT NULL 
);

