$(function () {
    $.ajax({
        type:"get",
        url:config.ip+"/admin/goods",
        success:function (data) {
            data=data.good;
            var html="";
            // console.log(data[0]);
            for (var i=0,j=data.length;i<j;i++){
                if(data[i].coin_type==1){
                    var coinType="成就点"
                }else {
                    var coinType="平台币"
                }

                if(data[i].good_type==1){
                    html+='<tr>\n' +
                        '            <td>'+(i+1)+'</td>\n' +
                        '            <td class="goods_id">'+data[i].id+'</td>\n' +
                        '            <td class="goods_name">'+data[i].good_name+'</td>\n' +
                        '            <td>'+data[i].stock+'</td>\n' +
                        '            <td>'+data[i].now_stock+'</td>\n' +
                        '            <td>'+data[i].coin_value+'</td>\n' +
                        '            <td>'+coinType+'</td>\n' +
                        '            <td>'+data[i].system+'</td>\n' +
                        '            <td>虚拟</td>\n' +
                        '            <td>\n' +
                        '                <button type="button" class="btn btn-primary edit_good" >编辑</button>\n' +
                        '                <button type="button" class="btn btn-danger delete_good" >删除</button>\n' +
                        '            </td>\n' +
                        '        </tr>'
                }else {
                    html+='<tr class="goods_tr">\n' +
                        '            <td>'+(i+1)+'</td>\n' +
                        '            <td class="goods_id">'+data[i].id+'</td>\n' +
                        '            <td class="goods_name">'+data[i].good_name+'</td>\n' +
                        '            <td>点击查看</td>\n' +
                        '            <td>点击查看</td>\n' +
                        '            <td>点击查看</td>\n' +
                        '            <td>'+coinType+'</td>\n' +
                        '            <td>点击查看</td>\n' +
                        '            <td>实物</td>\n' +
                        '            <td>\n' +
                        '                <button type="button" class="btn btn-primary edit_good" >编辑</button>\n' +
                        '                <button type="button" class="btn btn-danger delete_good" >删除</button>\n' +
                        '            </td>\n' +
                        '        </tr>'
                }
            }
            $("#t_goods").append(html);
        }
    });
    $("#t_goods").on("click",".delete_good",function (event) {
        var gid=$(this).parent().siblings(".goods_id").text();
        var name=$(this).parent().siblings(".goods_name").text();

        event.stopPropagation();
        Ewin.confirm({ message: "确认要删除选择的商品吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                // console.log(gname,gid);
                $.ajax({
                    type:"GET",
                    url:config.ip+"/admin/deleteGoods",
                    data:{id:gid,name:name},
                    success:function (data) {
                        if(data.state){
                            Ewin.alert('删除成功');
                            setTimeout(function () {
                                window.location.reload();
                            },500)
                        }else {
                            Ewin.alert('删除失败');
                        }
                    }
                })
            }
        });
    });
    $("#t_goods").on("click",".goods_tr",function () {
        $.ajax({
            type:"GET",
            url:config.ip+"/admin/getGoodsType",
            data:{id:$(this).find(".goods_id").text()},
            success:function (data) {
                $("#t_goods_type").empty();
                $("#show_good_type").modal("show");
                data=data.type;
                var html="";
                console.log(data.length);
                for (var i=0;i<data.length;i++){
                    html+='<tr>\n' +
                        '                                <td>'+(i+1)+'</td>\n' +
                        '                                <td>'+data[i].type+'</td>\n' +
                        '                                <td>'+data[i].cost+'</td>\n' +
                        '                                <td>'+data[i].stock+'</td>\n' +
                        '                                <td>'+data[i].now_stock+'</td>\n' +
                        '                                <td>\n' +
                        '                                <button type="button" class="btn btn-primary edit_type" data-id="'+data[i].id+'">编辑</button>\n' +
                        '                                <button type="button" class="btn btn-danger delete_type" data-id="'+data[i].id+'">删除</button>\n' +
                        '                                </td>\n' +
                        '                            </tr>'
                }
                $("#t_goods_type").append(html);
            }
        })
    });
    $("#t_goods_type").on("click",".delete_type",function () {
        var tid=$(this).attr("data-id");
        event.stopPropagation();
        Ewin.confirm({ message: "确认要删除选择的商品规格吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                // console.log(gname,gid);
                $.ajax({
                    type:"GET",
                    url:config.ip+"/admin/deleteGoodsType",
                    data:{id:tid},
                    success:function (data) {
                        if(data.state){
                            Ewin.alert('删除成功');
                            setTimeout(function () {
                                window.location.reload();
                            },500)
                        }else {
                            Ewin.alert('删除失败');
                        }
                    }
                })
            }
        });
    });
    $('#choose_good_btn').click(function () {
        $("#choose_good_type").modal('hide');
        setTimeout(function () {
            $("#add_good").modal('show');
        },500)
    });
    $('#choose_virtual_btn').click(function () {
        $("#choose_good_type").modal('hide');
       setTimeout(function () {
           $("#add_virtual").modal('show');
       },500)
    });
    $('#good_type').change(function () {
       switch ($(this).val()){
           case "1":$('#good_img_box').addClass('hidden');break;
           case "2":$('#good_img_box').removeClass('hidden');break;
           case "3":$('#good_img_box').addClass('hidden');break;
       }
   });
    $('#new_type').click(function () {
        var html='<div class="row ui_flex_wrapper ui_flex_h form-group good_type">\n' +
            '                            <div class="input-group col-lg-3">\n' +
            '                                <span class="input-group-addon">规格</span>\n' +
            '                                <input type="text" class="form-control type_ipu" placeholder="商品规格*" aria-describedby="basic-addon1" name="">\n' +
            '                            </div>\n' +
            '                            <div class="input-group col-lg-3">\n' +
            '                                <span class="input-group-addon">价值</span>\n' +
            '                                <input type="number" class="form-control cost_ipu" placeholder="商品价值*(数字)" aria-describedby="basic-addon1" name="">\n' +
            '                            </div>\n' +
            '                            <div class="input-group col-lg-3">\n' +
            '                                <span class="input-group-addon">货存</span>\n' +
            '                                <input type="number" class="form-control stock_ipu" placeholder="商品货存*(数字)" aria-describedby="basic-addon1" name="">\n' +
            '                            </div>\n' +
            '                            <button type="button" class="btn btn-default delete_type " >删除规格</button>\n' +
            '                        </div>';
        $('#good_type_box').append(html);
    });
    $('#good_type_box').on('click','.delete_type',function () {
        $(this).parent().remove();
    });
    $('#add_good_btn').click(function () {
        // console.log(1);
        if(!verriFrom("#add_good_form")){
            alert("不能留空，没有请写无!");
            return
        }
        parent.waiting("show");
        var formData = new FormData($('#add_good_form')[0]);
        var type=[];
        $('.good_type').each(function () {
            var obj={};
            obj.type=$(this).find('.type_ipu').val();
            obj.cost=$(this).find('.cost_ipu').val();
            obj.stock=$(this).find('.stock_ipu').val();
            type.push(obj)
        });
        var file = document.getElementById('good_img').files;
        for(var i=0;i<file.length;i++){
            formData.append("good_img"+i, file[i]); //++++++++++
        }
        formData.append("typeList",JSON.stringify(type));
        $.ajax({
            type:'post',
            url:config.ip+'/admin/add/good',
            data:formData,
            processData: false,
            cache: false,
            contentType: false,
            success:function (data) {
                parent.waiting("hide");
                if(data.state){
                    $('#add_good').modal('hide');
                    Ewin.alert('上传成功');
                    setTimeout(function (){
                        window.location.reload();
                    },3000)
                }
            }
        });
    });
    $('#add_virtual_btn').click(function () {
        if(!verriFrom("#add_virtual_form")){
            alert("不能留空，没有请写无");
            return
        }
        parent.waiting("show");
        var formData = new FormData($('#add_virtual_form')[0]);
        $.ajax({
            type:'post',
            url:config.ip+'/admin/add/virtual',
            data:formData,
            processData: false,
            cache: false,
            contentType: false,
            success:function (data) {
                if(data.state){
                    parent.waiting("hide");
                    $('#add_virtual').modal('hide');
                    Ewin.alert('上传成功');
                    setTimeout(function (){
                        window.location.reload();
                    },3000)
                }
            }
        });
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
    return flag;
}