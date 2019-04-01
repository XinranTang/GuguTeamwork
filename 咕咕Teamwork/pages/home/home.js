// pages/home/home.js
var app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * Page initial data
   */
  data: {
    hour:0,
    schedule:{
      timestamp:null,
      year:0,
      month:"",
      day:0,
      hour:0,
      weekDay:"",
  },
    color:{},
    messages: [],
    tasks:[]
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
    this.setData({
      messages:app.globalData.messages,
      tasks:app.globalData.tasks
    })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var date = new Date();
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    console.log(date.getHours())
    this.setData({
      messages:app.globalData.messages,
      tasks:app.globalData.tasks,
      color: app.globalData.color,
      hour: date.getHours(),
      schedule: {
        timestamp: Date.parse(new Date()) / 1000 ,
        year: date.getFullYear(),
        month: date.getMonth()+"月",
        day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        hour: date.getHours(),
        weekDay:show_day[date.getDay()],
      },
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  lower:function(e){
    //加一天的时间戳：  
    var tomorrow_timetamp = this.data.schedule.timestamp + 24 * 60 * 60;
    //加一天的时间：  
    var n_to = tomorrow_timetamp * 1000;
    var tomorrow_date = new Date(n_to);
    //加一天后的年份  
    var Y_tomorrow = tomorrow_date.getFullYear();
    //加一天后的月份  
    var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
    //加一天后的日期  
    var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
    //加一天后的时刻  
    var h_tomorrow = tomorrow_date.getHours();  
    // console.log(e.currentTarget.dataset.id)
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    this.setData({
      schedule:{
        day:D_tomorrow,
        month: M_tomorrow,
        year:Y_tomorrow,
        hour: 0,
        weekDay: show_day[tomorrow_date.getDay()],
        timestamp:tomorrow_timetamp
      }
    })
  },
  // 页面跳转
  toMessage:function(e){
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;

    app.globalData.currentMessageIndex = index;
    app.globalData.messages = self.data.messages;
    wx.navigateTo({
      url: '../process/messageList/message',
    })
  },
  toTask: function (e) {
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
   
    app.globalData.currentTaskIndex = index;
    app.globalData.tasks = self.data.tasks;
    wx.navigateTo({
      url: '../process/taskList/task',
    });
  }
})