/*
 * 
 * EMU-DIDE - Server-side storage for members
 * 
 */

ServerStorage = (function(){
    
    var pub = {}; //public symbols
    
    var programItemTemplate = _.template($('#program-item-tmpl').text());
    
    var identity; //undefined if not logged in
    
    function fetchPrograms() {
        $.getJSON('/programs', function() {
            console.log('fetched program list');
        }).done(function(data){
            console.log(data);
            $('#program-list').empty();
            
            _(data.sources).each(function(i) {
                var el = $(programItemTemplate({program : i }));
                el.find('.program-list-action-delete').click( function() {
                   deleteProgram(i.id);
                });
                    
                el.find('.program-list-action-load'). click(function() { 
                    fetchProgram(i.id); 
                } );
                $('#program-list').append(el);
            });
            
        }).error(function(xhr, textStatus, error) {
            console.log(textStatus, error);
            console.log('Failed to fetch program list');
        });
        
    }
    
    function deleteProgram (id) {
        var req = $.ajax('/programs/' + id, { type : 'DELETE' });
        
        req.done(function(data) {
            if(data.status === 'ok') {
                console.log('Program deleted');
            } else {
               alert('Sorry, the server encountered an error during the process.');
            }
            fetchPrograms();
        });
        
        req.fail(function() {
            console.log('Sorry, an error occured');
        });
    }
    
    function fetchProgram(id) {
        var req = $.get('/programs/' + id);
        
        req.done(function(data) {
            if(data.status === 'ok') {
                UI.setSources(data.sources.content);
            } else {
               alert('Sorry, the server encountered an error during the process.');
            }
        });
        
        req.fail(function(req, data, info) {
           alert('Sorry, an error when attempting to fetch the program.'); 
        });
    }
    
    function processLogInForm(event) {
        event.preventDefault();
        
        var nick = $('#login-username-field').val();
        var pwd  = $('#login-password-field').val();
        var url  = $('#login-form').attr('action');
        
        var query = $.post(url, {'nickname':  nick, 'password': pwd});
        
        query.done(function(data) {
           if(data.status === 'ok') {
                identity = data.user;
                fetchPrograms();
                UI.switchSidePane(UI.SIDE_PANE.PROGRAMS);
                $(pub).trigger('loggedIn');
            } else {
                alert('Invalid credentials.');
            }
        });
        
        query.fail(function() {
            alert('Sorry, an error occured during the log-in attempt');
        });
    }
    
    function processRegisterForm(event) {
        var nick = $('#login-username-field').val();
        var pwd  = $('#login-password-field').val();
        
        var req = $.post('/register', { 'nickname' : nick, 'password' : pwd});
        
        req.done(function(data) {
           if(data.status === 'ok') {
               alert('Your account has been created, you may now log in.');
           } else {
               alert('This nickname is already used. Please try again.');
           }
        });
        
        req.fail(function() {
            alert('Sorry, an error occured during the log-in attempt');
        });
    }
    
    function logOut(event) {
        var query = $.post('/logout');
        
        query.done(function(data) {
            if(data.status === 'ok') {
                identity = undefined;
                UI.switchSidePane(UI.SIDE_PANE.DEBUGGER);
                console.log('logged out');
            } else {
                alert('Sorry, the server encountered an error during the process.');
            }
        });
        
        query.fail(function() {
            alert('Sorry, an error occured during the log-out attempt');
        });
    }
    
    pub.renderProgramList = fetchPrograms;
    
    pub.init = function () {
        $('#login-form').submit(processLogInForm);
        $('#register-btn').click(processRegisterForm);
        $('#logout-btn').click(logOut);
    };
    
    pub.isLoggedIn = function () {
        return identity !== undefined;
    };
    
    pub.userIdentity = function() {
        return identity;
    };
    
    pub.storeProgram = function(name, program) {
       var req = $.post('/save-program', { 'name' : name, 'content': program });
       
       req.done(function(data) {
           if(data.status === 'ok') {
               console.log('Program successfully stored.');
           } else {
               alert('Sorry, the server encountered an error during the process.');
           }
           fetchPrograms();
       });
       
       req.fail(function() {
           console.log('Sorry, an error occured');
       });
    };
    

    
    return pub;
    
})();