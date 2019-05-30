// pages/page/myAnalysis/myAnalysis.js
var wxCharts = require('../../../utils/wxcharts.js');
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
        new wxCharts({
          canvasId: 'task1Canvas',
          type:'ring',
          series: [{
            name: '总加入任务',
            // data: res.data.Totaljoin,
            data:3
          }, {
            name: '总管理任务',
            // data: res.data.TotalManage,
            data:2
          }],
          width: 320,
          height: 250,
          dataLabel: true
        });
        new wxCharts({
          canvasId: 'task2Canvas',
          type: 'ring',
          title:"项目状态分析",
          series: [{
            name: '正在进行任务',
            // data: res.data.Totaljoin,
            data: 3
          }, {
            name: '已完成任务',
            // data:res.data.Done,
            data: 4
            }, {
              name: '过期任务',
              // data: res.data.Totaljoin+res.data.TotalManage-res.data.Goingon,
              data: 1
            }],
          width: 320,
          height: 250,
          dataLabel: true
        });
        new wxCharts({
          canvasId: 'personalCanvas',
          title:"项目完成情况分析",
          type: 'pie',
          series: [{
            name: '被退回任务',
            // data: res.data.Setback,
            data: 3
          }, {
            name: '合格任务',
            // data:res.data.Done,
            data: 4
            },{
              name: '过期任务',
              // data: res.data.Totaljoin+res.data.TotalManage-res.data.Goingon,
              data: 1
            }],
          width: 320,
          height: 250,
          dataLabel: true
        });
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