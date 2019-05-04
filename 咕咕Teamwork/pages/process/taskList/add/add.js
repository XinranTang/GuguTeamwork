// pages/process/taskList/add/add.js
// 服务器数据库字段名
var TREE = 'Tree';
var TREE_NAME = 'TreeName';
var TREE_ID = 'TreeID';
var TASK = 'Task';
var TASK_ID = 'TaskID';
var TITLE = 'Title';
var PUSHER = 'Pusher';
var CONTENT = 'Content';
var STATUS = 'Status';
var PUSH_DATE = 'PushDate';
var DEADLINE = 'DeadLine';
var URGENCY = 'Urgency';
var SELF = 'Self';
var CHILD = 'Child';
var TEAM_MATES = 'TeamMates'
var app = getApp();
import CanvasDrag from '../../../../components/canvas-drag/canvas-drag';
var util = require('../../../../utils/util.js')
Page({
  /**
   * Page initial data
   */
  data: {
    name: '',
    deadline: '',
    infor: '',
    hide: false,
    x:0,
    y:0,
    h:220,
    w:220,
    date: '2000-01-01',
    time: '12:00',
    text_selected_node: '...',
    createTask:false,
    tempT:{},
    edit_info: {
      Title: '',
      DeadLine: '',
      Content: ''
    },
    isSelected: false,
    isEdit:false,
    oneTaskTree: {
      "Tree": [
        
      ],
      "TreeId": "testtasktree",
      "TreeName": "testproject"
    },
    graph: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      h : app.globalData.windowHeight,
      w : app.globalData.windowWidth
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },
  /**
     * 添加测试图片
     */
  onAddTest() {
    this.setData({
      graph: {
        w: 120,
        h: 120,
        type: 'image',
        url: '../../images/icon2.jpg',
      }
    });
  },

  /**
   * 添加图片
   */
  onAddImage() {
    wx.chooseImage({
      success: (res) => {
        this.setData({
          graph: {
            w: 200,
            h: 200,
            type: 'image',
            url: res.tempFilePaths[0],
          }
        });
      }
    })
  },

  /**
   * 添加文本 通过改变graph的值调用graph的observer,进行component成员drawArray的改变
   */
  onAddText() {
    this.setData({
      graph: {
        type: 'text',
        text: 'helloworld',
      }
    });
  },

  /**
   * 导出图片
   */
  onExport() {
    CanvasDrag.export()
      .then((filePath) => {
        console.log(filePath);
        wx.previewImage({
          urls: [filePath]
        })
      })
      .catch((e) => {
        console.error(e);
      })
  },

  /**
   * 改变文字颜色
   */
  onChangeColor() {
    CanvasDrag.changFontColor('blue');
  },

  /**
   * 改变背景颜色
   */
  onChangeBgColor() {
    CanvasDrag.changeBgColor('yellow');
  },

  /**
   * 改变背景照片
   */
  onChangeBgImage() {
    CanvasDrag.changeBgImage('../../images/icon2.jpg');
  },

  /**
   * 导出当前画布为模板
   */
  onExportJSON() {
    CanvasDrag.exportJson()
      .then((imgArr) => {
        console.log(JSON.stringify(imgArr));
      })
      .catch((e) => {
        console.error(e);
      });
  },

  onImport() {
    // 无背景
    let temp_theme = [{ "type": "image", "url": "../../assets/images/test.jpg", "y": 103, "x": 91, "w": 120, "h": 120, "rotate": 0, "sourceId": null }, { "type": "text", "text": "helloworld", "color": "blue", "fontSize": 20, "y": 243, "x": 97, "rotate": 0 }];

    CanvasDrag.initByArr(temp_theme);
  },

  onSetData() {
    //这里写连接数据库获取json之类的东西
    //然后setdata
    //这个页面获取的是一个Tree

    /*var tree = 访问服务器();
      this.setData({oneTaskTree:tree})
      */
  },
  // 通过data里的数据生成树状图
  onInitByTree() {
    console.log(this.data.oneTaskTree)
    this.onSetData();
    CanvasDrag.clearCanvas();
    CanvasDrag.initByTreeArr(this.data.oneTaskTree.Tree);

  },
  onClearCanvas: function (event) {
    let _this = this;
    _this.setData({
      canvasBg: null,
      isSelected: false,
      text_selected_node: '{}'
    });
    CanvasDrag.clearCanvas();
  },
  switchZoom: function (e) {
    CanvasDrag.enableZoom(e.detail.value);
  },
  switchAdd: function (e) {
    CanvasDrag.enableAdd(e.detail.value);
  },
  switchDel: function (e) {
    CanvasDrag.enableDel(e.detail.value);
  },
  onSelectedChange: function (e) {
    this.setData({
      text_selected_node: e.detail
    });
    if (this.data.text_selected_node == JSON.stringify({})) {
      this.setData({
        isSelected: false
      });
    } else {
      var obj = JSON.parse(this.data.text_selected_node);
      this.setData({
        isSelected: true,
        edit_info: {
          Title: obj[TASK][TITLE],
          Content: obj[TASK][CONTENT],
          DeadLine: obj[TASK][DEADLINE]
        },
        selected_node: obj
      });
    }
  },
  onAddNode: function (e) {
    CanvasDrag.onAddNode();
  },
  onDelNode: function (e) {
    CanvasDrag.onDelNode();
  },
  onDoDel: function (e) {
    CanvasDrag.onDoDel();
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
    // if(this.data.createTask==false){
    //   wx.showModal({
    //     title: '任务还未创建完成',
    //     content: '确定要退出任务创建？',
    //     showCancel: true,//是否显示取消按钮
    //     cancelText: "否",//默认是“取消”
    //     cancelColor: 'red',//取消文字的颜色
    //     confirmText: "是",//默认是“确定”
    //     confirmColor: 'black',//确定文字的颜色
    //     success: function (res) {
    //       if (res.cancel) {
    //         //点击取消,默认隐藏弹框
    //       } else {
    //         wx.navigateBack({
              
    //         })
    //       }
    //     },
    //   })
    // }
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
  handleClick: function(e){
    
    var that = this;
    var openid = '';
    if(e.detail.value.name==null||e.detail.value.name.length==0){
      wx.showToast({
        title: '请输入任务名',
        icon:'none'
      })
    }else{
      wx.getStorage({
        key: 'UserInfor',
        success: function (res) {
          openid = res.data.OpenId
          var json = {
            "OpenId": openid,
            "Name": e.detail.value.name,
            "Brief": e.detail.value.content,
            "Deadline": that.data.date + "T" + that.data.time + ":00Z",
            "Urgency": "3"
          };
          wx.request({
            url: 'https://www.fracturesr.xyz/gugu/newProject',
            header: {
              'content-type': "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: JSON.stringify(json),
            dataType: JSON,
            success: function (res) {
              var index = 'oneTaskTree.Tree'
              var t = res.data
              that.setData({
                tempT:{
                  't':t,
                  'json':json},
                oneTaskTree: {
                  Tree: [
                    {
                      "Task": {
                        "TaskID": res.data,
                        "Title": json.Name,
                        "Pusher": "本机用户", // TODO:改成昵称或者真名
                        "Content": json.Brief,
                        "Status": 0,
                        "PushDate": new Date(),
                        "DeadLine": json.Deadline,
                        "Urgency": json.Urgency,
                      },
                      "Self": 0,
                      "Child": [
                        0
                      ],
                      "TeamMates": [
                        json.OpenId
                      ]
                    },
                  ],
                  "TreeId": "testtasktree",
                  "TreeName": "testproject"
                },
                hide: true
              });
              that.onInitByTree();
              
            },
            fail: function (res) {
              wx.showToast({
                title: '创建失败',
                icon: 'none'
              })
            }
          })
        },
      })
    }    
  },
  handleTouchMove: function(event){
    var that = this;
    that.data.x = event.touches[0].pageX
    that.data.y = event.touches[0].pageY
    console.log(that.data.x)
  },
  handleLongtap: function(){
    
  },
  tapItem: function (e) {
    console.log('index接收到的itemid: ' + e.detail.itemid);
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  createTask: function () {
    var self = this;
    var arr = [];
    var manage = "";
    wx.getStorage({
      key: 'UserInfor',
      success: function (res) {
        arr = res.data.Tasks;
        manage = res.data.Manage;
        var t = self.data.tempT.t;
        var json = self.data.tempT.json;
        manage = manage + t;
        arr.push({
          "TaskID": t,
          "Title": json.Name,
          "Pusher": "本机用户", // TODO:改成昵称或者真名
          "Content": json.Brief,
          "Status": 0,
          "Urgency": json.Urgency,
          "PushDate": new Date(),
          "DeadLine": json.Deadline
        })
        res.data.Tasks = arr;
        res.data.Manage = manage;
        app.globalData.tasks = arr;
        console.log(res.data.Tasks)
        wx.setStorage({
          key: 'UserInfor',
          data: res.data,
        })
      },
    })
  },
  // 显示编辑框
  onEditNode: function (e) {
    this.setData({
      isEdit: true
    });
  },
  // 编辑框确认按钮
  editConfirm: function (e) {
    this.setData({
      isEdit: false
    })
    CanvasDrag.changeNodeInfo(this.data.edit_info);
  },
  // 编辑框取消按钮
  editCancel: function (e) {
    this.setData({
      isEdit: false
    })
  },
  // 编辑框失去焦点
  editChange: function (e) {
    var _edit_info = this.data.edit_info;
    var type = e.target.dataset.type;
    _edit_info[type] = e.detail.value;
    this.setData({
      edit_info: _edit_info,
      selected_node: {
        'Task': _edit_info
      }
    });
  }

})