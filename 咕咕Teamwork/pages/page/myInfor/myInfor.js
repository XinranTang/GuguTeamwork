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
    console.log(name)
    if ((name == undefined || name.length == 0)&&self.data.noNeedToCheck==false){
      wx.showToast({
        title: '请填写真实姓名',
        icon:'none'
      })
    }else{
      if ((phone == undefined || phone.length == 0) && self.data.noNeedToCheck == false){
        wx.showToast({
          title: '请填写电话',
          icon:'none'
        })
      }else{
        if (name != undefined &&name.length!=0){
          console
          app.globalData.personal.Name = name;
        }else{
          console.log("undifined name")
        }
        if (sign != undefined && sign.length != 0){
          app.globalData.personal.Sign = sign;
       }
        if (phone != undefined && phone.length != 0){
          app.globalData.personal.Phone = phone;
        }
        if (mail != undefined && mail.length != 0){
          app.globalData.personal.Mail = mail;
        }
        if (position != undefined && position.length != 0){ // TODO： 这里有一个bug 没想好怎么改
          app.globalData.personal.Position = self.data.region.join("") + position
        }
        console.log("globalpersonal"+app.globalData.personal.Name);
        app.globalData.userInfo.Complete = true;
        this.setData({
          userInfo: app.globalData.personal,
          complete: true,
          noNeedToCheck:true,
        })
     // TODO: 向服务器发起post 【这个后端还没写】
     // 
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/setPersonal',
          method: 'GET', 
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            ID:app.globalData.openId,
            Name: app.globalData.personal.Name,
            Sex:"",
            Ability:"",
            Sign: app.globalData.personal.Sign,
            Phone: app.globalData.personal.Phone,
            Mail: app.globalData.personal.Mail,
            Position: app.globalData.personal.Position,
          },
          success:function(e){
            wx.showToast({
              title: '设置个人信息成功!',
              icon:'none'
            })
            //为什么要先get再set?
            wx.getStorage({
              key: 'Personal',
              success: function (res) {
                console.log(res.data);
                res.data.ID = app.globalData.personal.ID;
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
    // 逻辑：服务器用用户信息生成图片
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