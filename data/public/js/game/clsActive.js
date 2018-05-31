$(function () {
    $.ajax({
        url:config.ip+"/admin/getClsActive",
        type:"get",
        success:function (data) {
            var ARR=[];
            for(var i=0;i<data.active.length;i++){
                ARR.push(data.active[i].game_id)
            }
            $.ajax({
                url:config.ip+"/admin/gameByType",
                type:"get",
                data:{msg:"alone",sys:2},
                success:function (data) {
                    var html="";
                    for (var i=0,l=data.game;i<l.length;i++){
                        html+='<option value="'+data.game[i].id+'" selected="">'+data.game[i].game_name+'</option>';
                    }
                    $("#alone select").append(html);
                    $("#alone select").each(function () {
                        var t=$(this);
                        $(this).find("option").each(function () {
                            if(ARR.indexOf(parseInt($(this).val()))>=0){
                                t.val($(this).val());
                                ARR.splice(ARR.indexOf(parseInt($(this).val())),1);
                                return false;
                            }
                        });
                    })
                }
            });
            $.ajax({
                url:config.ip+"/admin/gameByType",
                type:"get",
                data:{msg:"online",sys:2},
                success:function (data) {
                    var html="";
                    for (var i=0,l=data.game;i<l.length;i++){
                        html+='<option value="'+data.game[i].id+'">'+data.game[i].game_name+'</option>'
                    }
                    $("#online select").append(html)
                    $("#online select").each(function () {
                        var t=$(this);
                        $(this).find("option").each(function () {
                            if(ARR.indexOf(parseInt($(this).val()))>=0){
                                t.val($(this).val());
                                ARR.splice(ARR.indexOf(parseInt($(this).val())),1);
                                return false;
                            }
                        });
                    })
                }
            });
            $.ajax({
                url:config.ip+"/admin/gameByType",
                type:"get",
                data:{msg:"application",sys:2},
                success:function (data) {
                    var html="";
                    for (var i=0,l=data.game;i<l.length;i++){
                        html+='<option value="'+data.game[i].id+'">'+data.game[i].game_name+'</option>'
                    }
                    $("#application select").append(html);
                    $("#application select").each(function () {
                        var t=$(this);
                        $(this).find("option").each(function () {
                            if(ARR.indexOf(parseInt($(this).val()))>=0){
                                t.val($(this).val());
                                ARR.splice(ARR.indexOf(parseInt($(this).val())),1);
                                return false;
                            }
                        });
                    })
                }
            });
            $.ajax({
                url:config.ip+"/admin/gameByType",
                type:"get",
                data:{msg:"",sys:1},
                success:function (data) {
                    var html="";
                    for (var i=0,l=data.game;i<l.length;i++){
                        html+='<option value="'+data.game[i].id+'">'+data.game[i].game_name+'</option>'
                    }
                    $("#game_ios select").append(html);
                    $("#game_ios select").each(function () {
                        var t=$(this);
                        $(this).find("option").each(function () {
                            if(ARR.indexOf(parseInt($(this).val()))>=0){
                                t.val($(this).val());
                                ARR.splice(ARR.indexOf(parseInt($(this).val())),1);
                                return false;
                            }
                        });
                    })
                }
            });
            $.ajax({
                url:config.ip+"/admin/gameByType",
                type:"get",
                data:{msg:"application",sys:1},
                success:function (data) {
                    var html="";
                    for (var i=0,l=data.game;i<l.length;i++){
                        html+='<option value="'+data.game[i].id+'">'+data.game[i].game_name+'</option>'
                    }
                    $("#application_ios select").append(html);
                    $("#application_ios select").each(function () {
                        var t=$(this);
                        $(this).find("option").each(function () {
                            if(ARR.indexOf(parseInt($(this).val()))>=0){
                                t.val($(this).val());
                                ARR.splice(ARR.indexOf(parseInt($(this).val())),1);
                                return false;
                            }
                        });
                    })
                }
            });
        }
    });


    $(".edit").click(function () {
        var arr=[];
        var type=$(this).parents("ul").attr("data-type");
        $(this).parents("li").siblings("li").find("select").each(function () {
            arr.push($(this).val());
        });
        $.ajax({
            url:config.ip+"/admin/setClsActive",
            type:"get",
            data:{type:type,sys:$(this).attr("data-sys"),arr:JSON.stringify(arr)},
            success:function (data) {
                if(data.state){
                    Ewin.alert('修改成功');
                }
            }

        })
    })
});