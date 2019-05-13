// pages/page/myPageSetting/myPageSetting.js
const app = getApp();
Page({
  data: {
    StatusBar: {},
    CustomBar: {},
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42',
      light:'#fadbd9'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d',
      light:'#fde6d2'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08',
      light: '#fef2ce'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f',
      light: '#e8f4d9'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a',
      light: '#d7f0db'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4',
      light: '#d2f1f0'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff',
      light: '#cce6ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6',
      light: '#e1d7f0'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0',
      light: '#ebd4ef'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997',
      light: '#f9d7ea'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f',
      light: '#ede1d9'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3',
      light: '#e7ebed'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa',
      light: '#fadbd9'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333',
      light: '#f1f1f1'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff',
      light: '#ffffff'
    },
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var self = this;
    wx.getSystemInfo({
      success: e => {
        let custom = wx.getMenuButtonBoundingClientRect();
        self.setData({
          StatusBar : e.statusBarHeight,
          Custom : custom,
          CustomBar : custom.bottom + custom.top - e.statusBarHeight
        })
      }
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
  changeColor1: function(e){
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
    app.globalData.color.Blue = this.data.ColorList[index].color;
    //修改topbar颜色
    wx.setNavigationBarColor({
      backgroundColor: this.data.ColorList[index].color,
      frontColor: "#ffffff"
    });
    if(index ==0){
      index = 1;
    }
    app.globalData.color.Orange = this.data.ColorList[14 - index].color;
    wx.navigateBack({});
  },
  changeColor2: function (e) {
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
    app.globalData.color.Blue = this.data.ColorList[index].light;
    wx.setNavigationBarColor({
      backgroundColor: app.globalData.color.Blue,
      frontColor: '#ffffff'
    });
    if (index == 0) {
      index = 1;
    }
    app.globalData.color.Orange = this.data.ColorList[index].color;
    wx.navigateBack({});
  }
})