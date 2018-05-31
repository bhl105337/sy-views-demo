$(function () {
    if(sessionStorage.getItem('uid')){
        $('#user_name').text(sessionStorage.getItem('name'))
    }else {
        window.location.href='/';
    }
   $('#user_close').click(function () {
       sessionStorage.clear();
       window.location.href='/';
   });
    $('.nav-pills>li').click(function () {
        $(this).addClass('active').siblings('li').removeClass('active');
        if($(this).attr("data-href")=='html/user/admin.html'){
            if(sessionStorage.getItem('jurisdiction')==1){
                $("#myiframe").attr("src",$(this).attr("data-href"));
            }else {
                return
            }
        }else {
            $("#myiframe").attr("src",$(this).attr("data-href"));
        }

    })
});