// pages/page/myAnalysis/myAnalysis.js
Page({

  /**
   * Page initial data
   */
  data: {
    miniprog: [
      {
        icon:'../../../images/icon2.jpg',
        name:'腾讯表单',
        link:'txCloudFile',
        intro:'一款应用于表单操作的技术产品。',
      },
      {
        icon: '../../../images/icon1.jpg',
        name: '腾讯文档',
        link: 'txCloudFile',
        intro:'一款应用于文档操作的技术产品。',
      }
    ]
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

  txCloudFile: function(){
    wx.navigateToMiniProgram({
      appId: 'wxd45c635d754dbf59',
      fail: function(){
        console.log("failed")
        "跳个弹框说版本问题"
      }
    })
  }
})