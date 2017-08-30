/**
 * Created by Tom on 25.08.2017.
 */

var showSnackbar = createSnackbar(3000, $('#snackbar'));

function createSnackbar(time, $snackbar){
    // var snackbars = [];
    var opened = false;
    
    function show(text) {
        $snackbar.addClass('show');
        $snackbar.text(text);
        setTimeout(function(){
            $snackbar.removeClass('show');
            opened = false;
        }, time);
    }

    var _showSnackbar = function (text) {
        // snackbars.push(text);
        // if(!opened){
            opened = true;
        //     var sbt = snackbars.pop();
            if (text) {
                show(text);
            }
        // }
    };

    return _showSnackbar;
}