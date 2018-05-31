$(function () {

    $.ajax({
        type:"get",
        url:config.ip+"/adminNews/getHeadGame",
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
                $('#t_head_game').append(html)
            }else {

            }
        }
    });
    $("#add_head_game_btn").click(function () {
        if($("#head_game_select").val() && $("#head_game_img").get(0).files.length){
            var gameId=$("#head_game_select").val();
            var imgFile=$("#head_game_img").get(0).files[0];
            var imgkey='news/headGame/'+gameId;
            $.ajax({
                url: config.ip+'/admin/getUptokenByMsg',
                data:{scope:'oneyouxiimg',key:imgkey},
                type:'get',
                success:function (data) {

                    uploadQiniu(imgFile,imgkey,data.upToken,function (next) {
                        // console.log(next);
                    },function (error) {
                        // console.log(error);
                        Ewin.alert('上传头图失败');
                    },function (complete) {
                        // console.log(complete);
                        $.ajax({
                            url: config.ip+'/adminNews/addHeadGame',
                            data:{game_id:gameId,img:complete.key},
                            type:'get',
                            success:function (data) {
                                data.state==1?Ewin.alert("插入数据库成功").on(function (r) {
                                    r && window.location.reload()
                                }):data.state==2?Ewin.alert("此游戏已存在"):Ewin.alert("插入数据库失败")
                            }
                        })
                    })
                }
            })
        }else {
            Ewin.alert('请填入内容')
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
                $("#head_game_select").empty();
                $("#head_game_select").append('<option value="0" selected="selected"></option>');
                $("#head_game_select").append(html);
                $("#head_game_select").val(0);
            }
        });
    });
    $("#t_head_game").on("click",".delete_game",function () {
        console.log($(this).parents("tr").attr("data-id"));
        $.ajax({
            url:config.ip+"/adminNews/deleteHeadGameById",
            type:"get",
            data:{id:$(this).parents("tr").attr("data-id")},
            success:function (data) {
                console.log(data);
                data.state ? Ewin.alert("删除成功！").on(function (r) {
                    r && window.location.reload()
                }) : Ewin.alert("删除失败！")
            }
        })
    })
});
function uploadQiniu(file, key,token,nextCb,errorCb,completeCb) {
//           var token='Uusbv77fI10iNTVF3n7EZWbksckUrKYwUpAype4i:fxYy4f3R75-yc2UgLsFXv2P0KFA=:eyJyZXR1cm5Cb2R5Ijoie1wia2V5XCI6XCIkKGtleSlcIixcImhhc2hcIjpcIiQoZXRhZylcIixcImZzaXplXCI6JChmc2l6ZSksXCJidWNrZXRcIjpcIiQoYnVja2V0KVwiLFwibmFtZVwiOlwiJCh4Om5hbWUpXCJ9Iiwic2NvcGUiOiJvbmV5b3V4aTp0ZXN0IiwiZGVhZGxpbmUiOjE1MjE0NDM5MjF9';
    var next=function (res) {
        nextCb(res);
    };
    var error = function (err) {
        errorCb(err);
    };
    var complete = function (res) {
        completeCb(res);
    };
    var putExtra = {
        fname: "",
        params: {},
        mimeType:null
    };
    var config = {
        useCdnDomain: true,
        region:'z2',
        disableStatisticsReport: false
    };
//           var file = this.files[0];
//           var key = 'test';
    var subObject = {
        next: next,
        error: error,
        complete: complete
    };
    var observable = qiniu.upload(file, key, token, putExtra, config);
    var subscription = observable.subscribe(subObject) // 上传开始
}