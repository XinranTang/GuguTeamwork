// pages/page/myInfor/myInfor.js
var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    show:true,
    complete:false,
    userInfo:null,
    region: ['辽宁省', '沈阳市', '浑南区'],
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
    if (app.globalData.userInfo!=null){
      self.setData({
        show:false,
        userInfo:app.globalData.userInfo
      })
      if (app.globalData.userInfoComplete) {
        self.setData({
          complete: true
        })
      }
    }
    
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
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
})