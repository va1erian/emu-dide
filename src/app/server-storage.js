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
                el.click(function() { fetchProgram(i.id); } );
                $('#program-list').append(el);
            });
            
        }).error(function(xhr, textStatus, error) {
            console.log(textStatus, error);
            console.log('Failed to fetch program list');
        });
        
    }
    
    function fetchProgram(id) {
        var req = $.get('/programs/' + id);
        
        req.done(function(data) {
            console.log(data);
        });
        
        req.fail(function(req, data, info) {
           alert('Sorry, an error when attempting to fetch the program.'); 
           console.log(data, info);
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
            }
        });
        
        query.fail(function() {
            alert('Sorry, an error occured during the log-in attempt');
        });
    }
    
    pub.renderProgramList = fetchPrograms;
    
    pub.init = function () {
        $('#login-form').submit(processLogInForm);
    };
    
    pub.isLoggedIn = function () {
        return identity !== undefined;
    };
    
    pub.userIdentity = function() {
        return identity;
    };
    
    
    return pub;
    
})();