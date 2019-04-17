// pages/page/myTask/myTask.js
var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    mtasks:[],
    ctasks:[],
    tasks:[],
    name:"name1",
    color:{}
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
    var self = this;
    self.setData({
      tasks:app.globalData.tasks,
      color:app.globalData.color,
      ctasks:[],
      mtasks:[]
    })
    var manage='';
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        manage=res.data.Manage;
        var arr = manage.split(";");
        var t;
        var a;
        t = app.globalData.tasks;
        console.log(t)
        t.forEach(task => {
          var flag = false;
          arr.forEach(item => {
            console.log(item)
            if (item == task.TaskID) {
              a = self.data.mtasks;
              self.setData({
                mtasks: a.concat(task)
              })
              flag=true;
            }             
          })
          if(!flag){
            a = self.data.ctasks;
            self.setData({
              ctasks: a.concat(task)
            })
          }
        })
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
  addTask:function(){
    wx.navigateTo({
      url: '../../process/taskList/add/add',
    })
  },
  toTask:function(e){// TODO: debug!!!
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var id = dataSet.id;
    var index = e.currentTarget.dataset.index;
    console.log(id)
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        var arr = [];
        let flag = false;
        arr = res.data.Manage.split(";");
        arr.forEach(each=>{
          if(each==id){
            flag=true;
            app.globalData.currentTaskIndex = index;
            app.globalData.tasks = self.data.tasks;
            app.globalData.currentTask = self.data.mtasks[index];
            wx.navigateTo({
              url: '../../process/taskList/task',
            });
          }
        })
        if(!flag){
          app.globalData.currentTaskIndex = index;
          app.globalData.tasks = self.data.tasks;
          app.globalData.currentTask = self.data.ctasks[index];
          wx.navigateTo({
            url: '../../process/taskList/task',
          });
        }
      },
    })
  }
})