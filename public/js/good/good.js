$(function () {

    $.ajax({
        url: 'http://192.168.2.199:3000/store/goods',
        type: 'GET',
        cache: false,
        data: {start: 0},
        processData: false,
        contentType: false,
        success: function (data) {
            var good = data.goods[0];
            var html = '';
            var good_type = '';
            var coin_type = '';
            for (var i = 0, j = good.length; i < j; i++) {
                if (good[i].good_type == 1 ) {
                    good_type = '虚拟商品'
                } else {
                    good_type = '实物商品'
                }
                if (good[i].coin_type == 1 ) {
                    coin_type = '成就点'
                } else {
                    coin_type = '平台币'
                }

                html += '<tr>\n' +
                    '        <td>' + (i + 1) + '</td>\n' +
                    '        <td class="tb_id">' + good[i].id + '</td>\n' +
                    '        <td class="tb_name">' + good[i].good_name + '</td>\n' +
                    '        <td class="tb_title">' + good[i].good_icon + '</td>\n' +
                    '        <td class="tb_sort">' + good_type + '</td>\n' +
                    '        <td class="tb_sort">' + coin_type + '</td>\n' +
                    '        <td class="tb_active_img">' + good[i].coin_value + '</td>\n' +
                    '        <td class="tb_active">' + good[i].stock + '</td>\n' +
                    '        <td class="tb_active">' + good[i].good_detail + '</td>\n' +
                    '        <td class="tb_id">' + good[i].add_time + '</td>\n' +
                    '        <td class="tb_name">' + good[i].remark + '</td>\n' +
                    '        <td class="tb_title">' + good[i].exp + '</td>\n' +
                    '        <td class="tb_active_img">' + good[i].system + '</td>\n' +
                    '        <td class="tb_active">' + good[i].region + '</td>\n' +
                    '        <td class="tb_active">' + good[i].start_time + '</td>\n' +
                    '        <td class="tb_title">' + good[i].end_time + '</td>\n' +
                    '        <td class="tb_active_img">' + good[i].now_stock + '</td>\n' +
                    '        <td class="tb_active">' + good[i].spec + '</td>\n' +
                    '        <td class="tb_active">' + good[i].cost + '</td>\n' +
                    '        <td>\n' +
                    '            <button type="button" class="btn btn-primary edit_good" >编辑</button>\n' +
                    '            <button type="button" class="btn btn-danger delete_good" >删除</button>\n' +
                    '        </td>\n' +
                    '    </tr>'
            }
            $('#good_table>tr').remove();
            $('#good_table').append(html);
        }
    }).done(function (res) {
    }).fail(function (res) {
    });

})