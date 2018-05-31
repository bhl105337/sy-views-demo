$(function () {
    var tagId;
    $.ajax({
        type:'get',
        url:config.ip+'/adminGame/getTag',
        data:{},
        success:function (data) {
            if(data.state){
                var tag=data.tag;
                var html='';
                console.log(tag);
                for(var i=0;i<tag.length;i++){
                    var ac;

                    tag[i].active ? ac='取消推荐' : ac='推荐';
                    html+='<tr>\n' +
                        '    <td>'+(i+1)+'</td>\n' +
                        '    <td>'+tag[i].name+'</td>\n' +
                        '    <td> \n' +
                        '        <button type="button" class="btn edit_tag" data-id="'+tag[i].id+'">修改</button>\n' +
                        '        <button type="button" class="btn up_tag" data-id="'+tag[i].id+'" data-active="'+tag[i].active+'">'+ac+'</button>\n' +
                        '    </td>\n' +
                        '    </tr>'
                }
                $('#tag_body').append(html)
            }else {
                Ewin.alert('获取标签失败')
            }
        }
    });

    $('#tag_body').on('click','.edit_tag',function () {
        $("#edit_tag_model").modal('show');
        tagId=$(this).attr('data-id')
    });
    $('#tag_body').on('click','.up_tag',function () {
        tagId=$(this).attr('data-id');
        var active=$(this).attr('data-active')
        $.ajax({
            type:'get',
            url:config.ip+'/adminGame/upTag',
            data:{
                tagId:tagId,
                active:active
            },
            success:function (data) {
                if (data.state){
                    Ewin.alert('成功').on(function (r) {
                        r && window.location.reload()
                    });
                }else {
                    Ewin.alert('失败');
                }
            }
        })
    });
    $('#edit_tag_btn').click(function () {
        if(!$('#edit_tag_inp').val()){
            Ewin.alert('名字不能为空');
            return
        }
        $.ajax({
            type:'get',
            url:config.ip+'/adminGame/editTag',
            data:{
                tagId:tagId,
                name:encodeURI($('#edit_tag_inp').val())
            },
            success:function (data) {
                if (data.state){
                    Ewin.alert('修改成功').on(function (r) {
                        r && window.location.reload()
                    });
                }else {
                    Ewin.alert('修改失败');
                }
            }
        })
    });
    $('#add_tag_btn').click(function () {
        if(!$('#add_tag_inp').val()){
            Ewin.alert('名字不能为空');
            return
        }
        $.ajax({
            type:'get',
            url:config.ip+'/adminGame/addTag',
            data:{
                name:encodeURI($('#add_tag_inp').val())
            },
            success:function (data) {
                if (data.state){
                    Ewin.alert('添加成功').on(function (r) {
                        r && window.location.reload()
                    });
                }else {
                    Ewin.alert('添加失败');
                }
            }
        })
    })
});