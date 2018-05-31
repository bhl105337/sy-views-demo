$(function () {

    $.ajax({
        url: config.ip+'/admin/active',
        type: 'GET',
        cache: false,
        data: {start: 0},
        processData: false,
        contentType: false,
        success: function (data) {
            var active = data.active;
            console.log(active);
            var html = '';
            var active_state = '';
            var type = '';
            for (var i = 0, j = active.length; i < j; i++) {
                if(active[i].active != '1'){
                    active_state = '不激活'
                }else {
                    active_state = '激活'
                }
                if(active[i].type == '2'){
                    type = '首页推荐位'
                }else if(active[i].type == '1'){
                    type = '首页轮播推荐位'
                }else if(active[i].type == '3'){
                    type='分类推荐位'
                }
                if(active[i].sys==2){
                    var sys="安卓"
                }else {
                    var sys="iOS"
                }
                html += '<tr>\n' +
                    '        <td>' + (i + 1) + '</td>\n' +
                    '        <td class="tb_id">' + active[i].id + '</td>\n' +
                    '        <td class="tb_sys">' + sys + '</td>\n' +
                    '        <td class="tb_name">' + active[i].name + '</td>\n' +
                    '        <td class="tb_title">' + active[i].title + '</td>\n' +
                    '        <td class="tb_sort">' + active[i].sort + '</td>\n' +
                    '        <td class="tb_active_img">' + active[i].active_img + '</td>\n' +
                    '        <td class="tb_active">' + active_state + '</td>\n' +
                    '        <td class="tb_active">' + type + '</td>\n' +
                    '        <td>\n' +
                    '            <button type="button" class="btn btn-primary edit_activity" >编辑</button>\n' +
                    '            <button type="button" class="btn btn-danger delete_activity" >删除</button>\n' +
                    '        </td>\n' +
                    '    </tr>'
            }
            $('#activity_table>tr').remove();
            $('#activity_table').append(html);
        }
    }).done(function (res) {
    }).fail(function (res) {
    });

    $.ajax({
        url: config.ip+'/admin/gameName',
        type: 'GET',
        cache: false,
        data: {sys: $("input[name='sys']:checked").val()},
        success: function (data) {
            var game = data.name;
            $("#choose_game option").remove();
            $("#choose_game").append("<option ></option>")
            for (var i = 0, j = game.length; i < j; i++) {
                $("#choose_game").append("<option value='"+game[i].game_name+"'>"+game[i].game_name+"</option>");
            }
        }
    });
    $("input[name='sys']").click(function () {
        $.ajax({
            url: config.ip+'/admin/gameName',
            type: 'GET',
            cache: false,
            data: {sys: $("input[name='sys']:checked").val()},
            success: function (data) {
                var game = data.name;
                $("#choose_game option").remove();
                $("#choose_game").append("<option ></option>");
                for (var i = 0, j = game.length; i < j; i++) {
                    $("#choose_game").append("<option value='"+game[i].game_name+"'>"+game[i].game_name+"</option>");
                }
            }
        });
    });

    $('#search_cls>li').click(function () {
        $("#search_text").text($(this).find('a').text())
    });



    $('#activity_table').on('click','.delete_activity',function () {
        var t=$(this);
        var name=$.trim($(this).parents('td').siblings('.tb_name').text());
        var id=$.trim($(this).parents('td').siblings('.tb_id').text());
        Ewin.confirm({ message: "确认要删除吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                console.log(name,id);
                $.ajax({
                    url: config.ip+'/admin/deleteActive',
                    type: 'GET',
                    data:{id:id,name:name},
                    success:function (data) {
                        if(data.state==1){
                            t.parents('tr').remove();
                        }else {

                        }
                    }
                })
            }
        });
    });

    $('#add_activity_btn').click(function () {

        var formData = new FormData($('#add_activity_form')[0]);

        $.ajax({
            url: config.ip+'/admin/addActive',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success:function (data) {
                console.log(data.state);
                if(data.state==1){
                    $('#add_activity_model').modal('hide');
                    Ewin.alert('上传成功');
                    setTimeout(function () {
                        window.location.reload();
                    },3000)
                }
            }
        }).done(function(res) {
        }).fail(function(res) {});
    })

    $('#choose_game').change(function () {
        $('#game_text').attr('value',$(this).val());
    });

});