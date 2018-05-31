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
    // console.log(getCurrentMonthFirst().Format("yyyy-MM-dd"),getCurrentMonthLast().Format("yyyy-MM-dd"));
    $.ajax({
        url:config.ip+'/admin/getQudaoshow',
        data:{
            qudao_id:sessionStorage.getItem("uid"),
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
                $("#qd_show_tb").empty();
                $("#qd_show_tb").append(html)
            }

        }
    });
    $("#search").click(function () {
            $.ajax({
                url:config.ip+'/admin/getQudaoshow',
                data:{
                    qudao_id:sessionStorage.getItem("uid"),
                    startTime:$("#startTime").val(),
                    endTime:$("#endTime").val()
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
                        $("#qd_show_tb").empty();
                        $("#qd_show_tb").append(html)
                    }

                }
            })
    })
});