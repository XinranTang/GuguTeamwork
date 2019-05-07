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
    noNeedToCheck:false,
    region: ['辽宁省', '沈阳市', '浑南区'],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var self = this;
    wx.getStorage({
      key: 'Personal',
      success: function(res) {
        self.setData({
          complete:(res.data.Name!=null),
          noNeedToCheck: (res.data.Name != null),
          userInfo:res.data
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
    if (app.globalData.personal!=null){
      self.setData({
        show:false,
        userInfo: app.globalData.personal
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
    if ((name == null || name.length == 0)&&self.data.noNeedToCheck==false){
      wx.showToast({
        title: '请填写真实姓名',
        icon:'none'
      })
    }else{
      if ((phone == null || phone.length == 0) && self.data.noNeedToCheck == false){
        wx.showToast({
          title: '请填写电话',
          icon:'none'
        })
      }else{
        if(name!=null&&name.length!=0){
          app.globalData.personal.Name = name;
        }
        if (sign != null && sign.length != 0){
          app.globalData.personal.Sign = sign;
       }
        if (phone != null && phone.length != 0){
          app.globalData.personal.Phone = phone;
        }
        if (mail != null && mail.length != 0){
          app.globalData.personal.Mail = mail;
        }
        if (position != null && position.length != 0){ // TODO： 这里有一个bug 没想好怎么改
          app.globalData.personal.Position = self.data.region.join("") + position
        }
        app.globalData.userInfo.Complete = true;
        this.setData({
          userInfo: app.globalData.personal,
          complete: true,
          noNeedToCheck:true,
        })
    //  // TODO: 向服务器发起post 【这个后端还没写】
    //     wx.request({
    //       url: 'https://www.fracturesr.xyz/gugu/personal',
    //       header: {
    //         'content-type': "application/x-www-form-urlencoded"
    //       },
    //       method: 'POST',
    //       data: {
            
    //       }
    //     })
      wx.getStorage({
        key: 'Personal',
        success: function(res) {
          res.data.Name = app.globalData.personal.Name;
          res.data.Sign = app.globalData.personal.Sign;
          res.data.Phone = app.globalData.personal.Phone;
          res.data.Mail = app.globalData.personal.Mail;
          res.data.Position = app.globalData.personal.Position;
          res.data.Complete = app.globalData.personal.Complete;

          wx.setStorage({
            key: 'Personal',
            data: res.data,
          })
        },
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
    //  // TODO: 向服务器发起post 【这个后端还没写】
    //     wx.request({
    //       url: 'https://www.fracturesr.xyz/gugu/personal',
    //       header: {
    //         'content-type': "application/x-www-form-urlencoded"
    //       },
    //       method: 'POST',
    //       data: {

    //       }
    //     })
  },
  createCard:function(){
    console.log("生成名片")
    //  // TODO: 向服务器发起post 【这个后端还没写】
    //     wx.request({
    //       url: 'https://www.fracturesr.xyz/gugu/personal',
    //       header: {
    //         'content-type': "application/x-www-form-urlencoded"
    //       },
    //       method: 'POST',
    //       data: {

    //       }
    //     })
  }
})