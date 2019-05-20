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
var PARENT = 'Parent'

var app = getApp();
import CanvasDrag from '../../../../components/canvas-drag/canvas-drag';
var util = require('../../../../utils/util.js')
Page({
  /**
   * Page initial data
   */
  data: {
    name: '',
    user: "",
    deadline: '',
    infor: '',
    hide: false,
    x:0,
    y:0,
    h:220,
    w:220,
    date: '2019-01-01',
    time: '12:00',
    text_selected_node: '...',
    createTask:false,
    clicked:false,
    tempT:{},
    edit_info: {
      Title: '',
      DeadLine: '',
      Content: ''
    },
    isSelected: false,
    //解决Canvas层级太高的问题
    canvasImg: "",
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
  onLoad: function (e) {
    var self = this;
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        self.setData({
          user:res.data.OpenId
        })
      },
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
  // 通过data里的数据生成树状图
  onInitByTree() {
    console.log(this.data.oneTaskTree)
    // this.onSetData();
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
    var self = this;
    CanvasDrag.onAddNode();
    var text_selected_node = JSON.parse(self.data.text_selected_node)
    console.log(text_selected_node)
    var json = {
      "OpenId": self.data.user,
      "Title": text_selected_node.Task.Title,
      "Content": text_selected_node.Task.Content,
      "Deadline": text_selected_node.Task.DeadLine,
      "Urgency": text_selected_node.Task.Urgenncy,
      "TreeID": self.data.oneTaskTree.TreeId,
      "Parent": text_selected_node.Parent.toString(),
    };
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/newNode',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: JSON.stringify(json),
      dataType: JSON,
      success: function (res) {
        console.log("任务结点添加成功")
      }
    })
  },
  onDelNode: function (e) {
    CanvasDrag.onDelNode();
  },
  onDoDel: function (e) {
    CanvasDrag.onDoDel();
    var text_selected_node = JSON.parse(self.data.text_selected_node)
    console.log(text_selected_node)
    var json = {
      "TreeID": self.data.oneTaskTree.TreeId,
      "TaskID": text_selected_node.TaskID,
      "Parent": text_selected_node.Parent
    };
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/deleteNode',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: JSON.stringify(json),
      dataType: JSON,
      success: function (res) {
        console.log("任务结点删除成功")
      }
    })
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
    var self = this;
    if (this.data.createTask == false) {
          if(this.data.clicked==true){
              var json = {
                "TreeID": self.data.oneTaskTree.TreeId,
                "TaskID": self.data.oneTaskTree.TreeName,
                "Parent": ""
              };
              wx.request({
                url: 'https://www.fracturesr.xyz/gugu/deleteNode',
                header: {
                  'content-type': "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: JSON.stringify(json),
                dataType: JSON,
                success: function (res) {
                  console.log("任务取消创建成功")
                }
              })
            }
          }
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
  /**
   * 任务创建逻辑：
   * 用户首先填写任务名等
   * 然后发邀请给好友【这里怎么邀请呢？】 暂时方案是发送数据给服务器，生成带有信息的小程序码，用户扫描后就能进入任务
   * 在任务创建过程中是不会给管理者显示邀请的用户的【有点问题】
   * 点击新建按钮后，连接服务器，服务器新建一棵树后返回Task ID【这里如果不想建立任务退出了的话怎么办呢？】【连接服务器请求删除（问一下删除的接口）】
   * 新建完了用户可以开始构建任务树，点击任务创建完成，进入createTask
   * 
   * 用户在添加每一个结点后点击结点都跳出一个框，填写具体的一些信息【但是这里有限制，比如截止时间不能比整个项目的截止时间迟】
   * 
   */
  // 用户点击新建按钮
  handleClick: function(e){
    var that = this;
    var openid = '';
    var start_date = new Date(that.data.date.replace(/-/g, "/"))
    var current_date = new Date()
    that.setData({
      clicked:true
    })
    // 输入检查
    if(e.detail.value.name==null||e.detail.value.name.length==0){
      wx.showToast({
        title: '请输入任务名',
        icon:'none'
      })
    } else if (e.detail.value.content == null || e.detail.value.content.length == 0) {
      wx.showToast({
        title: '请输入任务信息',
        icon: 'none'
      })
    }else if(current_date.getTime()>=start_date.getTime()){
      wx.showToast({
        title: '截止时间无效',
        icon:'none'
      })
    }else{
      // 本地储存调UserInfor
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
          // 连接服务器    【这里的请求服务器，是直接给我添加了一棵树吗？？这里有一点】
          wx.request({
            url: 'https://www.fracturesr.xyz/gugu/newProject',
            header: {
              'content-type': "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: JSON.stringify(json),
            dataType: JSON,
            success: function (res) {
              // 服务器请求成功，设置页面数据
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
                  // 树的名字和ID等于根节点任务的名字和ID
                  "TreeId": res.data,
                  "TreeName": json.Name
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
/**
 * createTask逻辑
 * 这里表示用户确定任务创建完成了，点击按钮以后应该让用户回到上一层界面
 * 获取本地UserInfor储存，把新任务（根节点）添加到用户的Tasks和Manage字符串里面【只用添加根结点就可以了吗？】【马上去任务显示的界面看一下管理任务的那棵树是怎么从本地找的】
 * 【这里不能传一整课树】
 * 【每一步都要跟服务器连接改，这里在本地添加一棵整的就可以】
 * 
 */
  // 用户点击了树形图里的任务创建完成按钮，正式创建任务
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
        wx.navigateBack({
          
        })
      },
    })
  },
  // 显示编辑框
  /**
   * 这里能不能不用modal，因为要添加小组成员
   */
  // 【modal和view差不太多吧？modal里添个按钮，或者独立出一个跟编辑同层次的按钮看上去也行】
  onEditNode: function (e) {
    this.setData({
      isEdit: true
    });
  },
  // 编辑框确认按钮
  editConfirm: function (e) {
    var self = this;
    this.setData({
      isEdit: false
    })
    var text_selected_node = JSON.parse(self.data.text_selected_node)
    var json={
      "TreeID": self.data.oneTaskTree.TreeId,
      "TaskID": text_selected_node.Task.TaskID,
      "Title": text_selected_node.Task.Title,
      "Content": text_selected_node.Task.Content,
      "Deadline": text_selected_node.Task.DeadLine,
      "Urgency": text_selected_node.Task.Urgency
    }
    CanvasDrag.changeNodeInfo(this.data.edit_info);
    wx.request({
      url: 'https://www.fracturesr.xyz/gugu/alterNode',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: JSON.stringify(json),
      dataType: JSON,
      success: function (res) {
        console.log("把结点编辑信息传给服务器成功")
      }
    })
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
  },
onShareAppMessage: function (res) {
    const that = this;
    var boss = "";
    console.log('this.data', this.data.cpId)
    wx.getStorage({
      key: 'UserInfor',
      success: function(res) {
        boss = res.data.OpenId
      },
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请您加入我的项目',
      path: '/pages/home/home?boss='+boss,
      // path:'/pages/process/taskList/add/add',
      imageUrl:'/images/image_gugu_secretary.jpg',
    }

  }
})