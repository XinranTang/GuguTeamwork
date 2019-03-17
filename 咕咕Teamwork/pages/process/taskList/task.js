// pages/process/taskList/task.js
var app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    "title":'测试',
    "pusher":'',
    "content":'',
    "status":false,
    "pushDate":"",
    "deadLine":"",
    "urgency":0,
    "task":null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var self = this;
    var list = app.globalData.tasks;
    var index = app.globalData.currentTaskIndex;
    var currentTask = list[index];
    self.setData({
      task:currentTask,
      title:currentTask.Title,
      pusher:currentTask.Pusher,
      content:currentTask.Content,
      status:currentTask.Status,
      pushDate:currentTask.PushDate,
      deadLine:currentTask.DeadLine,
      urgency:currentTask.Urgency
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

  }
})