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
    var self = this;
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        self.setData({
          complete:(res.data.Name!=null)
        })
      },
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
  formSubmit: function(e){
    var self = this;
    let { name, sign, phone, mail,position } = e.detail.value;
    if(name==null||name.length==0){
      wx.showToast({
        title: '请填写真实姓名',
        icon:'none'
      })
    }else{
      if (phone == null || phone.length == 0){
        wx.showToast({
          title: '请填写电话',
          icon:'none'
        })
      }else{
        app.globalData.userInfo.Name = name;
        app.globalData.userInfo.Sign = sign;
        app.globalData.userInfo.Phone = phone;
        app.globalData.userInfo.Mail = mail;
        app.globalData.userInfo.Position = self.data.region.join("") + position
        app.globalData.userInfo.Complete = true;
        this.setData({
          userInfo: app.globalData.userInfo,
          complete: true
        })
      // 向服务器发起post
      wx.setStorage({
        key: 'UserInfor',
        data: app.globalData.userInfo,
      })
      }
    }
  },
  changeUserInfor:function(){
    this.setData({
      complete:false
    })
  },
  createResume:function(){
    console.log("生成简历")
  },
  createCard:function(){
    console.log("生成名片")
  }
})