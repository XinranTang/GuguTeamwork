// pages/home/home.js
var app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    messages: [],
    tasks:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    var that = this;
    wx.request({
      url: 'https://www.fracturesr.xyz/entry',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: 'OpenId=testopenid',
      success(res) {
        app.globalData.tasks = res.data.Tasks;
        app.globalData.messages = res.data.Messages;
        that.setData({
          messages: res.data.Messages,
          tasks: res.data.Tasks
        })
      }
    })
    // wx.getStorage({
    //   key: 'Information',
    //   success: function (res) {
    //     that.setData({
    //       messages: res.data.Messages,
    //       tasks: res.data.Tasks
    //     })
    //   }
    // })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.setData({
      messages:app.globalData.messages,
      tasks:app.globalData.tasks
    })
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
  // 页面跳转
  toMessage:function(e){
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;

    app.globalData.currentMessageIndex = index;
    app.globalData.messages = self.data.messages;
    wx.navigateTo({
      url: '../process/messageList/message',
    })
  },
  toTask: function (e) {
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
   
    app.globalData.currentTaskIndex = index;
    app.globalData.tasks = self.data.tasks;
    wx.navigateTo({
      url: '../process/taskList/task',
    });
  }
})