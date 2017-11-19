/**
 * Created by Tom on 25.08.2017.
 */

var showSnackbar = createSnackbar(3500, $('#snackbar'));

function createSnackbar(time, $snackbar){
    // var snackbars = [];
    var opened = 0;
    
    function show(text) {
        var clone = $snackbar.clone();
        opened++;
        clone.addClass('show');
        clone.text(text);
        clone.appendTo($("body"));
        clone.attr("id","snackbar_"+opened);
        setTimeout(function(){
            // if (opened <= 0){
            //     clone.removeClass('show');
            // }
            clone.remove();
        }, time);
    }

    var _showSnackbar = function (text) {
        // snackbars.push(text);
        // if(!opened){
        //     var sbt = snackbars.pop();

            if (text) {
                show(text);
            }
        // }
    };

    return _showSnackbar;
}