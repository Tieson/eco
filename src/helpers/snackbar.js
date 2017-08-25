/**
 * Created by Tom on 25.08.2017.
 */

function showSnackbar(text) {
    var $snackbar = $('#snackbar');
    console.log("showSnackbar", text, $snackbar);
    if (text) {
        $snackbar.addClass('show');
        $snackbar.text(text);
        setTimeout(function(){ $snackbar.removeClass('show')}, 3000);
    }
}