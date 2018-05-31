var page=1;
var editData;
$(function () {
    $.ajax({
        url:config.ip+'/adminH5/getH5',
        type:"get",
        data:{page:page},
        success:function (data) {
            if(data.state){
                var html="";
                data=data.h5;
                for(var i=0,l=data.length;i<l;i++){
                   html+="   <tr data-id='"+data[i].id+"'>\n" +
                       "    <td>"+(30*(page-1)+(i+1))+"</td>\n" +
                       "    <td class='tb_name'>"+data[i].name+"</td>\n" +
                       "    <td class='tb_commend'>"+data[i].commend+"</td>\n" +
                       "    <td class='tb_url'>"+data[i].url+"</td>\n" +
                       "    <td class='tb_sort'>"+data[i].sort+"</td>\n" +
                       "    <td> <button type='button' class='btn btn-primary edit_h5'>编辑</button> <button type='button' class='btn btn-danger delete_h5' >删除</button></td>\n" +
                       "    </tr>"
                }
                $("#t_h5").append(html);
            }else {

            }
        }
    });
    $('#add_h5_btn').click(function () {
        if($('#h5_title_img').get(0).files.length!=1||$('#h5_icon').get(0).files.length!=1||!$("#h5_recommend").val()||!$("#h5_url").val()||!$("#h5_name").val()){
            alert('不能为空！');
            return;
        }
        var formData = new FormData($('#add_h5_from')[0]);
        $.ajax({
            url: config.ip+'/adminH5/addH5',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success:function (data) {
                if(data.state==1){
                    $('#m_add_h5').modal('hide');
                    Ewin.alert('上传成功').on(function (r) {
                        if(r){
                            window.location.reload()
                        }
                    })
                }else {
                    Ewin.alert('上传失败').on(function (r) {
                    })
                }
            }
        }).done(function(res) {
        }).fail(function(res) {});
    });
    $("#t_h5").on("click",".delete_h5",function () {
        var id=$(this).parents("tr").attr("data-id");
        var name=$(this).parents("td").siblings(".tb_name").text();
        Ewin.confirm({ message: "确认要删除选择的H5游戏吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                $.ajax({
                    url: config.ip+'/adminH5/deleteH5',
                    type:"get",
                    data:{id:id,name:name},
                    success:function (data) {
                        if(data.state){
                            Ewin.alert('删除成功！').on(function (r) {
                                if(r){
                                    window.location.reload()
                                }
                            })
                        }else {
                            Ewin.alert('删除失败！').on(function (r) {
                            })
                        }
                    }
                })
            }
        })
    });
    $("#t_h5").on("click",".edit_h5",function () {
        var t=$(this);
        function getText(el) {
            return t.parents('td').siblings(el).text();
        }
        editData ={
            ed_id:$(this).parents("tr").attr("data-id"),
            ed_name:getText('.tb_name'),
            ed_commend:getText(".tb_commend"),
            ed_url:getText(".tb_url"),
            ed_sort:getText(".tb_sort")
        };
        for(var key in editData){
            $('#'+key).val(editData[key])
        }
        $("#edit_msg_model").modal('show');
    });
    $("#edit_h5_msg_btn").click(function () {
        var data = {
            id:$("#ed_id").val(),
            name:$("#ed_name").val(),
            commend:$("#ed_commend").val(),
            url:$("#ed_url").val(),
            sort:$("#ed_sort").val()
        };
        $.ajax({
            url: config.ip+'/adminH5/editH5',
            type: 'post',
            data: data,
            success:function (data) {
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
        })
    })
});