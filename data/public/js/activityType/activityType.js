$(function () {

    $.ajax({
        url: config.ip+'/admin/getClsActive',
        type: 'GET',
        cache: false,
        data: {start: 0},
        processData: false,
        contentType: false,
        success: function (data) {
            var active = data.active;
            var html = '';
            var type = '';
            for (var i = 0, j = active.length; i < j; i++) {
                if(active[i].type != 'alone'){
                    type = '单机'
                }else if(active[i].type != 'online'){
                    type='网游'
                }else if(active[i].type != 'application'){
                    type = '应用'
                }

                html += '<tr>\n' +
                    '        <td>' + (i + 1) + '</td>\n' +
                    '        <td class="tb_id">' + active[i].id + '</td>\n' +
                    '        <td class="tb_name">' + active[i].game_id + '</td>\n' +
                    '        <td class="tb_title">' + active[i].sort + '</td>\n' +
                    '        <td class="tb_sort">' + type + '</td>\n' +
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
        data: {start: 0},
        processData: false,
        contentType: false,
        success: function (data) {
            var game = data.name;
            $("#choose_game option").remove();
            $("#choose_game").append("<option value=''></option>");
            for (var i = 0, j = game.length; i < j; i++) {
                $("#choose_game").append("<option value='"+game[i].game_name+"'>"+game[i].game_name+"</option>");
            }
        }
    }).done(function (res) {
    }).fail(function (res) {
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
            ed_address:getText(".tb_address"),
        };
        sessionStorage.setItem('editMsg',JSON.stringify(obj));
        $("#edit_choose").modal('show');
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
        var GameIdArr=[];
        // if(!verriFrom('#add_activity_form')){
        //     alert('请按规则填写！');
        //     return;
        // }
        var checkArr=[];
        $('#game_cls_check input[type=checkbox]:checked').each(function (item) {
            checkArr.push($(this).attr('value'))
        });

        if(checkArr.length > 0){
            var alone=[];
            var online =[];
            var application=[];
            for(var k=0;k < checkArr.length;++k){
                if(checkArr[k] == 'alone'){
                    $("#alone > select").each(function () {
                        alone.push($(this).val());
                    })
                    Getajax(checkArr[k],alone);
                }
                if(checkArr[k] == "online"){
                    $("#online > select").each(function () {
                        online.push($(this).val());
                    })
                    Getajax(checkArr[k],online);
                }
                if(checkArr[k] == "application"){
                    $("#application > select").each(function () {
                        application.push($(this).val());
                    })
                    Getajax(checkArr[k],application);
                }
            }
            var nary = alone.sort();
            for(var j=0; j < nary.length;++j){
                if (nary[j] == nary[j+1]) {
                    alert('游戏重复！');
                    return;
                }
            }
        }else {
            alert('请选择游戏分类！');
            return;
        }
    })


    $('#choose_game').change(function () {
        $('#game_text').attr('value',$(this).val());
    });

    $('#gameType').click(function () {
        gameid_Arr=[];
       var gameTypeUrl = ["alone","online","application"];
        for (var i =0;i < gameTypeUrl.length; ++i){
           $.ajax({
               url: config.ip+'/admin/gameByType?msg='+ gameTypeUrl[i],
               type: 'GET',
               async: false,
               cache: false,
               data: {"msg": "typeGame"},
               processData: false,
               contentType: false,
               success: function (data) {
                   var gameList =[gameTypeUrl[i]+"_game1",gameTypeUrl[i]+"_game2", gameTypeUrl[i]+"_game3", gameTypeUrl[i]+"_game4"];
                   var game = data.game;
                   for (var j =0;j < gameList.length; ++j)
                   {
                       $("#"+gameList[j]+ " option").remove();
                       $("#"+ gameList[j]).append("<option value=''></option>");
                       for (var k = 0; k < game.length; k++) {
                           $("#"+ gameList[j]).append("<option name='"+game[k].id+"' value='"+game[k].id+"'>"+game[k].game_name+"</option>");
                       }
                   }
               }
           })
       }
    });
    
    var  gameid_Arr=[];
    var  new_Arr=[];
        //
    function GetSelect(el){
        $(el).on("change", function () {
            var lodID =$("#onlineLL").children().eq(1).attr("name");

            $(el).attr('name',$(this).val());

            gameid_Arr.push($(el).val());
            for(var i=0;i<gameid_Arr.length;i++) {
                var items=gameid_Arr[i];
                if($(el).val() != ""){
                    if($.inArray(items,new_Arr)==-1) {
                        new_Arr.push(items);
                    }
                }
            }

          // var len = [["alone_game1",0],["alone_game2",0],["alone_game3",0],["alone_game4",0],["online_game1",0],["online_game2",0],["online_game3",0],["online_game4",0],["application_game1",0],["application_game2",0],["application_game3",0],["application_game4",0]];
          //   $(el).get(0).selectedIndex;
          //   var id = $(el).val();
          //   var items = [];
          //   for(var i=0;i<12;++i){
          //       gameid_Arr[i] = new Array();
          //       gameid_Arr[i][0] = el.id;
          //       gameid_Arr[i][1] = id;
          //
          //       for(var k =0;k <gameid_Arr.length;++k){
          //               items=gameid_Arr[k][0];
          //
          //           if(items == el.id) {
          //               result.push(gameid_Arr[i]);
          //           }
          //
          //
          //           if(gameid_Arr[i][0] == el.id) {
          //               gameid_Arr[i][1] = id;
          //
          //           }
          //
          //       }
          //
          //   }

            // for(var i=0;i<len.length;i++){
            //
            //     if(id != ""){
            //         if(len[i][0] == el.id) {
            //             gameid_Arr[i] = gameid_Arr.push(el.id, id);
            //             //gameid_Arr[i][1] = id;
            //
            //         }
            //    }
            // }
           // alert(gameid_Arr);
            });

    }

    function verriFrom(el) {
        var flag=true;
        $(el).find('input[type=text],textarea').each(function () {
            if($.trim($(this).val())==''||$.trim($(this).val())==null){
                flag=false;
                return false
            }
        });
        $(el).find('option:selected').each(function () {
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
        $(el).find('input[type=radio]:checked').length>0||(flag=false);

        return flag;
    }

});