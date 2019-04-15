// pages/page/myMarkDown/add/add.js
var app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    content: '',
    holder:"请输入文字，不能为空"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (e) {
    var self =this
    var id = e.id;
    if (id) {
      getData(id, this);
    } else {
      this.setData({
        id: Date.now()
      })
    }
    if (app.globalData.markDownChoice == 0) {
      self.setData({
        content: "消息：" + app.globalData.messages[app.globalData.currentMessageIndex].Title + "\n内容：" + app.globalData.messages[app.globalData.currentMessageIndex].Content
      })
    } else if (app.globalData.markDownChoice == 1) {

    } else {

    }
  },
  /**
   * input change事件
   */
  change:function(e) {
    var val = e.detail.value;
    this.setData({
      content: val
    });
  },
  /**
  * cancel 事件
  */
  cancel:function() {
    wx.navigateBack();
  },

  sure:function() {
    var reg = /^\s*$/g;
    if (!this.data.content || reg.test(this.data.content)) {
      wx.showToast({
        title: '不能为空',
        icon:'none'
      })
      return;
    }
    this.setData({
      time: Date.now()
    });
    setValue(this);
    wx.navigateBack();
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

  }
})
/**
 * 根据跳转的url中的id获取编辑信息回填
 */
function getData(id, page) {
  var arr = wx.getStorageSync('txt');
  if (arr.length) {
    arr.forEach((item) => {
      if (item.id == id) {
        page.setData({
          id: item.id,
          content: item.content
        })
      }
    })
  }
}

/**
 * 设置填写的信息，分编辑、新增
 */
function setValue(page) {
  var arr = wx.getStorageSync('txt');
  var data = [], flag = true;
  if (arr.length) {
    arr.forEach(item => {
      if (item.id == page.data.id) {
        item.time = Date.now();
        item.content = page.data.content;
        flag = false;
      }
      data.push(item);
    })
  }
  if (flag) {
    data.push(page.data);
  }
  wx.setStorageSync('txt', data);
}