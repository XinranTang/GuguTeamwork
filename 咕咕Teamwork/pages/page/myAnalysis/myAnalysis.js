// pages/page/myAnalysis/myAnalysis.js

var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    name: 'name1',
    user:'',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var openid = app.globalData.openId;
    this.setData({
      user:openid
    })
    var self = this;
    //获取个人数据
    wx.request({
      url: 'https://www.fracturesr.xyz//gugu/personalsta',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "GET",
      data:{
        OpenId:openid
      },
      dataType: JSON,
      success: function(res) {
        console.log(res.data);
      }
    })
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