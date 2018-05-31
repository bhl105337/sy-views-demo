$(function () {
    $.ajax({
        url:config.ip+"/admin/hotGame",
        type:"get",
        success:function (data) {

           if(data.state){
               var androidId=data.game[1].game_id;
               var iosid=data.game[0].game_id;

               $.ajax({
                   url:config.ip+"/admin/gameName",
                   type:"get",
                   data:{sys:2},
                   success:function (data) {
                       var game=data.name;
                       var html="";
                       for(var i=0;i<game.length;i++){

                           html+='<option value="'+game[i].id+'" selected="">'+game[i].game_name+'</option>';
                       }
                       $("#hot select").append(html);
                       $("#hot select").val(androidId)
                   }
               });
               $.ajax({
                   url:config.ip+"/admin/gameName",
                   type:"get",
                   data:{sys:1},
                   success:function (data) {
                       var game=data.name;
                       var html="";
                       for(var i=0;i<game.length;i++){

                           html+='<option value="'+game[i].id+'" selected="">'+game[i].game_name+'</option>';
                       }
                       $("#hot_ios select").append(html);
                       $("#hot_ios select").val(iosid)
                   }
               })
           }
        }
    })



    $(".edit").click(function () {

        $.ajax({
            url:config.ip+"/admin/editHotGame",
            type:"get",
            data:{id:$(this).parents("li").siblings("li").find("select").eq(0).val(),sys:$(this).attr("data-sys")},
            success:function (data) {
                if(data.state){
                    Ewin.alert('修改成功');
                }
            }

        })
    })
});