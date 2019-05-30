// pages/process/messageList/message.js
var app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    "title": '测试',
    "pusher": '',
    "content": '',
    "status": false,
    "pushDate": "",
    "finalDeleteDate": "",
    "message": null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var self = this;
    var list = app.globalData.messages;
    var index = app.globalData.currentMessageIndex;
    var currentMessage = list[index];
    self.setData({
      message: currentMessage,
      title: currentMessage.Title,
      pusher: currentMessage.Pusher,
      content: currentMessage.Content,
      status: currentMessage.Status,
      pushDate: currentMessage.PushDate,
      finalDeleteDate: currentMessage.FinalDeleteDate
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  iKnow:function(){
    this.setData({
      status:true
    })
    var list = app.globalData.messages;
    var index = app.globalData.currentMessageIndex;
    var currentMessage = list[index];
    var openid = app.globalData.openId;
   // currentMessage.Status = true;
    //告诉服务器读过了
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/readMessage?OpenId='+openid+'&MessageID='+currentMessage.MessageID,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'GET',
      success(res) {
        console.log(currentMessage.MessageID + "已读");
        currentMessage.HaveRead.push(openid);
        wx.showToast({
          title: '已标记为已读',
        })
      }
    })
  },
  markDown:function(){
    app.globalData.markDownChoice=0;
    wx.navigateTo({
      url: '../../page/myMarkDown/add/add',
    })
  }
})