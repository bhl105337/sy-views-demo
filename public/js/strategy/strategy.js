$(function () {
    var page=1;
    initTable('',page);
    $(".pagination").on("click",".pageIndex",function () {
        page=$(this).text();
        initTable($('#search_input').val(),page)
    });
    $('#choPageBtn').click(function () {
        if($('#choPage').val()){
            page = $('#choPage').val();
            initTable($('#search_input').val(),page);
        }else {
            return
        }
    });
    $('#search_btn').click(function () {
        initTable($('#search_input').val(),1)
    });
    $("#t_strategy").on("click",".delete_strategy",function () {
        var strategyId = $(this).attr('data-id');
        $.ajax({
            type:'get',
            url:config.ip+"/adminStrategy/deleteStrategy",
            data:{
                strategyId:strategyId
            },
            success:function (data) {
                if(data.state){
                    Ewin.alert("删除成功").on(function (r) {
                        r && window.location.reload()
                    })
                }else {
                    Ewin.alert('删除失败！')
                }
            }
        })
    });
    $("#t_strategy").on("click",".essence_strategy",function () {
        var strategyId = $(this).attr('data-id');
        var essence = $(this).attr('data-essence');
        $.ajax({
            type:'get',
            url:config.ip+"/adminStrategy/essence",
            data:{
                strategyId:strategyId,
                essence:essence
            },
            success:function (data) {
                if(data.state){
                    Ewin.alert("成功").on(function (r) {
                        r && window.location.reload()
                    })
                }else {
                    Ewin.alert('失败！')
                }
            }
        })
    })
});
function initTable(msg,page) {
    $.ajax({
        type:'get',
        url:config.ip+'/adminStrategy/getStrategyByMsgPage',
        data:{
            msg:msg,
            page:page
        },
        success:function (data) {
            if(data.state){
                var strategy=data.strategy;
                var html='';
                initPage(Math.ceil(data.len/30));
                for(var i=0;i<strategy.length;i++){
                    html+=' <tr>\n' +
                        '<td>'+(i+1+(page-1)*30)+'</td>\n' +
                        '<td>'+strategy[i].nick_name+'</td>\n' +
                        '<td>'+strategy[i].game_name+'</td>\n' +
                        '<td>'+strategy[i].title+'</td>\n' +
                        '<td>' +
                        '<button type="button" class="btn btn-primary essence_strategy" data-id="'+strategy[i].id+'" data-essence="'+strategy[i].essence+'" >'+(strategy[i].essence ? '取消' : '精华')+'</button>' +
                        '<button type="button" class="btn  btn-danger delete_strategy" data-id="'+strategy[i].id+'">删除</button>' +
                        '</td>\n' +
                        ' </tr>'
                }
                $('#t_strategy').empty().append(html);
            }else {

            }
        }
    })
}
function initPage(len) {
    if(len<=5){
        var li='';
        $(".pageIndex").remove();
        for(var i=0;i<len;i++){
            li+='<button class="pageIndex">'+(i+1)+'</button>';
        }
        $(".pagination").append(li);
        $(".pagination").show()
    }else {
        var li='';
        $(".pageIndex").remove();
        for(var i=0;i<len;i++){
            if(i<5){
                li+='<button class="pageIndex">'+(i+1)+'</button>';
            }
        }
        $('#allPageNum').text('总页数：'+len);
        $(".pagination").append(li);
        $(".pagination").show()
    }

}