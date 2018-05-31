$(function () {
    Date.prototype.Format = function(formatStr)
    {
        var str = formatStr;
        var Week = ['日','一','二','三','四','五','六'];

        str=str.replace(/yyyy|YYYY/,this.getFullYear());
        str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

        str=str.replace(/MM/,this.getMonth()>9?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));
        str=str.replace(/M/g,this.getMonth());

        str=str.replace(/w|W/g,Week[this.getDay()]);

        str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
        str=str.replace(/d|D/g,this.getDate());

        str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
        str=str.replace(/h|H/g,this.getHours());
        str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
        str=str.replace(/m/g,this.getMinutes());

        str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
        str=str.replace(/s|S/g,this.getSeconds());

        return str;
    };
    function getCurrentMonthFirst(){
        var date=new Date();
        date.setDate(1);
        return date;
    }
    function getCurrentMonthLast(){
        var date=new Date();
        var currentMonth=date.getMonth();
        var nextMonth=++currentMonth;
        var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
        var oneDay=1000*60*60*24;
        return new Date(nextMonthFirstDay-oneDay);
    }
   $.ajax({
       url:config.ip+'/admin/getQudao',
       data:{},
       type:"get",
       success:function (data) {
           if(data.state){
               var op='<option value="0"  style="display:none;" disabled>请选择渠道</option>';
               for(var i=0;i<data.qudao.length;i++){
                   op+='<option value="'+data.qudao[i].id+'">'+data.qudao[i].comment+'</option>'
               }
               $("#qudao_select,#add_qudao_select").append(op);
               $("#qudao_select,#add_qudao_select").val(0);
           }
       }
   });
    $("#add_qudao_btn").click(function () {
        if($("#add_qudao_select").val()&&$("#add_qudao_date").val()&&$("#add_qudao_active").val()&&$("#add_qudao_new").val()&&$("#add_qudao_current").val()&&$("#add_qudao_income").val()){
            $.ajax({
                url:config.ip+'/admin/addQudao',
                data:{
                    add_num:$("#add_qudao_new").val(),
                    date:$("#add_qudao_date").val(),
                    qudao_id:$("#add_qudao_select").val(),
                    active_num:$("#add_qudao_active").val(),
                    income:$("#add_qudao_income").val(),
                    current:$("#add_qudao_current").val()
                },
                type:"get",
                success:function (data) {
                    if(data.state){
                        Ewin.alert("添加成功！").on(function (r) {
                            if(r){
                                window.location.reload()
                            }
                        })
                    }else {
                        Ewin.alert("添加失败！")
                    }
                }
            })
        }else {
            Ewin.alert("有空选项！")
        }
    });
    $("#type_select").change(function () {
        if($("#type_select").val()==1){
            $("#qd_li").removeClass("hidden");
            $("#er_li").addClass("hidden");
        }else if($("#type_select").val()==2){
            $("#qd_li").addClass("hidden");
            $("#er_li").removeClass("hidden");
        }
    });
    $("#search").click(function () {
        if($("#type_select").val()==1){
            $.ajax({
                url:config.ip+'/admin/getQudaoshow',
                data:{
                    qudao_id:$("#qudao_select").val(),
                    startTime:$("#startTime").val()||getCurrentMonthFirst().Format("yyyy-MM-dd"),
                    endTime:$("#endTime").val()||getCurrentMonthLast().Format("yyyy-MM-dd")
                },
                type:"get",
                success:function (data) {
                    if(data.state){
                        var html="";
                        for(var i=0;i<data.data.length;i++){
                            html+='<tr>\n' +
                                '        <td>'+data.data[i].add_date+'</td>\n' +
                                '        <td>'+data.data[i].add_num+'</td>\n' +
                                '        <td>'+data.data[i].active_num+'</td>\n' +
                                '        <td>'+data.data[i].current+'</td>\n' +
                                '        <td>'+data.data[i].income+'</td>\n' +
                                '    </tr>'
                        }
                        $("#qudao_table").removeClass("hidden");
                        $("#click_table").addClass("hidden");
                        $("#qd_show_tb").empty();
                        $("#qd_show_tb").append(html)
                    }
                }
            })
        }else if($("#type_select").val()==2){
            $.ajax({
                url:config.ip+'/admin/getQudaoClick',
                data:{
                    type:$("#qudao_select_er").val(),
                    startTime:$("#startTime").val()||getCurrentMonthFirst().Format("yyyy-MM-dd"),
                    endTime:$("#endTime").val()||getCurrentMonthLast().Format("yyyy-MM-dd")
                },
                type:"get",
                success:function (data) {
                    if(data.state){
                        var html="";
                        for(var i=0;i<data.data.length;i++){
                            html+='<tr>\n' +
                                '        <td>'+data.data[i].add_date+'</td>\n' +
                                '        <td>'+data.data[i].add_num+'</td>\n' +
                                '    </tr>'
                        }
                        $("#qudao_table").addClass("hidden");
                        $("#click_table").removeClass("hidden");
                        $("#qd_click_tb").empty();
                        $("#qd_click_tb").append(html)
                    }
                }
            })
        }
    })
});