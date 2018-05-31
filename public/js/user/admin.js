$(function () {
    $.ajax({
        url:config.ip+'/admin/getAdmin',
        type: 'GET',
        data:{},
        success:function (data) {
            data=data.admin;
            var html="";
            for (var i=0;i<data.length;i++){
                var type;
                data[i].jurisdiction==1?type='一级管理员':type='二级管理员';
                data[i].jurisdiction==3?type='渠道':"";
                html+=' <tr>\n' +
                    '            <td>'+(i+1)+'</td>\n' +
                    '            <td>'+data[i].id+'</td>\n' +
                    '            <td>'+data[i].name+'</td>\n' +
                    '            <td>'+data[i].password+'</td>\n' +
                    '            <td>'+type+'</td>\n' +
                    '            <td>'+data[i].comment+'</td>\n' +
                    '            <td>\n' +
                    '                <button type="button" class="btn btn-primary edit_game" >编辑</button>\n' +
                    '                <button type="button" class="btn btn-danger delete_game" >删除</button>\n' +
                    '            </td>\n' +
                    '        </tr>'
            }
            $("#list_tb>tbody").append(html);
        }
    });
   $('#add_user_btn').click(function () {
       $.ajax({
           url: config.ip+'/admin/add/user',
           type: 'GET',
           data:{name:$('#name').val(),password:$('#password').val(),type:2,comment:$('#comment').val()},
           success:function (data) {
               $("#add_user").modal('hide');
               data.state? Ewin.alert({ message: "添加成功" }).on(function (r) {
                   if(r){
                       window.location.reload()
                   }
               }):Ewin.alert({ message: "添加失败" }).on(function (r) {
                   if(r){
                       window.location.reload()
                   }
               });
           }
       })
   });
    $('#add_qudao_btn').click(function () {
        $.ajax({
            url: config.ip+'/admin/add/user',
            type: 'GET',
            data:{name:$('#name_qudao').val(),password:$('#password_qudao').val(),type:3,comment:$('#comment_qudao').val()},
            success:function (data) {
                $("#add_qudao").modal('hide');
                data.state? Ewin.alert({ message: "添加成功" }).on(function (r) {
                    if(r){
                        window.location.reload()
                    }
                }):Ewin.alert({ message: "添加失败" }).on(function (r) {
                    if(r){
                        window.location.reload()
                    }
                });
            }
        })
    });
});