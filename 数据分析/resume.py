import sqlite3 as db
def readFronSqllite(db_path,exectCmd):
    conn = db.connect(db_path)  # 该 API 打开一个到 SQLite 数据库文件 database 的链接，如果数据库成功打开，则返回一个连接对象
    cursor=conn.cursor()        # 该例程创建一个 cursor，将在 Python 数据库编程中用到。
    conn.row_factory=db.Row     # 可访问列信息
    cursor.execute(exectCmd)    #该例程执行一个 SQL 语句
    rows=cursor.fetchall()      #该例程获取查询结果集中所有（剩余）的行，返回一个列表。当没有可用的行时，则返回一个空的列表。
    return rows


# 解析ARPA 单帧信息
def readfromDB(content):
    infor = []
    subContent=content.split(',')
    infor.append(subContent)
    return infor
if __name__=="__main__":

    openID = input("OpenId:")
    # 这里改一下绝对路径
    rows=readFronSqllite('C://Users//gmf//Desktop//微信小程序大赛//咕咕TeamWork//GuguTeamwork//GuguTeamwork//SQLite3//UserInfor.db'," select * from user_infor where ID = '"+openID+"'")
    row=rows[0] # 获取某一行的数据,类型是tuple

    str = ""
    a = [''] * 9
    c = ['个人简历', 'ID', 'Name', 'Sign', 'Sex', 'Phone', 'Mail', 'Postition', 'Ability']
    a[1] = row[0]
    a[2] = row[1]
    a[3] = row[2]
    a[4] = row[3]
    a[5] = row[4]
    a[6] = row[5]
    a[7] = row[6]
    a[8] = row[7]
    f = open("out.txt", "w",encoding='utf-8')
    for i in range(9):
        if i != 0:
            a[i] = c[i] + '  ：  ' + a[i]
        else:
            a[i] = c[i]
    for i in range(65):
        print('*', end='', file=f)
    print('', file=f)
    for i in range(9):
        print('| ', end='', file=f)
        if len(a[i]) > 55:
            t = 0
            for j in a[i]:
                t = t + 1
                print(j, end='', file=f)
                if t == 52:
                    break
            for k in range(3):
                print('.', end='', file=f)
        else:
            t = int((55 - len(a[i])) / 2)
            for j in range(t):
                print(' ', end='', file=f)
            print(a[i], end='', file=f)
            for j in range(t):
                print(' ', end='', file=f)
        print(' ', end='', file=f)
        print('', file=f)
        if i != 8:
            for j in range(65):
                print('-', end='', file=f)
        else:
            for j in range(65):
                print('*', end='', file=f)
        print('', file=f)
    f.close()
