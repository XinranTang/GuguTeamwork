import sqlite3 as db
import matplotlib.pyplot as plt
import sys

plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

def readFronSqllite(db_path,exectCmd):
    conn = db.connect(db_path)  # 该 API 打开一个到 SQLite 数据库文件 database 的链接，如果数据库成功打开，则返回一个连接对象
    cursor=conn.cursor()        # 创建一个 cursor，将在 Python 数据库编程中用到。
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
    # openID = input("OpenId:")
    # 这里改一下绝对路径
    results=readFronSqllite('C://Users//gmf//Desktop//微信小程序大赛//咕咕TeamWork//GuguTeamwork//GuguTeamwork//SQLite3//UserInfor.db'," select totalmanage,totaljoin,goingon from user_infor where ID = '"+sys.argv[1]+"'")
    result = list(results[0])
    plt.pie(result[:2],colors=['#88caed','#f86e3d'],autopct='%1.1f%%',labels = [u'我管理的任务', u'我加入的任务'])
    plt.title(u"任务分布情况")
    plt.savefig("1.jpg")
    plt.show()
    result.append(result[0]+result[1]-result[2])
    plt.pie(result[2:], colors=['#88caed', '#f86e3d'], autopct='%1.1f%%', labels=[u'未完成任务', u'已完成任务'])
    plt.title(u"任务完成情况")
    plt.savefig("2.jpg")
    plt.show()