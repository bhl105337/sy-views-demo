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
       console.log({name:$('#name').val(),password:$('#password').val(),comment:$('#comment').val()})
       $.ajax({
           url: config.ip+'/admin/add/user',
           type: 'GET',
           data:{name:$('#name').val(),password:$('#password').val(),comment:$('#comment').val()},
           success:function (data) {
               $("#add_user").modal('hide');
               data.state? Ewin.alert({ message: "添加成功" }):Ewin.alert({ message: "添加失败" });
           }
       })
   });
});