$(function () {
    var subjectId=0;
    $.ajax({
        type:'get',
        url:config.ip+'/adminGame/getSubject',
        data:'',
        success:function (data) {
            if(data.state){
                var sub=data.subject;
                var html='';
                for (var i=0,l=sub.length;i<l;i++){
                    html+='<tr data-sys="'+sub[i].sys+'">\n' +
                        '            <td>'+i+1+'</td>\n' +
                        '            <td>'+sub[i].id+'</td>\n' +
                        '            <td>'+sub[i].title+'</td>\n' +
                        '            <td>'+sub[i].detail+'</td>\n' +
                        '            <td>'+['未激活','激活'][sub[i].active]+'</td>\n' +
                        '            <td>http://img.oneyouxi.com.cn/'+sub[i].img+'</td>\n' +
                        '            <td class="sys">'+['通用','ios','android'][sub[i].sys]+'</td>\n' +
                        '        <td>   <button type="button" class="btn btn-primary add_subject_game" data-id="'+sub[i].id+'">添加游戏</button> <button type="button" class="btn btn-danger delete_subject"  data-id="'+sub[i].id+'">删除</button>' +
                        // '<button type="button" class="btn btn-primary edit_subject" style="margin-left: 5px"  data-id="'+sub[i].id+'">编辑</button>' +
                        '</td>\n' +
                        '</tr>'
                }
                $('#subject_table_body').append(html)
            }
        }
    });

    $("#add_subject_btn").click(function () {
        function getValByName(name) {
            return $('#add_subject_form input[name='+name+']').val()
        }
        if(getValByName('title') && getValByName('detail') && getValByName('active') && $('#subject_img').get(0).files.length==1){
            var sys=$('#add_subject_form input[name="sys"]:checked').val();
            getUpToken('oneyouxiimg','subject/'+getValByName('title'),function (res) {
                if(res.state){
                    uploadQiniu({
                        file:$('#subject_img').get(0).files[0],
                        key:'subject/'+getValByName('title'),
                        token:res.upToken,
                        error:function (err) {
                            Ewin.alert(err)
                        },
                        success:function (data) {
                            $.ajax({
                                url:config.ip+"/adminGame/addSubject",
                                type:"get",
                                data:{
                                    title:getValByName('title'),
                                    detail:getValByName('detail'),
                                    active:getValByName('active'),
                                    sys:sys,
                                    img:data.key
                                },
                                success:function (data) {
                                    if(data.state){
                                        Ewin.alert('插入数据库成功').on(function (r) {
                                            if(r){
                                                window.location.reload()
                                            }
                                        })
                                    }else {
                                        Ewin.alert('插入数据库失败')
                                    }
                                }
                            })
                        }
                    })
                }else {
                    Ewin.alert('获取token失败')
                }
            })
        } else {
            Ewin.alert('缺少数据')
        }
    });
    $('#subject_table_body').on('click','.add_subject_game',function () {
        subjectId=$(this).attr('data-id');
        initSubjectGame(subjectId);
        $.ajax({
            url:config.ip+"/admin/gameName",
            type:"get",
            data:{sys:$(this).parents('tr').attr('data-sys')},
            success:function (data) {
                var game=data.name;
                var html="";
                for(var i=0;i<game.length;i++){
                    html+='<option value="'+game[i].id+'" selected="">'+game[i].game_name+'</option>';
                }
                $("#subject_game_select").empty();
                $("#subject_game_select").append('<option value="0" selected="selected"></option>');
                $("#subject_game_select").append(html);
                $("#subject_game_select").val(0);
                $('#add_game_model').modal('show');
            }
        });
    });
    $('#subject_table_body').on('click','.delete_subject',function () {
        subjectId=$(this).attr('data-id');
        $.ajax({
            type:"get",
            url:config.ip+"/adminGame/deleteSubject",
            data:{
                subjectId:subjectId
            },
            success:function (data) {
                if(data.state){
                    Ewin.alert('删除成功').on(function (r) {
                        r && window.location.reload();
                    })
                }else {
                    Ewin.alert('删除失败')
                }
            }
        })
    });
    $('#add_subject_game_btn').click(function () {
        var gameId=$('#subject_game_select').val();
        if(gameId){
            $.ajax({
                type:'get',
                url:config.ip+'/adminGame/addSubjectGame',
                data:{
                    gameId:gameId,
                    subjectId:subjectId
                },
                success:function (data) {
                    if(data.state){
                        Ewin.alert('添加成功').on(function (r) {
                            r && initSubjectGame(subjectId);
                        })
                    }else {
                        Ewin.alert('添加失败')
                    }
                }
            })
        }else {
            Ewin.alert('选择游戏')
        }
    });
    $('#subject_game').on('click','.delete_game',function () {
        var id =$(this).attr('data-id');
        if (id){
            $.ajax({
                type:'get',
                url:config.ip+'/adminGame/deleteSubjectGame',
                data:{id:id},
                success:function (data) {
                    if(data.state){
                        Ewin.alert('删除成功').on(function (r) {
                            r && initSubjectGame(subjectId)
                        })
                    }else {
                        Ewin.alert('删除失败')
                    }
                }
            })
        }
    });
    $("#subject_name_inp").bind('input propertychange',function () {
        if($(this).val()){
            $.ajax({
                url:config.ip+"/adminGame/getGameName",
                type:"get",
                data:{msg:$(this).val(),sys:2},
                success:function (data) {
                    var game = data.name;
                    $("#subject_game_select option").remove();
                    $("#subject_game_select").append("<option value=''></option>");
                    for (var i = 0, j = game.length; i < j; i++) {
                        $("#subject_game_select").append("<option value='"+game[i].id+"' data-text='"+game[i].game_name+"'>"+game[i].game_name+"</option>");
                    }
                }
            });
        }else {
            return
        }
    })
});

function initSubjectGame(id) {
    $.ajax({
        type:'get',
        url:config.ip+'/adminGame/getSubjectGame',
        data:{id:id},
        success:function (data) {
            if(data.state){
                var html='';
                var subject=data.game;
                for (var i=0,l=subject.length;i<l;i++){
                    html +='<tr data-id="'+subject[i].relationId+'">\n' +
                        '                        <td>'+(i+1)+'</td>\n' +
                        '                        <td>'+subject[i].title+'</td>\n' +
                        '                        <td>'+subject[i].game_name+'</td>\n' +
                        '                        <td><button type="button" class="btn btn-danger delete_game" data-id="'+subject[i].relationId+'">移除</button></td>\n' +
                        '                    </tr>'
                }
                $('#subject_game').empty();
                $('#subject_game').append(html);
            }
        }
    })
}

function getUpToken(bucket,key,callback) {
    $.ajax({
        url: config.ip+'/admin/getUptokenByMsg',
        data:{scope:bucket,key:key},
        type:'get',
        success:function (data) {
            return callback(data)
        }
    })
}