// pages/mine/mine.js
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menus: [
      {
        "name": "我的任务",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc1",
        "icon":"iconfont icon-taskmanege",
      },
      {
        "name": "我的消息",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc2",
        "icon": "iconfont icon-message",
      },
      {
        "name": "个人分析",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc3",
        "icon": "iconfont icon-analyze"
      },
      {
        "name": "发起任务",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc4",
        "icon":"iconfont icon-weibiaoti201"
      },
      {
        "name": "个人信息",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc5",
        "icon": "iconfont icon-ionc--1"
      }, 
      {
        "name": "提交周报",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc6",
        "icon": "iconfont icon-submit"
      },
      {
        "name": "合作文档",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc7",
        "icon": "iconfont icon-team"
      },
      {
        "name": "匿名墙",
        "url": "../../images/icon2.jpg",
        "func": "infoFunc8",
        "icon": "iconfont icon-anonymous"
      }
      ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})