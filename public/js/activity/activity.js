$(function () {
    $.ajax({
        url: config.ip+'/admin/active',
        type: 'GET',
        data: {start: 0},
        success: function (data) {
            var active = data.active;
            var html = '';
            var active_state = '';
            var type = '';
            for (var i = 0, j = active.length; i < j; i++) {
                if(active[i].active != '1'){
                    active_state = '不激活'
                }else {
                    active_state = '激活'
                }
                if(active[i].type == '4'){
                    type = '首页推荐位'
                }else if(active[i].type == '1'){
                    type = '首页轮播推荐位'
                }else if(active[i].type == '5'){
                    type = '推荐位（横向2个）'
                }else if (active[i].type == '6'){
                    type = '推荐位（竖排10个）'
                }

                html += '<tr>\n' +
                    '        <td>' + (i + 1) + '</td>\n' +
                    '        <td class="tb_id">' + active[i].id + '</td>\n' +
                    '        <td class="tb_name">' + active[i].name + '</td>\n' +
                    '        <td class="tb_title">' + active[i].title + '</td>\n' +
                    '        <td class="tb_sort">' + active[i].sort + '</td>\n' +
                    '        <td class="tb_active_img">' +"http://img.oneyouxi.com.cn/"+ active[i].active_img + '</td>\n' +
                    '        <td class="tb_active">' + active_state + '</td>\n' +
                    '        <td class="tb_active">' + type + '</td>\n' +
                    '        <td>\n' +
                    '            <button type="button" class="btn btn-primary edit_activity" >编辑</button>\n' +
                    '            <button type="button" class="btn btn-danger delete_activity" data-id="'+active[i].id+'">删除</button>\n' +
                    '        </td>\n' +
                    '    </tr>'
            }
            $('#activity_table>tr').remove();
            $('#activity_table').append(html);
        }
    });
    gameNameInit();
    $('#add_activity_form input[name="sys"]').change(function () {
        gameNameInit()
    });

    $('#search_cls>li').click(function () {
        $("#search_text").text($(this).find('a').text())
    });

    $('#activity_table').on('click','.edit_activity',function () {
        var t=$(this);
        function getText(el) {
            return t.parents('td').siblings(el).text();
        }

        var obj ={
            ed_name:getText('.tb_name'),
            ed_title:getText(".tb_title"),
            ed_sort:getText(".tb_sort"),
            ed_address:getText(".tb_address")
        };
        sessionStorage.setItem('editMsg',JSON.stringify(obj));
        $("#edit_choose").modal('show');
    });

    $('#activity_table').on('click','.delete_activity',function () {

        var id=$(this).attr('data-id');
        Ewin.confirm({ message: "确认要删除吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                console.log(1);
                $.ajax({
                    url: config.ip+'/adminGame/deleteActiveById',
                    type: 'GET',
                    data:{activityId:id},
                    success:function (data) {
                        if(data.state==1){
                            Ewin.alert('删除成功').on(function (r) {
                                r && window.location.reload()
                            })
                        }else {

                        }
                    }
                })
            }
        });
    });
    $('#add_activity_form input[name=type]').change(function () {
        if($('#add_activity_form input[name=type]:checked').val()=='6' || $('#add_activity_form input[name=type]:checked').val()=='5'){
            $('#active1').addClass('hidden')
        }else {
            $('#active1').removeClass('hidden')
        }
    });
    $('#add_activity_btn').click(function () {
        if($('#add_activity_form input[name=type]:checked').val()=='1' || $('#add_activity_form input[name=type]:checked').val()=='4'){
            if(!$('#game_text').val() || $('#activity_img').get(0).files.length != 1){
                Ewin.alert('必须选择游戏和传输图片');
                return;
            }
            var key = 'activity/activityType'+$('#add_activity_form input[name=type]:checked').val()+'/gameId'+$('#choose_game').val();
            $.ajax({
                type:'get',
                url:config.ip+'/admin/getUptokenByMsg',
                data:{scope:'oneyouxiimg',key:key},
                success:function (data) {
                    uploadQiniu({
                        file:$('#activity_img').get(0).files[0],
                        key:key,
                        token:data.upToken,
                        error:function () {
                            Ewin.alert('上传七牛云失败')
                        },
                        success:function (data) {
                            $.ajax({
                                type:'get',
                                url:config.ip+'/adminGame/addGameActive',
                                data:{
                                    name:$('#add_activity_form input[name="name"]').val(),
                                    title:$('#add_activity_form input[name="title"]').val(),
                                    sort:$('#add_activity_form input[name="sort"]').val(),
                                    active:$('#add_activity_form input[name="active"]').val(),
                                    game_id:$('#choose_game').val(),
                                    active_img:data.key,
                                    type:$('#add_activity_form input[name=type]:checked').val(),
                                    sys:$('#add_activity_form input[name=sys]:checked').val(),
                                },
                                success:function (data) {
                                    if(data.state){
                                        Ewin.alert('添加成功');
                                    }else {
                                        Ewin.alert('添加失败');
                                    }
                                }
                            })
                        }
                    })
                }
            });
        }else {
            $.ajax({
                type:'get',
                url:config.ip+'/adminGame/addGameActive',
                data:{
                    name:$('#add_activity_form input[name="name"]').val(),
                    title:$('#add_activity_form input[name="title"]').val(),
                    sort:$('#add_activity_form input[name="sort"]').val(),
                    active:$('#add_activity_form input[name="active"]').val(),
                    game_id:$('#choose_game').val(),
                    active_img:"",
                    type:$('#add_activity_form input[name=type]:checked').val(),
                    sys:$('#add_activity_form input[name=sys]:checked').val(),
                },
                success:function (data) {
                    if(data.state){
                        Ewin.alert('添加成功');
                    }else {
                        Ewin.alert('添加失败');
                    }
                }
            })
        }

    });

    $('#choose_game').change(function () {
        $('#game_text').val($('#choose_game option:selected').text());
    });
    $("#game_text").bind('input propertychange',function () {
        if($(this).val()){
            $.ajax({
                url:config.ip+"/adminGame/getGameName",
                type:"get",
                data:{msg:$(this).val(),sys:$('#add_activity_form input[name=sys]:checked').val()},
                success:function (data) {
                    var game = data.name;
                    $("#choose_game option").remove();
                    $("#choose_game").append("<option value=''></option>");
                    for (var i = 0, j = game.length; i < j; i++) {
                        $("#choose_game").append("<option value='"+game[i].id+"' data-text='"+game[i].game_name+"'>"+game[i].game_name+"</option>");
                    }
                }
            });
        }else {
            return
        }
    })

});
function gameNameInit() {
    $.ajax({
        url: config.ip+'/admin/gameName',
        type: 'GET',
        data: {start: 0,sys:$('#add_activity_form input[type=radio]:checked').val()},
        success: function (data) {
            var game = data.name;
            $("#choose_game option").remove();
            $("#choose_game").append("<option value=''></option>");
            for (var i = 0, j = game.length; i < j; i++) {
                $("#choose_game").append("<option value='"+game[i].id+"' data-text='"+game[i].game_name+"'>"+game[i].game_name+"</option>");
            }
        }
    });
};
// function uploadQiniu(options) {
//     /*
//     option:{
//          file:octet-stream
//          key:string
//          token:string
//          next:fn
//          error:fn
//          success:fn
//     }
//      */
//     var file=options.file || null,
//         key=options.key || null,
//         token=options.token || null,
//         next=options.next || null,
//         error=options.error || null,
//         success=options.success || null,
//         putExtra = {
//             fname: "",
//             params: {},
//             mimeType:null
//         },
//         config = {
//             useCdnDomain: true,
//             region:'z2',
//             disableStatisticsReport: false
//         },
//         subObject = {
//             next: next,
//             error: error,
//             complete: success
//         },
//         observable = qiniu.upload(file, key, token, putExtra, config);
//     subscription = observable.subscribe(subObject) // 上传开始
// };