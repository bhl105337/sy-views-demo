$(function () {

    $.ajax({
        url: 'http://192.168.2.199:3000/users/list',
        type: 'GET',
        cache: false,
        data: {start: 0},
        processData: false,
        contentType: false,
        success: function (data) {
            var user = data;
            var html = '';
            for (var i = 0, j = user.length; i < j; i++) {
                html += '<tr>\n' +
                    '        <td>' + (i + 1) + '</td>\n' +
                    '        <td class="">' + user[i].nick_name + '</td>\n' +
                    '        <td class="">' + user[i].coin + '</td>\n' +
                    '        <td class="">' + user[i].voucher + '</td>\n' +
                    '        <td class="">' + user[i].achievement_point + '</td>\n' +
                    '        <td class="">' + user[i].time_logon + '</td>\n' +
                    '        <td class="">' + user[i].tel + '</td>\n' +
                    '        <td class="">' + user[i].new_online + '</td>\n' +
                    '        <td class="">' + user[i].link + 'MB</td>\n' +
                    '        <td class="">' + user[i].sign + '</td>\n' +
                    '        <td class="">' + user[i].new_sign + 'MB</td>\n' +
                    '    </tr>'
            }
            $('#user_table>tr').remove();
            $('#user_table').append(html);
        }
    }).done(function (res) {
    }).fail(function (res) {
    });

    $('#search_cls>li').click(function () {
        $("#search_text").text($(this).find('a').text())
    });
});