var page=1;
$(function () {

    var gameId=0;
    if(sessionStorage.getItem("jurisdiction")==1){
        var url=config.ip+'/admin/game'
    }else {
        var url=config.ip+'/admin/gameAdmin'
    }
    $.ajax({
        url: url,
        type: 'GET',
        data: {start:page,id:sessionStorage.getItem("uid")},
        success:function (data) {
            initTable(data)
        }
    }).done(function(res) {
    }).fail(function(res) {});

    $(".pagination").on("click",".pageIndex",function () {
        page=$(this).text();
        var t=$(this);
        // console.log(page);
        $.ajax({
            url: url,
            type: 'GET',
            data: {start:page,id:sessionStorage.getItem("uid")},
            success:function (data) {
                // console.log(data);
                // $(".pagination>button").removeClass("active");
                t.addClass("active");
                initTable(data)
            }
        })
    });
    $('#choPageBtn').click(function () {
        page=$('#choPage').val() || 1;
        $.ajax({
            url: url,
            type: 'GET',
            data: {start:page,id:sessionStorage.getItem("uid")},
            success:function (data) {
                // console.log(data);
                // $(".pagination>button").removeClass("active");
                initTable(data)
            }
        })
    });
    $("#search_btn").click(function () {
        search()
    });
    document.onkeydown=function(event)
    {
        e = event ? event :(window.event ? window.event : null);
        if(e.keyCode==13){
            search();
            return false;
        }
    };

    $('#type_radio input[type=radio]').change(function () {
        $('#'+$(this).val()).removeClass('hidden').siblings('.type_checkbox').addClass('hidden');
    });
    $('#game_table').on('click','.edit_game',function () {
        gameId=$(this).attr('data-id');
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
    $('#game_table').on('click','.tag',function () {
        gameId=$(this).attr('data-id');
        getTag();
        tagTableInit(gameId)
    });
    $('#edit_msg_btn').click(function () {
        var data=JSON.parse(sessionStorage.getItem('editMsg'));
        for(var key in data){
            $('#'+key).val(data[key])
        }
        $("#edit_choose").modal('hide');
        $("#edit_msg_model").modal('show');
    });
    $('#edit_file_btn').click(function () {
        var data=JSON.parse(sessionStorage.getItem('editMsg'));
        $('#edit_game_name').text(data.ed_name);
        $('#edit_game_name').attr('data-id',data.id);
        $("#edit_choose").modal('hide');
        setTimeout(function () {
            $("#edit_file_model").modal('show');
        },500)
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

    $("#add_game_btn").click(function () {
        var data={};
        if($("#choose_sys").val()==2){
            data = {
                gameName:$("#add_game_form input[name=game_name]").val(),
                gameUrlScheme:""||null,
                gamePackagename:$("#add_game_form input[name=gamePackagename]").val()||null,
                gameDownloadIos:""||null,
                gameRecommend:$("#add_game_form input[name=game_one]").val()||null,
                gameVersion:$("#add_game_form input[name=game_version]").val()||null,
                gameCompany:$("#add_game_form input[name=game_cmp]").val()||null,
                sys:$("#choose_sys").val()||null,
                updateDetail:$("#add_game_form input[name=update_msg]").val()||null,
                gameDetail:$("#add_game_form input[name=game_msg]").val()||null,
                admin:sessionStorage.getItem("uid"),
                type:$("#type_radio input[type=radio]:checked").val()
            }
        }else {
            data = {

            }
        }
        var checkArr=[];
        $('#'+$("#type_radio input[type=radio]:checked").val()+' input[type=checkbox]:checked').each(function (item) {
            checkArr.push($(this).attr('value'))
        });
        data.cls=checkArr.join();
        $.ajax({
            type:"get",
            url:config.ip+'/adminGame/addGameMsg',
            data:data,
            success:function (data) {
                console.log(data.state);
                if(data.state==1){
                    Ewin.alert("添加游戏信息成功，请添加游戏图片&安装包").on(function (r) {
                        r && window.location.reload()
                    })
                }else if(data.state==4){
                    Ewin.alert("游戏存在！")
                }
                else {
                    Ewin.alert("添加游戏信息失败！")
                }
            }
        })
    });
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
    });
    $('#edit_game_pack_btn').click(function () {
        var key= 'game/gameId'+ gameId+".apk";
        var id=$('#edit_game_name').attr('data-id');
        $.ajax({
            scriptCharset: 'utf-8',
            url: config.ip+'/admin/getUptokenByMsg',
            data:{scope:'oneyouxiapk',key:key},
            type:'get',
            success:function (data) {
                uploadQiniu({
                    file:$("#game_pack").get(0).files[0],
                    key:key,
                    token:data.upToken,
                    error:function (data) {
                        Ewin.alert("上传七牛出错！")
                    },
                    next:function (data) {
                        $('#edit_game_pack_btn').attr('data-re',data.total.percent.toFixed(1)+'%');
                        console.log(data);
                    },
                    success:function (data) {
                        $.ajax({
                            url: config.ip+'/adminGame/updateDownloadAndroid',
                            data:{id:id,url:data.key,size:(data.fsize/1024/1024).toFixed(1)},
                            type:'get',
                            success:function (data) {
                                if(data.state){
                                    Ewin.alert('安装包上传成功，信息插入数据库成功')
                                }else {
                                    Ewin.alert('安装包信息插入数据库失败')
                                }
                            }
                        });
                    }
                })
            }
        })
    });
    $('#edit_game_img_btn').click(function () {
        var id=$('#edit_game_name').attr('data-id');
        $.when( updateIcon('game/gameId'+gameId+"/icon",id,$("#game_icon").get(0).files[0]), updateTitleImg('game/gameId'+gameId+"/titleImg",id,$("#title_img").get(0).files[0]) ).done(function(res1, res2){
            $.ajax({
                url: config.ip+'/adminGame/deleteGameImg',
                data:{id:id},
                type:'get',
                success:function (data) {
                    if(data.state){
                        var file = document.getElementById('game_img_list').files;
                        for(var i=0;i<file.length;i++){
                            addGameImg('game/gameId'+gameId+"/list"+i,id,file[i])
                        }
                        Ewin.alert('上传成功');
                    }else {
                        Ewin.alert('上传截图失败（缺少id）');
                    }
                }
            })

        })
    });
    $('#add_tag_btn').click(function () {
        var tagId=$('#tag_game_select').val();
        if(tagId){
            $.ajax({
                type:'get',
                url:config.ip+'/adminGame/addTagByGame',
                data:{
                    tagId:tagId,
                    gameId:gameId
                },
                success:function (data) {
                    if(data.state){
                        Ewin.alert('添加成功').on(function (r) {
                            r && tagTableInit(gameId)
                        })
                    }else {
                        Ewin.alert('添加失败！')
                    }
                }
            })
        }else {
            Ewin.alert('选择标签')
        }
    });
    $('#tag_game').on('click',".delete_tag",function () {
        $.ajax({
            type:"get",
            url:config.ip+'/adminGame/deleteTagById',
            data:{id:$(this).attr('data-id')},
            success:function (data) {
                if(data.state){
                    tagTableInit(gameId);
                    Ewin.alert('删除成功')
                }else {
                    Ewin.alert('删除失败')
                }
            }
        })
    })
});
function updateIcon(key,id,file) {
    var dfd = $.Deferred();
    $.ajax({
        scriptCharset: 'utf-8',
        type:'get',
        url: config.ip+'/admin/getUptokenByMsg',
        data:{scope:'oneyouxiimg',key:key},
        success:function (data) {
            uploadQiniu({
                file:file,
                key:key,
                token:data.upToken,
                success:function (data) {
                    $.ajax({
                        url: config.ip+'/adminGame/updateGameIcon',
                        data:{id:id,url:data.key},
                        type:'get',
                        success:function (data) {
                            if(data.state){
                                dfd.resolve();
                            }else {
                            }
                        }
                    });
                },
                error:function (data) {
                    console.log(data);
                }
            })
        }
    });
    return dfd.promise;
}
function updateTitleImg(key,id,file) {
    var dfd = $.Deferred();
    $.ajax({
        scriptCharset: 'utf-8',
        type:'get',
        url: config.ip+'/admin/getUptokenByMsg',
        data:{scope:'oneyouxiimg',key:key},
        success:function (data) {
            uploadQiniu({
                file:file,
                key:key,
                token:data.upToken,
                success:function (data) {
                    $.ajax({
                        url: config.ip+'/adminGame/updateGameTitleImg',
                        data:{id:id,url:data.key},
                        type:'get',
                        success:function (data) {
                            if(data.state){
                                dfd.resolve();
                            }else {
                            }
                        }
                    });
                }
            })
        }
    });
    return dfd.promise;
}
function addGameImg(key,id,file) {
    var dfd = $.Deferred();
    $.ajax({
        scriptCharset: 'utf-8',
        type:'get',
        url: config.ip+'/admin/getUptokenByMsg',
        data:{scope:'oneyouxiimg',key:key},
        success:function (data) {
            uploadQiniu({
                file:file,
                key:key,
                token:data.upToken,
                success:function (data) {
                    console.log(data);
                    $.ajax({
                        url: config.ip+'/adminGame/addGameImg',
                        data:{id:id,url:data.key},
                        type:'get',
                        success:function (data) {
                            if(data.state){
                                dfd.resolve();
                            }else {
                            }
                        }
                    });
                }
            })
        }
    });
    return dfd.promise;
}


function initTable(data) {
    var game=data.game;
    // var cls=data.cls;
    var html='';
    if(data.cls){
        if(data.cls[0].co){
            var len=Math.ceil(data.cls[0].co/30);
            // len=len;
            // var li='';
            // $(".pagination").empty();
            // for(var i=0;i<len;i++){
            //    li+='<button>'+(i+1)+'</button>';
            // }
            // $(".pagination").append(li);
            // $(".pagination").show()
            initPage(len)
        }
    }else {
        $(".pagination").hide()
    }
    for (var i=0,j=game.length;i<j;i++){
        var gameCls="";
        if(game[i].sys==1){
            var sys='iOS'
        }else {
            var sys='Andriod';
        }
        html+='<tr>\n' +
            '        <td>'+((page-1)*30+(i+1))+'</td>\n' +
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
            '        <td class="tb_game_sort">'+(game[i].sort ? game[i].sort:0)+'</td>\n' +
            '        <td class="tb_game_sort2">'+(game[i].sort2 ? game[i].sort2:0)+'</td>\n' +
            '        <td class="">'+game[i].comment+'</td>\n' +
            '        <td>\n' +
            '            <button type="button" class="btn btn-primary edit_game" data-id="'+game[i].id+'">编辑</button>\n' +
            '            <button type="button" class="btn btn-primary tag" data-id="'+game[i].id+'">标签</button>\n' +
            '            <button type="button" class="btn btn-danger delete_game" data-id="'+game[i].id+'">删除</button>\n' +
            '        </td>\n' +
            '    </tr>'
    }
    $('#game_table').empty();
    $('#game_table').append(html);
}
function search() {
    if($("#search_input").val()==""){
        // window.location.reload()
    }else {
        $.ajax({
            url: config.ip+'/admin/searchGameByMsg',
            type: 'GET',
            data: {type:"game_name",msg:$("#search_input").val()},
            success:function (data) {
                initTable(data)
            }
        })
    }
};
function uploadQiniu(options) {
    /*
    option:{
         file:octet-stream
         key:string
         token:string
         next:fn
         error:fn
         success:fn
    }
     */
    var file=options.file || null,
        key=options.key || null,
        token=options.token || null,
        next=options.next || null,
        error=options.error || null,
        success=options.success || null,
        putExtra = {
            fname: "",
            params: {},
            mimeType:null
        },
        config = {
            useCdnDomain: true,
            region:'z2',
            disableStatisticsReport: false
        },
        subObject = {
            next: next,
            error: error,
            complete: success
        },
        observable = qiniu.upload(file, key, token, putExtra, config);
    subscription = observable.subscribe(subObject) // 上传开始
};
function getTag() {
    $.ajax({
        url:config.ip+"/adminGame/getTag",
        type:"get",
        data:{},
        success:function (data) {
            var tag=data.tag;
            var html="";
            for(var i=0;i<tag.length;i++){
                html+='<option value="'+tag[i].id+'" selected="">'+tag[i].name+'</option>';
            }
            $("#tag_game_select").empty();
            $("#tag_game_select").append('<option value="0" selected="selected"></option>');
            $("#tag_game_select").append(html);
            $("#tag_game_select").val(0);
            $('#tag_model').modal('show');
        }
    });
};
function tagTableInit(gameId) {
    $.ajax({
        type:'get',
        url:config.ip+'/adminGame/getTagByGame',
        data:{
            gameId:gameId
        },
        success:function (data) {
            if(data.state){
                var tag=data.tag;
                var html='';
                for (var i=0,l=tag.length;i<l;i++){
                    html += ' <tr>\n' +
                        '                    <td>'+(i+1)+'</td>\n' +
                        '                    <td>'+tag[i].name+'</td>\n' +
                        '                    <td> <button type="button" class="btn btn-danger delete_tag" data-id="'+tag[i].tagRelationId+'">移除</button></td>\n' +
                        '                    </tr>'
                }
                $('#tag_game').empty();
                $('#tag_game').append(html)
            }else {
                Ewin.alert('获取标签失败')
            }
        }
    })
};
function initPage(len) {
    if(len<=5){
        var li='';
        $(".pagination").empty();
        for(var i=0;i<len;i++){
            li+='<button>'+(i+1)+'</button>';
        }
        $(".pagination").append(li);
        $(".pagination").show()
    }else {
        var li='';
        $(".pageIndex").remove();
        for(var i=0;i<len;i++){
            if(i<5){
                li+='<button class="pageIndex">'+(i+1)+'</button>';
            }
        }
        $('#allPageNum').text('总页数：'+len);
        $(".pagination").append(li);
        $(".pagination").show()
    }

}