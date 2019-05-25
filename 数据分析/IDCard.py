import sqlite3 as db
import sys

def readFronSqllite(db_path, exectCmd):
    conn = db.connect(db_path)  # 该 API 打开一个到 SQLite 数据库文件 database 的链接，如果数据库成功打开，则返回一个连接对象
    cursor = conn.cursor()  # 该例程创建一个 cursor，将在 Python 数据库编程中用到。
    conn.row_factory = db.Row  # 可访问列信息
    cursor.execute(exectCmd)  # 该例程执行一个 SQL 语句
    rows = cursor.fetchall()  # 该例程获取查询结果集中所有（剩余）的行，返回一个列表。当没有可用的行时，则返回一个空的列表。
    return rows


# 解析ARPA 单帧信息
def readfromDB(content):
    infor = []
    subContent = content.split(',')
    infor.append(subContent)
    return infor


if __name__ == "__main__":

    openID = sys.argv[1]
    # 这里改一下绝对路径
    rows = readFronSqllite(
        'C://Users//gmf//Desktop//微信小程序大赛//咕咕TeamWork//GuguTeamwork//GuguTeamwork//SQLite3//UserInfor.db',
        " select * from user_infor where ID = '" + openID + "'")
    row = rows[0]  # 获取某一行的数据,类型是tuple

    a = [''] * 9
    c = ['个人简历', 'ID', 'Name', 'Sian', 'Sex', 'Phone', 'Mail', 'Postition', 'Ability']
    a[1] = row[0]
    a[2] = row[1]
    a[3] = row[2]
    a[4] = row[3]
    a[5] = row[4]
    a[6] = row[5]
    a[7] = row[6]
    a[8] = row[7]
    touxiang = ""
    if (a[4] == 1):
        touxiang = "gugu_male.jpg"
    else:
        touxiang = "gugu_female.jpg"

    f = open("idOut.html", "w", encoding='utf-8')
    str = "<!DOCTYPE html>" + \
          "<html>" + \
          "<head>" + \
          "  <meta charset=\"UTF-8\">" + \
          "  <title>Insert title here</title>" + \
          "<style type=\"text/css\">" + \
          "  #div1 {" + \
          "     width: 450px;" + \
          "    height: 400px;" + \
          "    margin: 100px auto;" + \
          "    background: #dddddd;" + \
          "    border-radius: 10px;" + \
          "   }" + \
 \
          "  #div2 {" + \
          "      width: 120px;" + \
          "       height: 120px;" + \
          "       background: blue;" + \
          "        position: absolute;" + \
          "       margin: -270px 70px 135px 300px;" + \
          "       border-radius: 60px;" + \
          "   }" + \
 \
          "    body {" + \
          "       background-clip: content-box;" + \
          "    }" + \
 \
          "    #photo {" + \
          "        position: relative;" + \
          "        top: 10px;" + \
          "        left: 10px;" + \
          "   }" + \
 \
          "     #photo1 {" + \
          "        width: 120px;" + \
          "        height: 120px;" + \
          "        border-radius: 120px;" + \
          "       }" + \
 \
          "      h3 {" + \
          "        position: relative;" + \
          "      left: 20px;" + \
          "   }" + \
 \
          "    h1 {" + \
          "            position: relative;" + \
          "           left: 20px;" + \
          "       }" + \
          "    </style>" + \
          "</head>" + \
          "<body>" + \
          "<div id=\"div1\">" + \
          "  <br/><h1>个人名片</h1>" + \
          "  <h3>" + a[2] + "</h3><br/>" + \
          "   <h3>个性签名：" + a[3] + "</h3>" + \
          "   <h3>电话 ：" + a[5] + "</h3>" + \
          "   <h3>邮箱：" + a[6] + "</h3>" + \
          "   <h3>地址：" + a[7] + "</h3>" + \
          "   <h3>能力：" + a[8] + "</h3>" + \
          "    <div id=\"div2\">" + \
          "       <img id=\"photo1\" src=\"" + touxiang + "\">" + \
          "    </div>" + \
          "</div>" + "</body>" + "</html>"
    print(str, end='', file=f)
    f.close()
