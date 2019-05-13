// pages/page/myAssociate/myAssociate.js
  const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo: { },//当前用户信息
      cpId: 0,
      userAInfo: { },//用户信息
      userBInfo: { },//好友信息
      yaoqing: true,//邀请按钮
      start: false,//开始按钮
      usershow: false,//用户B是否显示
      userInfoAnickname: "",
      userInfoAimageurl: "",
      userInfoBimageurl: "",
      userInfoBnickname: "",
      Loadingtime: '',//定时器
      flag: false
    },

    /**
     * 
     * 生命周期函数--监听页面加载
     */
    onLoad(opt) {

      const that = this
        this.setData({
        cpId: opt.cpId,
      })
        console.log(this.data.cpId + "battle页面获取到的cpId")
        //获取到个人信息
        if(app.globalData.userInfo) {
        this.setData({
          //userInfo: app.globalData.userInfo,
          userInfoAnickname: app.globalData.userInfo.nickName,
          userInfoAimageurl: app.globalData.userInfo.avatarUrl,
        })
        console.log(111)
      }
        console.log(this.data.userInfo)

        //根据scene判断是否为邀请者还是被邀请者。1为邀请者，2为被邀请者。
        if(opt.scene == 2) {//如果为2，则表示该页面来自转发
  wx.request({//后台根据cpId和用户B的个人信息找出对应cp表的所有信息，如果用户B没有对应的cpId，则将其加入到此cpId所在的信息中。并把对应的userBstatus变为1表示在线。
    url: getApp().data.url + 'battle.htm',
    method: 'POST',
    data: {
      cpId: this.data.cpId,
      userBnickname: app.globalData.userInfo.nickName,
      userBimageurl: app.globalData.userInfo.avatarUrl,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res.data);
      console.log(res.data[0].wxuser.imageurl);
      console.log(res.data[0].wxuser.nickname);
      that.setData({
        userInfoAnickname: res.data[0].wxuser.nickname,
        userInfoAimageurl: res.data[0].wxuser.imageurl,
        userInfoBimageurl: res.data[0].wxuserB.imageurl,
        userInfoBnickname: res.data[0].wxuserB.nickname,
        yaoqing: false,
        start: true,
        usershow: true
      })

    }
  })
}


wx.showShareMenu({
  withShareTicket: true,
  success: function (res) {
    // 分享成功
    console.log('shareMenu share success')
    console.log('分享' + res)
  },
  fail: function (res) {
    // 分享失败
    console.log(res)
  }
})
that.setData({
  Loadingtime: setInterval(function () {
    console.log("循环执行代码" + that.data.cpId)//循环执行代码
    if (!that.data.flag) {
      wx.request({
        url: getApp().data.url + 'share.htm',
        method: 'POST',
        data: {
          cpId: that.data.cpId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data + "邀请成功的回调");
          that.setData({
            userInfoAnickname: res.data[0].wxuser.nickname,
            userInfoAimageurl: res.data[0].wxuser.imageurl,
            userInfoBimageurl: res.data[0].wxuserB.imageurl,
            userInfoBnickname: res.data[0].wxuserB.nickname,
            yaoqing: false,
            start: true,
            usershow: true,
            flag: true
          })
        }
      })
    }

  }, 2000)
})

    },

/*onUnload: function () {
  clearInterval(this.data.Loadingtime)
},
onHide: function () {
  clearInterval(this.data.Loadingtime)
},*/


onShareAppMessage: function (res) {
  const that = this
  console.log('this.data', this.data.cpId)
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
  return {
    title: '一起加入完美cp闯关吧！',
    path: '/pages/battle/battle?scene=2&cpId=' + this.data.cpId,

    success: function (res) {
      console.log('res.shareTickets[0]' + res.shareTickets[0])
      wx.getShareInfo({
        shareTicket: res.shareTickets[0],
        success: function (res) { 'success' + console.log(res) },
        fail: function (res) { 'fail' + console.log(res) },
        complete: function (res) { 'complete' + console.log(res) }
      })
      //去服务器根据cpId找出好友是否上线的字段。上线了则根据cpId找出所有好友信息以及用户的个人信息
      clearInterval(this.data.Loadingtime)
    },
    fail: function (res) {
      // 分享失败
      console.log(res)
    }
  }

},
//点击开始游戏进入到关卡页面
toLevel: function () {
  clearInterval(this.data.Loadingtime)
  wx.redirectTo({
    url: '../levels/levels?cpId=' + this.data.cpId
  })
}
})