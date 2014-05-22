/*
 * 
 * EMU-DIDE - Server-side storage for members
 * 
 */

ServerStorage = (function(){
    
    var pub = {}; //public symbols
    
    var programItemTemplate = _.template($('#program-item-tmpl').text());
    
    var identity; //undefined if not logged in
    
    function renderProgramList() {
        
        $.getJSON('/programs', function() {
            console.log('fetched program list');
        }).done(function(data){
            console.log(data);
            $('#program-list').empty();
            
            _(data).each(function(i) {
                var el = $(programItemTemplate({program : i }));
                el.click(function() { alert(i.name);});
                $('#program-list').append(el);
            });
            
        }).error(function(xhr, textStatus, error) {
            console.log(textStatus, error);
            console.log('Failed to fetch program list');
        });
        
    }
    
    pub.renderProgramList = renderProgramList;
    
    pub.init = function () {
        
    };
    
    
    return pub;
    
})();