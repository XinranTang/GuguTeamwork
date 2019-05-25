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
    color:{},
    menus1: [
      {
        "name": "我的任务",
        "func": "intoFunc1",
        "icon":"iconfont icon-taskmanege",
        //天蓝色
        "color":"#31A4E5"
      },
      {
        "name": "我的消息",
        "func": "intoFunc2",
        "icon": "iconfont icon-message",
        //橙黄色
        "color":"#FFB100",
      },
      {
        "name": "记事本",
        "url": "../../images/icon2.jpg",
        "func": "intoFunc6",
        "icon": "iconfont icon-submit",
        //翡翠绿
        "color":"#01C7B3",
      },
      {
        "name": "我要发起",
        "func": "intoFunc4",
        "icon":"iconfont icon-weibiaoti201",
        //樱桃红
        "color":"#FF6461",
      }
      ],
       menus2: [
     
      {
        "name": "个人信息",
        "func": "intoFunc5",
        "icon": "iconfont icon-ionc--1",
        //湖蓝
        "color":"#00C7E3"
      },
      {
        "name": "数据分析",
        "func": "intoFunc3",
        "icon": "iconfont icon-analyze",
        //翡翠绿
         "color": "#01C7B3",
      },
      {
        "name": "合作办公",
        "url": "../../images/icon2.jpg",
        "func": "intoFunc7",
        "icon": "iconfont icon-team"
      },
      {
        "name": "提交周报",
        "url": "../../images/icon2.jpg",
        "func": "intoFunc8",
        "icon": "iconfont icon-anonymous",
        "color":"#B671FA",
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
    this.setData({
      color:app.globalData.color
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
  getUserInfo: function (e) {
    var self = this;
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var openId = '';
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        openId = res.data.OpenId
        console.log(openId)
      },
    })
    wx.request({

      //【做了改动】 url: 'https://www.fracturesr.xyz/entry',
      url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        OpenId:"testopenid"
      },
      success(res) {
        wx.setStorage({
          key: 'Information',
          data: res.data,
        })
        app.globalData.tasks=res.data.Tasks;
        app.globalData.messages=res.data.Messages;
        console.log("在授权后取得用户信息成功")
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/getManageTrees',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success(res) {
            wx.setStorage({
              key: 'Forest',
              data: res.data,
            })
          }
        })
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/personal',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success(res) {
            wx.setStorage({
              key: 'Personal',
              data: res.data,
            })
            app.globalData.personal = res.data
          }
        })
      },
      fail() {
        console.log("在授权后取得用户信息失败")
      }
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  intoFunc1: function(){
    wx.navigateTo({
      url: '../page/myTask/myTask',
    })
  },
  intoFunc2: function () {
    wx.navigateTo({
      url: '../page/myMessage/myMessage',
    })
  },
  intoFunc3: function () {
    wx.navigateTo({
      url: '../page/myAnalysis/myAnalysis',
    })
  },
  intoFunc4: function () {
    wx.navigateTo({
      url: '../page/add/add',
    })
  },
  intoFunc5: function(){
    wx.navigateTo({
      url: '../page/myInfor/myInfor',
    })
  },
  intoFunc6: function () {
    wx.navigateTo({
      url: '../page/myMarkDown/myMarkDown',
    })
  },
  intoFunc7: function () {
    wx.navigateTo({
      url: '../page/myAssociate/myAssociate',
    })
  },
  intoFunc8:function(){
    wx.navigateTo({
      url: '../page/myReport/myReport',
    })
  },
  toPageSetting:function(){
    wx.navigateTo({
      url: '../page/myPageSetting/myPageSetting',
    })
  },
  toTree: function () {
    wx.navigateTo({
      url: '../tree/tree',
    })
  },
  toGiveMoney:function(){
    wx.navigateTo({
      url: '../page/mySponsor/mySponsor',
    })
  },
  toHelp:function(){
    wx.navigateTo({
      url: '../page/help/help',
    })
  },
  quit:function(){
    var self = this;
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/offline',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        OpenId: app.globalData.openId
      },
      success(res) {
        console.log(app.globalData.openId+" offline successfully");
      }
    })
    app.globalData.socketOpen = false;

    wx.closeSocket({
      success: function (res) {
        console.log("关闭socket成功");
      },
      fail: function (res) {
        console.log("关闭socket失败");
      }
    });
  }
})