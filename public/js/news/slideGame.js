$(function () {
    $.ajax({
        type:"get",
        url:config.ip+"/adminNews/getSlideGame",
        data:{page:1},
        success:function (data) {
            if(data.state){
                var html="";
                var list=data.list;
                for(var i=0,l=list.length;i<l;i++){
                    html+='<tr data-id="'+list[i].id+'">\n' +
                        '        <td>'+(i+1)+'</td>\n' +
                        '        <td>'+list[i].game_name+'</td>\n' +
                        '        <td> <button type="button" class="btn btn-danger delete_game" >删除</button></td>\n' +
                        '    </tr>'
                }
                $('#t_slide_game').append(html)
            }else {

            }
        }
    });

   $("#add_slide_game_btn").click(function () {
       if($("#slide_game_select").val()){
           var gameId=$("#slide_game_select").val();
           $.ajax({
               url: config.ip+'/adminNews/addSlideGame',
               data:{game_id:gameId},
               type:'get',
               success:function (data) {
                   // data.state==1?Ewin.alert("插入数据库成功").on(function (r) {
                   //     r && window.location.reload()
                   // }):data.state==2?Ewin.alert("此游戏已存在"):Ewin.alert("插入数据库失败")
                   data.state==1 ? Ewin.alert("插入数据库成功").on(function (r) {
                       r && window.location.reload()
                   }) : data.state==2 ? Ewin.alert("此游戏已存在") : Ewin.alert("插入数据库失败")
               }
           })
       }else {
           Ewin.alert('请选择游戏')
       }
   });
    $("#game_name_inp").bind('input propertychange',function () {
        $.ajax({
            url:config.ip+"/admin/searchGameByMsg",
            type:"get",
            data:{msg:$(this).val(),type:"game_name"},
            success:function (data) {
                var game=data.game;
                var html="";
                for(var i=0;i<game.length;i++){

                    html+='<option value="'+game[i].id+'" selected="">'+game[i].game_name+'</option>';
                }
                $("#slide_game_select").empty();
                $("#slide_game_select").append('<option value="0" selected="selected"></option>');
                $("#slide_game_select").append(html);
                $("#slide_game_select").val(0);
            }
        });
    });
    $("#t_slide_game").on("click",".delete_game",function () {
        $.ajax({
            url:config.ip+"/adminNews/deleteSlideGameById",
            type:"get",
            data:{id:$(this).parents("tr").attr("data-id")},
            success:function (data) {
                data.state ? Ewin.alert("删除成功！").on(function (r) {
                    r && window.location.reload()
                }) : Ewin.alert("删除失败！")
            }
        })
    })
});