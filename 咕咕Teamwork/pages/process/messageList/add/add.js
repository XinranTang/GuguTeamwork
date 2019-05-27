// pages/process/messageList/add/add.js
Page({

  /**
   * Page initial data
   */
  data: {
    msg_title: '',
    msg_content: '',
    socket_open: false,
    msg_to_who: 'testopenid',
    date: '2020-01-01',
    time: '12:00',
    user: "",
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindTitleChange: function(e) {
    this.setData({
      msg_title: e.detail.value
    })
  },
  bindContentChange: function(e) {
    this.setData({
      msg_content: e.detail.value
    })
  },
  bindToWhoChange: function(e) {
    this.setData({
      msg_to_who: e.detail.value
    })
  },
  onClickSend: function(e) {
    var self = this;
    if (self.data.msg_title == "" || self.data.msg_title.length == 0) {
      wx.showToast({
        title: '请输入消息标题',
        icon: 'none'
      })
      return;
    }
    if (self.data.msg_content == "" || self.data.msg_content.length == 0) {
      wx.showToast({
        title: '请输入消息内容',
        icon: 'none'
      })
      return;
    }
    var json = {
      "Title": self.data.msg_title,
      "Pusher": self.data.user,
      "Content": self.data.msg_content,
      "NotRead": "testopenid;",
      "FinalDeleteDate": self.data.date + " " + self.data.time + ":00"
    };

    console.log(json);

    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/newMessage',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: JSON.stringify(json),
      dataType: JSON,
      success: function(res) {
        console.log("发送消息成功");
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function(res) {
        console.log("消息发送失败");
      }
    })


  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(e) {
    var self = this;
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        self.setData({
          user: res.data.OpenId
        })
        console.log("获得了OpenID" + self.data.user);
      },
    })

    // //websocket
    // var sock = null
    // var wsuri = "wss://www.fracturesr.xyz/guguWss/online";
    // var openId = self.data.user;
    // console.log("ws:" + self.data.user);
    // wx.connectSocket({
    //   url: wsuri
    // })

    // wx.onSocketMessage(function(res) {
    //   console.log('收到服务器信息' + JSON.stringify(res));
    // })

    // wx.onSocketOpen(function(res) {
    //   self.setData({
    //     socket_open: true
    //   })
    //   console.log("socket open");
    //   wx.sendSocketMessage({
    //     data: self.data.user,
    //     success: function(res) {
    //       console.log("发送openId:" + self.data.user);
    //     }
    //   })
    // })



    // wx.onSocketClose(function(res) {
    //   //如果是60s自动断开则restart
    //   console.log("socket_open:" + self.data.socket_open)
    //   if (self.data.socket_open) {
    //     console.log('socket close');
    //     console.log('socket restart');
    //     wx.connectSocket({
    //       url: wsuri
    //     })
    //   } else {
    //     console.log('quit page, socket close');
    //   }
    // })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {
    this.setData({
      socket_open: false
    })
    console.log("page unload");
    // wx.closeSocket({
    //   success: function(res) {
    //     console.log("关闭socket成功");
    //   },
    //   fail: function(res) {
    //     console.log("关闭socket失败");
    //   }
    // });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})