$(function () {

    $.ajax({
        url: '',
        type: 'GET',
        cache: false,
        data: {start: 0},
        processData: false,
        contentType: false,
        success: function (data) {
            var game = data;
            var html = '';
            for (var i = 0, j = game.length; i < j; i++) {
                html += '<tr>\n' +
                    '        <td>' + (i + 1) + '</td>\n' +
                    '        <td class="tb_id">' + user[i].id + '</td>\n' +
                    '        <td class="tb_name">' + user[i].name + '</td>\n' +
                    '        <td class="tb_title">' + user[i].title + '</td>\n' +
                    '        <td class="tb_sort">' + user[i].sort + '</td>\n' +
                    '        <td class="tb_address">' + user[i].address + '</td>\n' +
                    '        <td>\n' +
                    '            <button type="button" class="btn btn-primary edit_achievement" >编辑</button>\n' +
                    '            <button type="button" class="btn btn-danger delete_achievement" >删除</button>\n' +
                    '        </td>\n' +
                    '    </tr>'
            }
            $('#achievement_table>tr').remove();
            $('#achievement_table').append(html);
        }
    }).done(function (res) {
    }).fail(function (res) {
    });

    $('#search_cls>li').click(function () {
        $("#search_text").text($(this).find('a').text())
    });
});