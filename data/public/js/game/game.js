$(function () {


    console.log(config.ip);
    if(sessionStorage.getItem("jurisdiction")==1){
        var url=config.ip+'/admin/game'
    }else {
        var url=config.ip+'/admin/gameAdmin'
    }
    $.ajax({
        url: url,
        type: 'GET',
        data: {start:0,id:sessionStorage.getItem("uid")},
        success:function (data) {
            // console.log(data);
            var game=data.game;
            var cls=data.cls;
            var html='';
            for (var i=0,j=game.length;i<j;i++){
                var gameCls="";
                if(game[i].sys==1){
                    var sys='iOS'
                }else {
                    var sys='Andriod';
                }

                for(var k=0,l=cls.length;k<l;k++){
                    if(cls[k].game_id==game[i].id){
                        if(cls[k].cls_id=='1'){
                            gameCls='单机'
                        }else if(cls[k].cls_id=='2'){
                            gameCls='网游'
                        }else if(cls[k].cls_id=='3'){
                            gameCls='应用'
                        }
                    }
                }

                html+='<tr>\n' +
                    '        <td>'+(i+1)+'</td>\n' +
                    '        <td class="tb_game_name">'+game[i].game_name+'</td>\n' +
                    '        <td class="tb_game_id">'+game[i].id+'</td>\n' +
                    '        <td class="tb_game_activation">'+game[i].activation+'</td>\n' +
                    '        <td class="tb_game_gameCls">'+gameCls+'</td>\n' +
                    '        <td class="">'+sys+'</td>\n' +
                    '        <td class="">'+game[i].add_time+'</td>\n' +
                    '        <td class="tb_game_company">'+game[i].game_company+'</td>\n' +
                    '        <td class="tb_game_version">'+game[i].game_version+'</td>\n' +
                    '        <td class="tb_game_download_num">'+game[i].game_download_num+'</td>\n' +
                    '        <td class="tb_game_size">'+game[i].game_size+'MB</td>\n' +
                    '        <td class="tb_game_sort">'+(game[i].sort?game[i].sort:0)+'</td>\n' +
                    '        <td class="tb_game_sort2">'+(game[i].sort2?game[i].sort2:0)+'</td>\n' +
                    '        <td class="">'+game[i].comment+'</td>\n' +
                    '        <td>\n' +
                    '            <button type="button" class="btn btn-primary edit_game" >编辑</button>\n' +
                    '            <button type="button" class="btn btn-danger delete_game" >删除</button>\n' +
                    '        </td>\n' +
                    '    </tr>'
            }
            $('#game_table>tr').remove();
            $('#game_table').append(html);
        }
    }).done(function(res) {
    }).fail(function(res) {});
    $('#type_radio input[type=radio]').change(function () {
        $('#'+$(this).val()).removeClass('hidden').siblings('.type_checkbox').addClass('hidden');
    });
    $('#game_table').on('click','.edit_game',function () {
        var t=$(this);
        function getText(el) {
            return t.parents('td').siblings(el).text();
        }
        var obj ={
            ed_name:getText('.tb_game_name'),
            ed_activation:getText(".tb_game_activation"),
            ed_company:getText(".tb_game_company"),
            ed_version:getText(".tb_game_version"),
            ed_download_num:getText(".tb_game_download_num"),
            ed_size:getText(".tb_game_size"),
            ed_sort:getText(".tb_game_sort"),
            ed_sort2:getText(".tb_game_sort2"),
            id:getText(".tb_game_id")
        };
        sessionStorage.setItem('editMsg',JSON.stringify(obj));
        $("#edit_choose").modal('show');
    });

    $('#game_table').on('click','.delete_game',function () {
        var t=$(this);
        var gname=$.trim($(this).parents('td').siblings('.tb_game_name').text());
        var gid=$.trim($(this).parents('td').siblings('.tb_game_id').text());
        Ewin.confirm({ message: "确认要删除选择的游戏吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {

                $.ajax({
                    url: config.ip+'/admin/gameMsg',
                    type: 'GET',
                    data:{id:gid,name:gname},
                    success:function (data) {
                        if(data.game){
                            $.ajax({
                                url: config.ip+'/admin/deleteGame',
                                type: 'GET',
                                data:{id:gid,name:gname},
                                success:function (data) {
                                    console.log(data);
                                    if(data.state==1){
                                        // t.parents('tr').remove();
                                        window.location.reload();
                                    }else {

                                    }
                                }
                            })
                        }else {
                            window.location.reload();
                        }
                    }
                })
            }
        });
    });
    $('#edit_msg_btn').click(function () {
        var data=JSON.parse(sessionStorage.getItem('editMsg'));
        for(var key in data){
            $('#'+key).val(data[key])
        }
        $("#edit_choose").modal('hide');
        $("#edit_msg_model").modal('show');
    });
    $('#search_cls>li').click(function () {
        $("#search_text").text($(this).find('a').text())
    });
    $('#choose_sys').change(function () {
        if($(this).val()==1){
            $('#sys_text').attr('placeholder','输入App Store下载地址');
            $('#sys_text').val('');
            $('#form_pack').hide();
        }else {
            $('#sys_text').attr('placeholder','输入游戏安装后的包名(游戏商提供)');
            $('#sys_text').val('');
            $('#form_pack').show();
        }
    });
    $('#add_game_btn').click(function () {
        if($("#choose_sys").val()==1){
            if($('#game_img_list').get(0).files.length<3||$('#game_img_list').get(0).files.length>10||$('#title_img').get(0).files.length!=1||$('#game_icon').get(0).files.length!=1){
                alert('请按规则填写！');
                return;
            }
        }else {
            if((!verriFrom('#add_game_form'))||$('#game_img_list').get(0).files.length<3||$('#game_img_list').get(0).files.length>10||$('#game_pack').get(0).files.length!=1||$('#title_img').get(0).files.length!=1||$('#game_icon').get(0).files.length!=1){
                alert('请按规则填写！');
                return;
            }
        }
        var formData = new FormData($('#add_game_form')[0]);
        var file = document.getElementById('game_img_list').files;
        for(var i=0;i<file.length;i++){
            formData.append("game_list"+i, file[i]); //++++++++++
        }
        var checkArr=[];
        console.log($("#type_radio input[type=radio]:checked").val());
        $('#'+$("#type_radio input[type=radio]:checked").val()+' input[type=checkbox]:checked').each(function (item) {
            checkArr.push($(this).attr('value'))
        });
        formData.append('pack',$('#game_pack').get(0).files[0]);
        formData.append('cls',checkArr);
        formData.append("admin",sessionStorage.getItem('uid'));
        parent.waiting("show");
        $.ajax({
            url: config.ip+'/admin/add/game',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success:function (data) {
                console.log(data.state);
                if(data.state==1){
                    parent.waiting("hide");
                    $('#add_game_model').modal('hide');
                    clearFrom('#add_game_model');

                    Ewin.alert('上传成功').on(function (r) {
                        if(r){
                            window.location.reload()
                        }
                    })
                }
            }
        }).done(function(res) {
        }).fail(function(res) {});
    })
    $('#edit_game_msg_btn').click(function () {
        var formData = new FormData($('#edit_game_msg_form')[0]);
        var data=JSON.parse(sessionStorage.getItem('editMsg'));
        formData.append("id",data.id);
        $.ajax({
            url: config.ip+'/admin/edit/game',
            type: 'post',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success:function (data) {
                console.log(data.state);
                if(data.state){
                    $('#edit_msg_model').modal('hide');
                    Ewin.alert('修改成功').on(function (r) {
                        if(r){
                            window.location.reload()
                        }
                    })
                }else {
                    $('#edit_msg_model').modal('hide');
                    Ewin.alert('修改失败').on(function (r) {
                        if(r){
                            window.location.reload()
                        }
                    })
                }
            }
        }).done(function(res) {
        }).fail(function(res) {});
    })
});

function verriFrom(el) {
    var flag=true;
    $(el).find('input[type=text],textarea').each(function () {
        if($.trim($(this).val())==''||$.trim($(this).val())==null){
            flag=false;
            return false
        }
    });
    $(el).find('input[type=file]').each(function () {
        if($(this).get(0).files.length==0){
            flag=false;
            return false
        }
    });
    $(el).find('input[type=checkbox]:checked').length>0||(flag=false);

    return flag;
}

function clearFrom(el) {
    $(el).find('.file').val('');
    $(el).find('input,textarea').val('');
    $(el).find('input[type=checkbox]').attr('checked',false);
}