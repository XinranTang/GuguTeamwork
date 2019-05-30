// invitation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviter:"",
    taskid:"",
    taskname:"",
    user:""
  },
  inviteConfirm: function (e) {
    var json ={

    }
    //通过了
    json.TypeCode = 101;
    wx.sendSocketMessage({
      data: JSON.stringify(json),
      success: function (res) {
        console.log("101Code发送成功")
        var msg = {
          "Title": "任务邀请被接受",
          "Pusher": self.data.user,
          "Content": "恭喜,您"  + "发起的对" + self.data.user + "的任务邀请被接受了,一起愉快地工作吧。",
          "NotRead": self.data.inviter + ";",
          "FinalDeleteDate": "2050-05-30 00:00:00"
        }
        self.sendMessage(msg);
        wx.showToast({
          title: '加入成功',
          icon:'none'
        })
        wx.navigateTo({
          url: '../home/home',
        })
      },
      fail: function (e) {
        console.log("101Code发送失败")
        wx.navigateTo({
          url: '../home/home',
        })
      }
    })
  },
  inviteCancel: function (e) {
    var self = this;
    var json ={

    }
    //拒绝了
    json.TypeCode = 102;
    wx.sendSocketMessage({
      data: JSON.stringify(json),
      success: function (res) {
        console.log("102Code发送成功")
        var msg = {
          "Title": "任务邀请被拒绝",
          "Pusher": self.data.user,
          "Content": "咕咕,您" + "发起的对" + self.data.user + "的任务邀请被拒绝了。",
          "NotRead": self.data.inviter + ";",
          "FinalDeleteDate": "2050-05-30 00:00:00"
        }
        self.sendMessage(msg);
      },
      fail: function (e) {
        console.log("102Code发送失败")
      }
    })
    console.log("拒绝邀请");

  },

  sendMessage: function (json) {
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/newMessage',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: JSON.stringify(json),
      dataType: JSON,
      success: function (res) {
        console.log("发送消息成功");
      },
      fail: function (res) {
        console.log("消息发送失败");
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let argus = options.scene.split("&");
      //&是我们定义的参数链接方式
      let inviter = argus[0];
      let taskid = argus[1];
      let taskname = argus[2];
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})