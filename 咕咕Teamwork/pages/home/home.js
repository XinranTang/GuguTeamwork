// pages/home/home.js
var app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * Page initial data
   */
  data: {
    isSchedule:false,
    nowSchedule:{"title":"","content":""},
    nowScheduleIndex:0,
    hiddenmodalput:true,
    hiddenDel:true,
    previourIndex:0,
    hour:0,
    choose:false,
    chooseIndex:-1,
    editInfo:{
      title:"",
      content:""
    },
    schedule:{
      timestamp:null,
      year:0,
      month:"",
      day:0,
      hour:0,
      weekDay:"",
  },
    dateNow:'',
    color:{},
    colorArr: ["#ff6666", "#cc6666", "#ffcc99", "#6699ff", "#ff9966",
      "#99cc99", "#ff9999", "#99cccc", "#cc99cc", "#99cccc", "#cc9999",
      "#6699cc", "#999999", "#6699cc", "#99cc99", "#FF674F", "#E9967A",
      "#99ccc9", "#66cccc", "#9999cc", "#cc6699", "#ffcc66", "#99ff99",
      "#66ccff", "#68A2D5", "#ff99cc", "#DB7093", "#88caed", "#607B8B"],
      
    // 存储随机颜色
    randomColorArr: [],
    randomColorArrT: [],
    messages: [],
    tasks:[],
    //任务邀请
    invitations:[],
    nowInvitation:{},
    currentInvitationIndex:0,
    //任务审批
    checks:[],
    nowCheck:{},
    currentCheckIndex:0,
    list: [
      { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }
       ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var self = this
    var date = new Date()
    var sdate =""+ date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()
    self.setData({
      dateNow:sdate
    })
    console.log(options.id)
    wx.getStorage({
      key: 'Schedule',
      success: function (res) {
        // console.log(res.data)
        if(res.data!=null){
          res.data.forEach(each=>{
            if(each.Date==sdate){
              self.setData({
                list:each.List
              })
            }
          })
          // self.setData({
          //   list: res.data
          // })
        }
      },
      fail:function(res){
        console.log("从本地获取日程表失败")
      }
    });
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); 
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  
    this.setData({
      messages:app.globalData.messages,
      tasks:app.globalData.tasks,
      invitations:app.globalData.invitations,
      checks:app.globalData.checks,
    })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var self = this
    var date = new Date();
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
// <<<<<<< HEAD
    this.setData({
      messages:app.globalData.messages,
      tasks:app.globalData.tasks,
      color: app.globalData.color,
      invitations: app.globalData.invitations,
      checks: app.globalData.checks,
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
    var self = this
    let labLen = self.data.messages.length;
    let labLenT = self.data.tasks.length;
    let colorArr = self.data.colorArr;
    let colorLen = colorArr.length;
    let randomColorArr = [];
    // console.log("本地任务数量")
    // console.log(self.data.tasks.length)
    //判断执行
    do {
      let random = colorArr[Math.floor(Math.random() * colorLen)];
      randomColorArr.push(random);
      labLen--;
    } while (labLen > 0)
// =======
    wx.getStorage({
      key: 'Forest',
      success: function(res) {
        let eachItem = app.globalData.tasks;
        let forests = res.data;
        let flag = false;
        if(app.globalData.tasks.length!=0){
          for (var i = 0; i < eachItem.length; i++) {
            flag = false;
            forests.forEach(each => {
              if (eachItem[i].TaskID == each.TreeId) {
                flag = true;
              }
            })
            if (!flag) {
              eachItem.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
              i--; // 如果不减，将漏掉一个元素
            }
          }
        }
        self.setData({
          messages: app.globalData.messages,
          tasks: eachItem,
          color: app.globalData.color,
          hour: date.getHours(),
          schedule: {
            timestamp: Date.parse(new Date()) / 1000,
            year: date.getFullYear(),
            month: (date.getMonth() + 1) + "月",
            day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            hour: date.getHours(),
            weekDay: show_day[date.getDay()],
          },
        })
        let labLen = self.data.messages.length;
        let labLenT = self.data.tasks.length;
        let colorArr = self.data.colorArr;
        let colorLen = colorArr.length;
        let randomColorArr = [];
        // console.log("本地任务数量")
        // console.log(self.data.tasks.length)
        //判断执行
        do {
          let random = colorArr[Math.floor(Math.random() * colorLen)];
          randomColorArr.push(random);
          labLen--;
        } while (labLen > 0)
// >>>>>>> 01aa5433c395ee219ac6a0ce2e413f0ecc05c494

        self.setData({
          randomColorArr: randomColorArr
        });
        randomColorArr = [];

        do {
          let random = colorArr[Math.floor(Math.random() * colorLen)];
          randomColorArr.push(random);
          labLenT--;
        } while (labLenT > 0)
        self.setData({
          randomColorArrT: randomColorArr
        });
    // console.log(randomColorArr)
// <<<<<<< HEAD
// =======
      
    // self.setData({
    //   messages: app.globalData.messages,
    //   tasks: app.globalData.tasks,
    //   invitations: app.globalData.invitations
    // })
  }
  
  })
// >>>>>>> 01aa5433c395ee219ac6a0ce2e413f0ecc05c494
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    let self = this;
    let arr = this.data.list;
    arr.forEach(each=>{
      if(each.choosen){
        each.choosen = false;
        each.color="#eeeeee";
      }
    })
    self.setData({
      list:arr
    })
    var obj = wx.getStorage({
      key: 'Schedule',
      success: function (res) {
        res.data.forEach(each => {
          if (each.Date == self.data.dateNow) {
            each.List = self.data.list;
            each.List.forEach(item => {
              if (item.choosen == true) {
                item.choosen = false;
              }
            })
            wx.setStorage({
              key: 'Schedule',
              data: res.data,
            })
          }
        })
      },
      fail: function () {
        wx.setStorage({
          key: 'Schedule',
          data: [{ "Date": self.data.dateNow, 'List': self.data.list },],
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    var self = this;
    var obj = wx.getStorage({
      key: 'Schedule',
      success: function(res) {
        res.data.forEach(each=>{
          if(each.Date==self.data.dateNow){
            each.List = self.data.list;
            each.List.forEach(item=>{
              if(item.choosen==true){
                item.choosen = false;
              }
            })
            wx.setStorage({
              key: 'Schedule',
              data: res.data,
            })
          }
        })
      },
      fail:function(){
        wx.setStorage({
          key: 'Schedule',
          data: [{"Date":self.data.dateNow,'List':self.data.list},],
        })
      }
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
    var self = this;
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    var format = e.detail.value.replace(/-/g, '/')
    var countDown =new Date(format)
    var wd = show_day[countDown.getDay()]
    var tmonth = e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) + "月" : e.detail.value.slice(5, 7) + "月"
    wx.getStorage({
      key: 'Schedule',
      success: function(res) {
        // console.log("现在日期" + (e.detail.value.slice(0, 4) + "" + (e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) : e.detail.value.slice(5, 7)) + "" + e.detail.value.slice(8, 10)))
        var flag = false;
        res.data.forEach(each=>{
          if(each.Date==self.data.dateNow){
            // console.log("对应")
            each.List = self.data.list
            flag=true;
          }
        })
        if(!flag){
          // console.log("push当前"+self.data.dateNow)
          res.data.push({
            "Date":self.data.dateNow,
            "List":self.data.list
          })
        }
        flag = false;
        res.data.forEach(each=>{
          if (each.Date == (e.detail.value.slice(0, 4) + "" + (e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) : e.detail.value.slice(5, 7) )+""+ e.detail.value.slice(8, 10))){
            // console.log("对应le")
            // console.log(each)
            flag = true;
            self.setData({
              list:each.List,
              schedule: {
                year: e.detail.value.slice(0, 4),
                month:tmonth,
                day:e.detail.value.slice(8,10),
                weekDay:wd
              },
              dateNow: (e.detail.value.slice(0, 4) + "" + (e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) : e.detail.value.slice(5, 7)) + "" + e.detail.value.slice(8, 10))
            })
            wx.setStorage({
              key: 'Schedule',
              data: res.data,
            })
          }
        })
        if(!flag){// 原本缓存里没有现在的日期
          // res.data.forEach(each => {
          //   if (each.Date == self.data.dateNow) {// 找之前的
          //     each.List = self.data.list;
          //     console.log(self.data.list)
          //     flag=true;
          //     ///// 找到了之前的
          //     wx.setStorage({
          //       key: 'Schedule',
          //       data: res.data,
          //     })
          //   }
          // })
          // if (!flag) {// 没找到之前的
          //   res.data.push({
          //     "Date": self.data.dateNow,
          //     "List": self.data.list
          //   })
            wx.setStorage({
              key: 'Schedule',
              data: res.data,
            })
          // }
          self.setData({
            list: [{ t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }],
            schedule: {
              year: e.detail.value.slice(0, 4),
              month: tmonth,
              day: e.detail.value.slice(8, 10),
              weekDay: wd
            },
            dateNow: (e.detail.value.slice(0, 4) + "" + (e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) : e.detail.value.slice(5, 7)) + "" + e.detail.value.slice(8, 10))
          })
        }
      },
      fail:function(){
        
        self.setData({
          list: [{ t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }, { t: null, color: "#eeeeee", choosen: false, hasTask: false }],
          schedule: {
            year: e.detail.value.slice(0, 4),
            month: tmonth,
            day: e.detail.value.slice(8, 10),
            weekDay: wd
          },
          dateNow: (e.detail.value.slice(0, 4) + "" + (e.detail.value[5] == '0' ? e.detail.value.slice(6, 7) : e.detail.value.slice(5, 7)) + "" + e.detail.value.slice(8, 10))
        })
        // console.log("现在日期ne" + self.data.dateNow)
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
  editChange:function(e){
    var _edit_info = this.data.editInfo;
    var type = e.target.dataset.type;
    _edit_info[type] = e.detail.value;
    this.setData({
      editInfo: _edit_info
    });
  },
  formSubmit:function(e){
    if (this.data.editInfo.title == "" | this.data.editInfo.title.length == 0){
      wx.showToast({
        title: '请输入日程标题',
        icon: 'none'
      })
      return;
    }
    var i = this.data.chooseIndex;
    // console.log(e)
    this.setData({
      // [`list[${i}].t`]: { Title: e.detail.value.title,Content:e.detail.value.content},
      [`list[${i}].t`]: { Title: this.data.editInfo.title, Content: this.data.editInfo.content },
      [`list[${i}].hasTask`]: true,
      choose: false,
      [`list[${i}].color`]: app.globalData.color.Orange,
      [`list[${i}].choosen`]: false,
      hiddenmodalput:true,

    })
  },
  cancel:function(){
    this.setData({
      hiddenmodalput: true,
      editInfo:{
        title:"",
        content:""
      }
    })
  },
  //查看日程-确认
  addTaskCancel:function(e){
      this.setData({
        isSchedule: false,
      })
  },
  //查看日程-点击删除
  addTaskDel:function(e){
    var i = this.data.nowScheduleIndex;
    this.setData({
      [`list[${i}].t`]: null,
      [`list[${i}].hasTask`]: false,
      choose: false,
      [`list[${i}].color`]: "#eeeeee",
      [`list[${i}].choosen`]: false,
      isSchedule: false,
    })
  },
  //添加日程-new
  addTask:function(e){
    var i = e.currentTarget.dataset.index;
    this.setData({
      nowScheduleIndex:i
    });
    if (this.data.list[i].hasTask) {
      //just把showModal改成了自定义模态
      this.setData({
        isSchedule : true,
        nowSchedule:{
          "title": this.data.list[i].t.Title,
          "content": this.data.list[i].t.Content
        }
      });
    } else {
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

  //添加日程-old
  addTaskOld:function(e){
    var i = e.currentTarget.dataset.index;
    var self = this;
    if(this.data.list[i].hasTask){
      var self = this;
      wx.showModal({ 
        cancelText:"删除任务",
        cancelColor:"red",
        confirmText:"确定",
        confirmColor:"black",
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
    // wx.setStorage({
    //   key: 'Schedule',
    //   data: [ { "Date": self.data.dateNow, 'List': self.data.list }],
    // })
  },
  onDel:function(e){

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
  toMyMessage:function(e){
    wx.navigateTo({
      url: '../page/myMessage/myMessage',
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
      // console.log(this.data.list[i])
    }else{
      var self = this;
      var dataSet = e.currentTarget.dataset;
      var index = dataSet.index;
      var task = this.data.tasks[index];
      console.log(e.currentTarget.dataset)
      wx.getStorage({
        key: 'Forest',
        success: function(res) {
          let tempData = res.data;
          let flag = false;
          tempData.forEach(each=>{
            if(each.TreeId == task.TaskID){
              console.log("找到了"+each.TreeId)
              flag = true;
              app.globalData.currentTaskIndex = index;
              app.globalData.tasks = self.data.tasks;
              app.globalData.currentTask = each;
              wx.navigateTo({
                url: '../process/taskList/task',
              });
            }
          })
          if(!flag){
            app.globalData.currentTaskIndex = index;
            app.globalData.tasks = self.data.tasks;
            app.globalData.currentTask = task;
            wx.navigateTo({
              url: '../process/taskList/task',
            });
          }
        },
      })
    }
  },
  toMyTask:function(e){
    wx.navigateTo({
      url: '../page/myTask/myTask',
    })
  },
  inviteIgnore:function(e){
    this.setData({
      onInvite: false
    })
  },
  inviteConfirm:function(e){
    var json = JSON.parse(JSON.stringify(this.data.nowInvitation));
    var temp = json.Receiver;
    json.Receiver = json.Sender;
    json.Sender = temp;
    //通过了
    json.TypeCode = 101;
    wx.sendSocketMessage({
      data:JSON.stringify(json),
      success:function(res){
        console.log("101Code发送成功")
      },
      fail:function(e){
        console.log("101Code发送失败")
      }
    })
    this.setData({
      onInvite: false
    })
    app.globalData.invitations.splice(this.data.currentInvitationIndex, 1);
  },
  inviteCancel:function(e){
    var json = JSON.parse(JSON.stringify(this.data.nowInvitation));
    var temp = json.Receiver;
    json.Receiver = json.Sender;
    json.Sender = temp;
    //拒绝了
    json.TypeCode = 102;
    wx.sendSocketMessage({
      data: JSON.stringify(json),
      success: function (res) {
        console.log("102Code发送成功")
      },
      fail: function (e) {
        console.log("102Code发送失败")
      }
    })
    this.setData({
      onInvite: false
    })
    console.log("拒绝邀请");
    //删除本地的invitation[index]
    app.globalData.invitations.splice(this.data.currentInvitationIndex,1);
  },
  //点击了任务邀请
  onClickInvite:function(e){
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
    var invitation = this.data.invitations[index];
    console.log(e.currentTarget.dataset)

    this.setData({
      onInvite: true,
      currentInvitationIndex: index,
      nowInvitation: this.data.invitations[index]
    })
    console.log(this.data.nowInvitation);
  },
  // 任务审批通过
  checkConfirm:function(e){
    var json = JSON.parse(JSON.stringify(this.data.nowCheck));
    var temp = json.Receiver;
    json.Receiver = json.Sender;
    json.Sender = temp;
    //拒绝了
    json.TypeCode = 51;
    wx.sendSocketMessage({
      data: JSON.stringify(json),
      success: function (res) {
        console.log("51Code发送成功")
        //发一条消息通知任务审批通过
        var msg = {
          "Title": "任务审批通过",
          "Pusher": json.Sender,
          "Content": "恭喜,您在" + json.TimeOut + "发起的对" + json.ContentId + "任务的进度完成审批通过了。",
          "NotRead": json.Receiver + ";",
          "FinalDeleteDate": "2050-05-30T00:00:00Z"
        };
        sendMessage(msg);
      },
      fail: function (e) {
        console.log("51Code发送失败")
      }
    })
    this.setData({
      onCheck: false
    })
    //删除本地的checks[index]
    app.globalData.checks.splice(this.data.currentCheckIndex, 1);
  },
  //任务审批驳回
  checkCancel:function(e){
    var json = JSON.parse(JSON.stringify(this.data.nowCheck));
    var temp = json.Receiver;
    json.Receiver = json.Sender;
    json.Sender = temp;
    //拒绝了
    json.TypeCode = 52;
    wx.sendSocketMessage({
      data: JSON.stringify(json),
      success: function (res) {
        console.log("52Code发送成功")
        //发一条消息通知任务审批驳回
        var msg = {
          "Title": "任务审批被驳回",
          "Pusher": json.Sender,
          "Content": "很遗憾,您在" + json.TimeOut + "发起的对" + json.ContentId + "任务的进度完成审批被驳回了。",
          "NotRead": json.Receiver + ";",
          "FinalDeleteDate": "2050-05-30T00:00:00Z"
        };
        sendMessage(msg);
      },
      fail: function (e) {
        console.log("52Code发送失败")
      }
    })
    this.setData({
      onCheck: false
    })
    //删除本地的checks[index]
    app.globalData.checks.splice(this.data.currentCheckIndex, 1);
  },
  checkIgnore:function(e){
    this.setData({
      onCheck: false
    })
  },
  onClickCheck:function(e){
    var self = this;
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
    var check = this.data.checks[index];
    this.setData({
      onCheck: true,
      currentCheckIndex: index,
      nowCheck: this.data.checks[index]
    })
    console.log(this.data.nowCheck);
  },
  sendMessage:function(json){
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/newMessage',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: JSON.stringify(json),
      dataType: JSON,
      success: function (res) {
        console.log("发送消息成功");
      },
      fail: function (res) {
        console.log("消息发送失败");
      }
    })
  }
})