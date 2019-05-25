//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    // wx.getStorageSync(key)，获取本地缓存
    var logs = wx.getStorageSync('logs') || []
    // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.windowHeight = res.windowHeight
        that.globalData.windowWidth = res.windowWidth
      }
    })
    // 登录
    wx.login({
      success: res => {

        console.log("code:"+res.code);
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/entry',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            data: res.code
          },
          success: function (res) {
            console.log("code's data");
            console.log(res.data)
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success: function(res) {
            wx.setStorage({
              key: 'UserInfor',
              data: res.data,
            })
            console.log(res.data)

            //--------------连接WebSocket-------------

            var openid = res.data.OpenId;
            var wsuri = "wss://www.fracturesr.xyz/guguWss/online";

            wx.connectSocket({
              url: wsuri
            })

            wx.onSocketMessage(function(res) {
              console.log('收到服务器信息');
              var json = JSON.parse(res.data);
              console.log(json);
              //如果是邀请信息，加入invitations
              if (json.TypeCode == 100) {
                that.globalData.invitations.push(json);
                console.log(that.globalData.invitations);
              }
              //如果是任务审批信息，加入checks
              if(json.TypeCode == 50){
                that.globalData.checks.push(json);
                console.log(that.globalData.checks);
              }
            })

            wx.onSocketOpen(function(res) {
              console.log("socket open");
              if (!that.globalData.socketOpen) {
                wx.sendSocketMessage({
                  data: openid,
                  success: function(res) {
                    console.log("发送openId:" + openid);
                  }
                })
              }
              that.globalData.socketOpen = true;
            })

            wx.onSocketClose(function(res) {
              //如果是60s自动断开则restart
              console.log("socketOpen:" + that.globalData.socketOpen)
              if (that.globalData.socketOpen) {
                console.log('socket close');
                console.log('socket restart');
                wx.connectSocket({
                  url: wsuri
                })
              } else {
                console.log('quit page, socket close');
              }
            })

            //--------------连接WebSocket-------------

          },
          fail() {
            console.log("fail")
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // 设置globalData.userInfo
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          // 获取本地异步缓存信息
          wx.getStorage({
            key: 'Information',
            success: function(res) {
              console.log("succeeded in get local information")
            },
            // 失败：即本地无当前用户信息
            fail: function() {
              // 向服务器发起POST
              wx.request({
                url: 'https://www.fracturesr.xyz/entry',
                header: {
                  'content-type': "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                  'code': "res.data"
                },
                success(res) {
                  wx.setStorage({
                    key: 'Information',
                    data: 'res.data',
                  })
                },
                fail() {
                  console.log("fail")
                }

              })
            }
          })
        } else {
          console.log("fail to get infor")
        }
      }
    })
  },
  onLoad: function() {

  },
  onUnload: function() {
    var self = this;
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/offline',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        OpenId: self.globalData.openId
      },
      success(res) {
        console.log(self.globalData.openId + "offline successfully");
      }
    })
    this.globalData.socketOpen = false;

    wx.closeSocket({
      success: function(res) {
        console.log("关闭socket成功");
      },
      fail: function(res) {
        console.log("关闭socket失败");
      }
    });
  },
  globalData: {
    socketOpen: false,
    openId: 'testopenid',
    userInfo: null,
    personal: null,
    userInforComplete: false,
    windowHeight: 0,
    windowWidth: 0,
    currentTaskIndex: 0,
    currentMessageIndex: 0,
    currentTask: {},
    markDownChoice: 2,
    //任务审批
    checks:[],
    invitations: [],
    tasks: [],
    messages: [],
    color: {
      "Blue": '#88caed',
      'Orange': '#f86e3d'
    }
  }
})