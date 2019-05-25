// pages/page/myReport/myReport.js
var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    name: "name2",
    ctasks: [],
    color: {}
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

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var self = this;
    self.setData({
      tasks: app.globalData.tasks,
      color: app.globalData.color,
      ctasks: []
    })
    var manage = '';
    wx.getStorage({
      key: 'UserInfor',
      success: function (res) {
        manage = res.data.Manage;
        var arr = manage.split(";");
        var t;
        var a;
        t = app.globalData.tasks;
        console.log(t)
        t.forEach(task => {
          var flag = false;
          arr.forEach(item => {
            console.log(item)
            if (item == task.TaskID) {
              flag = true;
            }
          })
          if (!flag) {
            a = self.data.ctasks;
            self.setData({
              ctasks: a.concat(task)
            })
          }
        })
      },
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
  toTask: function (e) {// TODO: debug!!!
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var id = dataSet.id;
    var index = e.currentTarget.dataset.index;
    let flag = false;
    console.log(id) // taskID
    wx.chooseImage({
      success: function(res) {
        let user = "";
        wx.getStorage({
          key: 'UserInfor',
          success: function(res) {
            user = res.data.OpenId
            // 调用服务器接口
            const tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                user: user
              },
              success(res) {
                const data = res.data
                // do something
              }
            })
          },
        })
        

      },
    })
  }
})