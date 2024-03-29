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
    name:"name2",
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
        if(app.globalData.tasks!=null){
          manage = res.data.Manage;
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
                flag = true;
              }
            })
            if (!flag) {
              a = self.data.ctasks;
              self.setData({
                ctasks: a.concat(task)
              })
            }
          })
        }
        wx.getStorage({// 【这里这么写对吗】
          key: 'Forest',
          success: function(res) {
            console.log("获得本地的Forest"+res.data)
            self.setData({
              mtasks:res.data
            })
          },
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
    let flag = false;
    console.log(id)
    wx.getStorage({
      key: 'Forest',
      success: function(res) {
        let tempData = res.data;
        tempData.forEach(each=>{
          if(each.TreeId == id){
            flag = true;// 从树堆里找到了任务id
            app.globalData.currentTaskIndex = index;
            app.globalData.tasks = self.data.tasks;
            app.globalData.currentTask = each;// 只能直接把任务附上去了。。。
            wx.navigateTo({
              url: '../../process/taskList/task',
            });
          }
        })
        if(!flag){
          wx.getStorage({
            key: 'UserInfor',
            success: function (res) {

              var arr = [];
              flag = false;
              arr = res.data.Manage.split(";");
              arr.forEach(each => {
                if (each == id) {
                  flag = true;
                  // app.globalData.currentTaskIndex = index;
                  // app.globalData.tasks = self.data.tasks;
                  // app.globalData.currentTask = self.data.mtasks[index];
                  // wx.navigateTo({
                  //   url: '../../process/taskList/task',
                  // });
                }
              })
              if (!flag) {
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
      },
    })
    
  }
})