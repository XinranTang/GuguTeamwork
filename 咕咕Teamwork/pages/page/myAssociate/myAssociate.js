// pages/page/myAnalysis/myAnalysis.js
Page({

  /**
   * Page initial data
   */
  data: {
    miniprog: [
      {
        icon: '../../../images/tencentFile.png',
        name: '腾讯文档',
        link: 'txCloudFile',
        intro: '一款应用于文档操作的技术产品。',
      },
      {
        icon: '../../../images/wps.jpg',
        name: 'wps表单',
        link: 'wpsForm',
        intro:'一款应用于信息收集的技术产品。',
      },
      {
        icon: '../../../images/avote.jpg',
        name: '腾讯投票助手',
        link: 'txVoteAssis',
        intro: '一款应用于多人投票的技术产品。',
      },
      {
        icon: '../../../images/check.png',
        name: '小小签到',
        link: 'littleCheck',
        intro: '一款应用于线上签到的技术产品。',
      },
      {
        icon: '../../../images/Receipt.png',
        name: '微信发票助手',
        link: 'wxReceiptAssis',
        intro: '一款应用于发票格式的技术产品。',
      },
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
  },
  wpsForm: function () {
    wx.navigateToMiniProgram({
      appId: "wx53f22ed6915cdf17",
      fail: function () {
        console.log("failed")
        "跳个弹框说版本问题"
      }
    })
  },
  txVoteAssis: function () {
    wx.navigateToMiniProgram({
      appId: "wxa2ad902d74975650",
      fail: function () {
        console.log("failed")
        "跳个弹框说版本问题"
      }
    })
  },
  littleCheck: function () {
    wx.navigateToMiniProgram({
      appId: "wxee55405953922c86",
      fail: function () {
        console.log("failed")
        "跳个弹框说版本问题"
      }
    })
  },
  wxReceiptAssis: function () {
    wx.navigateToMiniProgram({
      appId: "wx1af4f6aa3a537c1a",
      fail: function () {
        console.log("failed")
        "跳个弹框说版本问题"
      }
    })
  }
})