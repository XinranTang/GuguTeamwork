// pages/home/home.js
var app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * Page initial data
   */
  data: {
    hiddenmodalput:true,
    previourIndex:0,
    hour:0,
    choose:false,
    chooseIndex:-1,
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
    tasks:[],
    list: [
      { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }
       ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var self = this
    wx.getStorage({
      key: 'Schedule',
      success: function (res) {
        console.log(res.data)
        if(res.data!=null){
          self.setData({
            list: res.data
          })
        }
      },
      fail:function(res){
        console.log("从本地获取日程表失败")
      }
    })
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
    this.setData({
      messages:app.globalData.messages,
      tasks:app.globalData.tasks,
      color: app.globalData.color,
      hour: date.getHours(),
      schedule: {
        timestamp: Date.parse(new Date()) / 1000 ,
        year: date.getFullYear(),
        month: (date.getMonth()+1)+"月",
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
    var self = this
    wx.setStorage({
      key: 'Schedule',
      data: self.data.list,
    })
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
  DateChange(e) {
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    var format = e.detail.value.replace(/-/g, '/')
    var countDown =new Date(format)
    var wd = show_day[countDown.getDay()]
    var tmonth = e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) + "月" : e.detail.value.slice(5, 7) + "月"
    this.setData({
      schedule:{
        year: e.detail.value.slice(0, 4),
        month:tmonth,
        day:e.detail.value.slice(8,10),
        weekDay:wd
      }
    })
  },
  addMySchedule:function(e){
    var i = e.currentTarget.dataset.index;
    if(this.data.list[i].hasTask){
      wx.showToast({
        title: '已存在任务！',
        icon:'none'
      })
    }else{
      this.setData({
        choose: true,
        chooseIndex: i,
        [`list[${i}].choosen`]: true,
        [`list[${i}].color`]: "#cccccc",
      })
      this.setData({
        hiddenmodalput: false
      })
    }
  },
  formSubmit:function(e){
    var i = this.data.chooseIndex;
    console.log(e)
    this.setData({
      [`list[${i}].t`]: { Title: e.detail.value.title,Content:e.detail.value.content},
      [`list[${i}].hasTask`]: true,
      choose: false,
      [`list[${i}].color`]: app.globalData.color.Orange,
      [`list[${i}].choosen`]: false,
      hiddenmodalput:true,

    })
  },
  cancel:function(){
    this.setData({
      hiddenmodalput: true
    })
  },
  addTask:function(e){
    var i = e.currentTarget.dataset.index;
    
    if(this.data.list[i].hasTask){
      var self = this;
      wx.showModal({ 
        cancelText:"删除任务",
        confirmText:"确定",
        title: this.data.list[i].t.Title, 
        content: this.data.list[i].t.Content, 
        success: function (res) { 
          if (res.confirm) { 
            console.log('进入任务') 
            } 
            else if (res.cancel) { 
              self.setData({
                [`list[${i}].t`]: null,
                [`list[${i}].hasTask`]: false,
                choose: false,
                [`list[${i}].color`]: "#eeeeee",
                [`list[${i}].choosen`]: false,
              })
            } 
          } 
        })
    }else{
      this.setData({
        choose: true,
        chooseIndex: e.currentTarget.dataset.index,
        [`list[${i}].choosen`]: true,
        [`list[${i}].color`]: "#cccccc",
      })
      if (this.data.previourIndex != i) {
        if (this.data.list[this.data.previourIndex].color == "#cccccc") {
          this.setData({
            [`list[${this.data.previourIndex}].choosen`]: false,
            [`list[${this.data.previourIndex}].color`]: "#eeeeee",
          })
        }
      }
      this.setData({
        previourIndex: e.currentTarget.dataset.index
      })
    }
  },
  addMyTask:function(e){

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
    if(this.data.choose==true){
      var self = this;
      var dataSet = e.currentTarget.dataset;
      var index = dataSet.index;
      var task = this.data.tasks[index];
      var i = this.data.chooseIndex;
      var key = this.data.list[i];
      this.setData({
        [`list[${i}].t`] :task,
        [`list[${i}].hasTask`]: true,
        choose: false,
        [`list[${i}].color`]:app.globalData.color.Blue,
        [`list[${i}].choosen`]: false,
      })
      console.log(this.data.list[i])
    }else{
      var self = this;
      var dataSet = e.currentTarget.dataset;
      var index = dataSet.index;

      app.globalData.currentTaskIndex = index;
      app.globalData.tasks = self.data.tasks;
      wx.navigateTo({
        url: '../process/taskList/task',
      });
    }
  }
})