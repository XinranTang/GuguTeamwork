// pages/tree.js

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
var PARENT = 'Parent'

import CanvasDrag from '../../components/canvas-drag/canvas-drag';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text_selected_node: '...',
    selected_node:{},
    edit_info:{
        Title:'',
        DeadLine:'',
        Content:''
    },
    //解决Canvas层级太高的问题
    canvasImg:"",
    //是否有选中结点
    isSelected: false,
    //是否在编辑框
    isEdit: false,
    oneTaskTree: {
      "Tree": [{
          "Task": {
            "TaskID": "testopenidtaskid1",
            "Title": "熟悉咕咕",
            "Pusher": "咕咕鸡",
            "Content": "这是一个测试任务",
            "Status": false,
            "PushDate": "2019-04-01T00:00:00Z",
            "DeadLine": "2100-01-01T00:00:00Z",
            "Urgency": 3
          },
          "Self": 0,
          "Child": [
            1,2
          ],
          "TeamMates": [
            "testopenid"
          ]
        },
        {
          "Task": {
            "TaskID": "testopenidtaskid2",
            "Title": "跟随教学引导",
            "Pusher": "咕咕鸡",
            "Content": "这是一个测试子任务",
            "Status": false,
            "PushDate": "2019-04-01T00:00:00Z",
            "DeadLine": "2100-01-01T00:00:00Z",
            "Urgency": 3
          },
          "Self": 1,
          "Child": [
            0
          ],
          "TeamMates": [
            "testopenid", "testopenid2"
          ]
        },
        {
          "Task": {
            "TaskID": "testopenidtaskid3",
            "Title": "尝试使用咕咕",
            "Pusher": "咕咕鸡",
            "Content": "这是一个测试子任务",
            "Status": true,
            "PushDate": "2019-04-01T00:00:00Z",
            "DeadLine": "2100-01-01T00:00:00Z",
            "Urgency": 3
          },
          "Self": 2,
          "Child": [
            0
          ],
          "TeamMates": [
            "testopenid"
          ]
        }
      ],
      "TreeId": "testtasktree",
      "TreeName": "testproject"
    },
    graph: {}
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
    let temp_theme = [{
      "type": "image",
      "url": "../../assets/images/test.jpg",
      "y": 103,
      "x": 91,
      "w": 120,
      "h": 120,
      "rotate": 0,
      "sourceId": null
    }, {
      "type": "text",
      "text": "helloworld",
      "color": "blue",
      "fontSize": 20,
      "y": 243,
      "x": 97,
      "rotate": 0
    }];

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
    this.onSetData();
    this.onClearCanvas();
    CanvasDrag.initByTreeArr(this.data.oneTaskTree["Tree"]);

  },
  onClearCanvas: function(event) {
    let _this = this;
    _this.setData({
      canvasBg: null,
      isSelected: false,
      text_selected_node: '{}'
    });
    CanvasDrag.clearCanvas();
  },
  switchZoom: function(e) {
    CanvasDrag.enableZoom(e.detail.value);
  },
  switchAdd: function(e) {
    CanvasDrag.enableAdd(e.detail.value);
  },
  switchDel: function(e) {
    CanvasDrag.enableDel(e.detail.value);
  },
  onSelectedChange: function(e) {
    this.setData({
      text_selected_node: e.detail
    });
    if (this.data.text_selected_node == JSON.stringify({})) {
      this.setData({
        isSelected: false,
        selected_node:{}
      });
    } else {
      var obj = JSON.parse(this.data.text_selected_node);
      this.setData({
        isSelected: true,
        edit_info:{
          Title:obj[TASK][TITLE],
          Content:obj[TASK][CONTENT],
          DeadLine:obj[TASK][DEADLINE]
        },
        selected_node:obj
      });
      //console.log(this.data.selected_node);
      //console.log(CanvasDrag.getTaskByIndex(this.data.selected_node[PARENT]));
      //console.log(CanvasDrag.getTaskByIndex(this.data.selected_node[PARENT])[TASK][TASKID])
      console.log('ThisTaskID:'+this.data.selected_node[TASK][TASK_ID]);
      
    }

  },
  onAddNode: function(e) {
    CanvasDrag.onAddNode();
  },
  onDelNode: function(e) {
    CanvasDrag.onDelNode();
  },
  onDoDel: function(e) {
    CanvasDrag.onDoDel();
  },
  // 显示编辑框
  onEditNode:function(e){
    this.saveCanvas();
    this.setData({
      isEdit:true
    });
    CanvasDrag.getTaskByIndex(this.data.selected_node[SELF])[TASK][TASK_ID]='tt_fix';
  },
  // 编辑框确认按钮
  editConfirm:function(e){
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
  editChange:function(e){
    var _edit_info = this.data.edit_info;
    var type = e.target.dataset.type;
    _edit_info[type]=e.detail.value;
    this.setData({
      edit_info:_edit_info,
      selected_node:{
        'Task':_edit_info
      }
    });
  },

  saveCanvas:function(e){
    CanvasDrag.export()
      .then((filePath) => {
        console.log(filePath);
        this.setData({
          canvasImg:filePath,
        });
      })
      .catch((e) => {
        console.error(e);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onInitByTree();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // CanvasDrag.initByTreeArr(this.data.oneTaskTree["Tree"]);
    console.log(wx.canIUse('canvasContext.setShadow'));
    console.log(wx.canIUse('canvasContext.shadowColor'));
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})