$(function () {
    var Base64 = {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    }
    $.ajax({
        type:"get",
        url:config.ip+"/admin/getNewsByPage",
        data:{page:1},
        success:function (data) {
            if(data.state){
                var html="";
                for(var i=0,l=data.news.length;i<l;i++){
                    if(data.news[i].up=="1"){
                        var te="取消";
                    }else {
                        var te="置顶";
                    }
                    html+=' <tr data-id="'+data.news[i].id+'">\n' +
                        '        <td>'+(i+1)+'</td>\n' +
                        '        <td class="id">'+data.news[i].id+'</td>\n' +
                        '        <td class="title">'+data.news[i].title+'</td>\n' +
                        '        <td class="browse">'+data.news[i].browse+'</td>\n' +
                        '        <td class="agree">'+data.news[i].agree+'</td>\n' +
                        '        <td class="comment">'+data.news[i].comment+'</td>\n' +
                        '        <td class="add_time">'+data.news[i].add_time+'</td>\n' +
                        '        <td>'+(data.news[i].add_user?data.news[i].add_user:"oneyouxi")+'</td>\n' +
                        '        <td>   <button type="button" class="btn btn-primary edit_news" >编辑</button> <button type="button" class="btn btn-danger delete_news" >删除</button><button type="button" class="btn btn-primary up_news" style="margin-left: 5px">'+te+'</button></td>\n' +
                        '    </tr>'
                }
                $("#t_news").append(html);
            }else {

            }
        }
    });
    $.ajax({
        url:config.ip+"/admin/gameName",
        type:"get",
        data:{sys:2},
        success:function (data) {
            var game=data.name;
            var html="";
            for(var i=0;i<game.length;i++){

                html+='<option value="'+game[i].id+'" selected="">'+game[i].game_name+'</option>';
            }
            $("#news_game_select").empty();
            $("#news_game_select").append('<option value="0" selected="selected"></option>');
            $("#news_game_select").append(html);
            $("#news_game_select").val(0);
        }
    });
    $("#show_news_btn").click(function () {
        $("#news_div").html(editor.txt.html());
        $("#show_news").modal("show");
    });
    $("#t_news").on("click","tr",function () {
        $.ajax({
            url:config.ip+"/admin/getNewsById",
            type:"get",
            data:{id:$(this).attr("data-id")},
            success:function (data) {
                if(data.state){
                    $.ajax({
                        type:'get',
                        url:config.base64+"/"+data.news.detail_addr,
                        success:function (data) {
                            $("#news_div").html(data);
                            $("#show_news").modal("show");
                        }
                    });
                }else {

                }
            }
        })
    });
    $("#t_news").on("click",".edit_news",function (event) {
        var event=event||window.event;
        event.stopPropagation();
        var t=$(this);
        function getText(el) {
            return t.parents('td').siblings(el).text();
        }
        var obj ={
            ed_id:getText('.id'),
            ed_title:getText(".title"),
            ed_browse:getText(".browse"),
            ed_agree:getText(".agree"),
            ed_comment:getText(".comment"),
            ed_add_time:getText(".add_time")
        };
        sessionStorage.setItem('editNewsMsg',JSON.stringify(obj));
        var data=JSON.parse(sessionStorage.getItem('editNewsMsg'));
        for(var key in data){
            $('#'+key).val(data[key])
        }
        $("#edit_news_msg_btn").attr("data-id",data.ed_id)
        $("#edit_msg_model").modal('show');
    });
    $("#t_news").on("click",".up_news",function (event) {
        event.stopPropagation();
        var t=$(this);
        if(t.text()=="置顶"){
            $.ajax({
                url:config.ip+"/admin/upNews",
                type:"get",
                data:{id:t.parents("td").siblings(".id").text()},
                success:function (data) {
                    if(data.state){
                        t.text("取消");
                        Ewin.alert("置顶成功!")
                    }else {
                        Ewin.alert("置顶失败!")
                    }
                }
            });
        }else {
            $.ajax({
                url:config.ip+"/admin/downNews",
                type:"get",
                data:{id:t.parents("td").siblings(".id").text()},
                success:function (data) {
                    if(data.state){
                        t.text("置顶");
                        Ewin.alert("取消置顶成功!")
                    }else {
                        Ewin.alert("取消置顶失败!")
                    }
                }
            });
        }
    });
    $("#edit_news_msg_btn").click(function () {
        var flag=true;
        $("#edit_news_msg_form input").each(function () {
            if(!$(this).val()){
                flag=false
            }
        });
        console.log(flag);
        if(flag){
            var data={
                id:$(this).attr("data-id"),
                title:$("#ed_title").val(),
                browse:$("#ed_browse").val(),
                agree:$("#ed_agree").val(),
                comment:$("#ed_comment").val(),
                add_time:$("#ed_add_time").val()
            };

            $.ajax({
                url:config.ip+"/admin/editNewsById",
                type:"post",
                data:{
                    id:$(this).attr("data-id"),
                    title:$("#ed_title").val(),
                    browse:$("#ed_browse").val(),
                    agree:$("#ed_agree").val(),
                    comment:$("#ed_comment").val(),
                    add_time:$("#ed_add_time").val()
                },
                success:function (data) {
                    if(data.state){
                        Ewin.alert("修改成功!").on(function (r) {
                            if(r){
                                window.location.reload()
                            }
                        })
                    }else {
                        Ewin.alert("修改失败!")
                    }
                }
            });
        }
    });
    $("#t_news").on("click",".delete_news",function (event) {
        var id=$(this).parents("tr").attr("data-id");
        event.stopPropagation();
        Ewin.confirm({ message: "确认要删除选择的资讯吗？" }).on(function (e) {
            if (!e) {
                return;
            }else {
                $.ajax({
                    url:config.ip+"/adminNews/deleteNewsById",
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
    editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
    //     editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
    editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        // 'foreColor',  // 文字颜色
        // 'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        // 'quote',  // 引用
        // 'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'video',  // 插入视频
        // 'code',  // 插入代码
        'undo'  // 撤销
        // 'redo'  // 重复
    ];
    editor.create();
    $("#add_news_btn").click(function () {
        if(!$("#news_title").val()||$("#news_title_img").get(0).files.length!=1){
            alert('数据缺失')
            return;
        }else {

        }
        var key=encode(Base64.encode('news/'+$("#news_title").val()));
        $.ajax({
            url: config.ip+'/admin/getUptokenByMsg',
            data:{scope:'onebase64',key:key},
            type:'get',
            success:function (data) {
                function putb64(){
                    var pic = Base64.encode(editor.txt.html());
                    var url = "http://upload-z2.qiniup.com/putb64/-1/key/"+key+'/mimeType/'+Base64.encode('octet-stream'); //非华东空间需要根据注意事项 1 修改上传域名
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState==4){
                            var res=JSON.parse(xhr.responseText);
                            if(!res.error&&res.key){
                                var detail=res.key;
                                // console.log(detail);
                                var imgkey='news/'+$("#news_title").val()+'/titleImg';
                                var imgFile=$('#news_title_img').get(0).files[0];
                                $.ajax({
                                    url: config.ip+'/admin/getUptokenByMsg',
                                    data:{scope:'oneyouxiimg',key:imgkey},
                                    type:'get',
                                    success:function (data) {
                                        uploadQiniu(imgFile,imgkey,data.upToken,function (next) {
                                            console.log(next);
                                        },function (error) {
                                            console.log(error);
                                            $.ajax({
                                                url: config.ip+'/adminNews/deleteNewsByMsg',
                                                data:{bucket:'onebase64',key:detail},
                                                type:'get'
                                            });
                                            Ewin.alert('上传头图失败');
                                        },function (complete) {
                                            console.log(complete);
                                            $.ajax({
                                                url: config.ip+'/adminNews/addNews',
                                                data:{title:encodeURI($("#news_title").val()),detail:detail,img:complete.key,game_id:$('#news_game_select').val()},
                                                type:'get',
                                                success:function (data) {
                                                    data.state?Ewin.alert("插入数据库成功").on(function (r) {
                                                        r && window.location.reload()
                                                    }):Ewin.alert("插入数据库失败")
                                                }
                                            })
                                        })
                                    }
                                })
                            }else {
                                Ewin.alert('上传内容失败');
                            }
                            console.log(JSON.parse(xhr.responseText));
                        }
                    };
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.setRequestHeader("Authorization", "UpToken "+data.upToken);
                    xhr.send(pic);
                }
                putb64();
            }
        })
    });
    $("#game_name_inp").bind('input propertychange',function () {
        $.ajax({
            url:config.ip+"/admin/searchGameByMsg",
            type:"get",
            data:{msg:$(this).val(),type:"game_name"},
            success:function (data) {
                var game=data.game;
                var html="";
                for(var i=0;i<game.length;i++){

                    html+='<option value="'+game[i].id+'" selected="">'+game[i].game_name+'</option>';
                }
                $("#news_game_select").empty();
                $("#news_game_select").append('<option value="0" selected="selected"></option>');
                $("#news_game_select").append(html);
                $("#news_game_select").val(0);
            }
        });
    })
});
function encode(value) {
    var value2='';
    for(var i=0,l=value.length;i<l;i++){
        if(value[i]=='+'){
            value2+='-';
            // key[i]='-';
        }else if(value[i]=='/'){
            value2+='_'
            // key[i]='_';
        }else {
            value2+=value[i]
        }
    }
    return value2;
}

function uploadQiniu(file, key,token,nextCb,errorCb,completeCb) {
//           var token='Uusbv77fI10iNTVF3n7EZWbksckUrKYwUpAype4i:fxYy4f3R75-yc2UgLsFXv2P0KFA=:eyJyZXR1cm5Cb2R5Ijoie1wia2V5XCI6XCIkKGtleSlcIixcImhhc2hcIjpcIiQoZXRhZylcIixcImZzaXplXCI6JChmc2l6ZSksXCJidWNrZXRcIjpcIiQoYnVja2V0KVwiLFwibmFtZVwiOlwiJCh4Om5hbWUpXCJ9Iiwic2NvcGUiOiJvbmV5b3V4aTp0ZXN0IiwiZGVhZGxpbmUiOjE1MjE0NDM5MjF9';
    var next=function (res) {
        nextCb(res);
    };
    var error = function (err) {
        errorCb(err);
    };
    var complete = function (res) {
        completeCb(res);
    };
    var putExtra = {
        fname: "",
        params: {},
        mimeType:null
    };
    var config = {
        useCdnDomain: true,
        region:'z2',
        disableStatisticsReport: false
    };
//           var file = this.files[0];
//           var key = 'test';
    var subObject = {
        next: next,
        error: error,
        complete: complete
    };
    var observable = qiniu.upload(file, key, token, putExtra, config);
    var subscription = observable.subscribe(subObject) // 上传开始
}