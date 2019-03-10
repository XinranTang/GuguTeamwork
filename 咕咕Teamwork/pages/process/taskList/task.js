// pages/process/taskList/task.js
Page({

  /**
   * Page initial data
   */
  data: {
    "name":'测试',
    "deadline":'',
    "description":''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.request({
      url:'https://www.fracturesr.xyz/entry',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: 'OpenId=testopenid',
      success(res){
        console.log(res.data)
      }
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