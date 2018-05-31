$(function () {
    $.ajax({
        type:"get",
        url:config.ip+"/admin/getNewsByPage",
        data:{page:1},
        success:function (data) {
            if(data.state){
                console.log(data.news);
                var html="";
                for(var i=0,l=data.news.length;i<l;i++){
                    html+=' <tr data-id="'+data.news[i].id+'">\n' +
                        '        <td>'+(i+1)+'</td>\n' +
                        '        <td>'+data.news[i].id+'</td>\n' +
                        '        <td>'+data.news[i].title+'</td>\n' +
                        '        <td>'+data.news[i].like+'</td>\n' +
                        '        <td>'+data.news[i].comment+'</td>\n' +
                        '        <td>'+data.news[i].add_time+'</td>\n' +
                        '        <td>'+(data.news[i].add_user?data.news[i].add_user:"oneyouxi")+'</td>\n' +
                        '        <td>   <button type="button" class="btn btn-primary edit_news" >编辑</button> <button type="button" class="btn btn-danger delete_news" >删除</button></td>\n' +
                        '    </tr>'
                }
                $("#t_news").append(html);
            }else {

            }
        }
    });

    $("#t_news").on("click","tr",function () {
        $.ajax({
            url:config.ip+"/admin/getNewsById",
            type:"get",
            data:{id:$(this).attr("data-id")},
            success:function (data) {
                console.log(data);
                if(data.state){
                    $("#news_div").html(data.news.detail);
                    $("#show_news").modal("show");
                }else {

                }
            }
        })
    });
    $("#t_news").on("click",".delete_news",function (event) {
        var id=$(this).parents("tr").attr("data-id");
        event.stopPropagation();
        Ewin.confirm({ message: "确认要删除选择的游戏吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                $.ajax({
                    url:config.ip+"/admin/deleteNewsById",
                    type:"get",
                    data:{id:id},
                    success:function (data) {
                        if(data.state){
                            window.location.reload()
                        }else {

                        }
                    }
                })
            }
        })
    });

    var E = window.wangEditor;
    var editor = new E('#ed');

    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    //     editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
    editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'justify',  // 对齐方式
        'image',  // 插入图片
        'undo' // 撤销
    ];
    editor.create();
    $("#add_news_btn").click(function () {
        if($('#news_title_img').get(0).files.length!=1||$("#news_title").val()==""){
            alert("不能为空");
            return
        }else {
            var formData = new FormData($('#add_news_from')[0]);
            formData.append("detail",editor.txt.html());
            // parent.waiting("show");
            $.ajax({
                url: config.ip+'/admin/addNews',
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success:function (data) {
                    console.log(data.state);
                    if(data.state==1){
                        parent.waiting("hide");
                        $('#m_add_news').modal('hide');
                        Ewin.alert('上传成功');
                        setTimeout(function () {
                            window.location.reload();
                        },1000)
                    }
                }
            }).done(function(res) {
            }).fail(function(res) {});
        }
    })
});