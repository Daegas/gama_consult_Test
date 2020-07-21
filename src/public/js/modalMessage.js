/**************************** FUNCTIONS *******************************************/
function messageModal(modal_, blink, message) {
    modal_.modal("show");
    $('.modal-backdrop').css("opacity", "0");

    if (blink) {
        $(".message").text(message);
        setTimeout(() => {
            modal_.modal("hide");
        }, 3000);
    } else {
        $(".message-details").text(message);
    }
}

//************************ MESSAGE EVENTS ***************************/
$('.modal-message').on('show.bs.modal', function (e) {
    x = "bounce"
    $('.modal-message .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
});