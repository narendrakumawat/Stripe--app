if(typeof(Storage) !== 'undefined') {
    if(!localStorage.getItem('token')) {
        document.write('Sorry cannot open app!');
        window.location.assign('/login');
    }else {
        Materialize.toast('Logged In', 4000 );
    }
} else {
    document.write('Sorry cannot open app!');
}
$(document).ready(function() {
    $('#pay-card').fadeIn(200);
    $('#pay-btn').click(function() {
        $('#enabler').addClass('disabled');
        $('.progress').show();
        var email = $('#email').val();
        var amount = $('#amount').val();
        var desc = $('#description').val();
        $.post("http://localhost:3000/pay/charges", {
            email : email,
            desc : desc,
            amount : amount
            },
            function (data, status) {
                console.dir(data);
                if(data.status === "succeeded") {
                    Materialize.toast('Payment Done', 4000 );
                }else {
                    Materialize.toast('Some Error', 4000);
                }
                $('#enabler').removeClass('disabled');
                $('.progress').hide();
                $('#email').val("");
                $('#amount').val("");
                $('#description').val("");
        });

    });
});