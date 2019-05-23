// pages/process/taskList/task.js
var app = getApp()
import CanvasDrag from '../../../components/canvas-drag/canvas-drag';

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

Page({

  /**
   * Page initial data
   */
  data: {
    "title":'测试',
    "pusher":'',
    user: "",
    treeDeadLine:"",
    "content":'',
    "status":false,
    "pushDate":"",
    "deadLine":"",
    "urgency":0,
    "task":null,
    oneTaskTree:{},
    show:false,
    text_selected_node: '...',
    isSelected: false,
    //选中的结点
    selected_node: {},
    //编辑框内的内容
    edit_info: {
      Title: '',
      DeadLine: '',
      Content: ''
    },
    //解决Canvas层级太高的问题
    canvasImg: "",
    isEdit: false,
    graph: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let self = this
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
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("current task: "+app.globalData.currentTask)
    var self = this;

    var currentTask = app.globalData.currentTask;
    wx.getStorage({
      key: 'Forest',
      success: function(res) {
        console.log("task.js"+res.datac)
        let findTree = false;
        let eachData = res.data;
        eachData.forEach(each => {
          if(currentTask.TreeId == each.TreeId){
            findTree = true;
            self.setData({
              show: true,
              oneTaskTree: each
            })
            console.log("在forest里找到了")
            self.onInitByTree();
            self.setData({
              treeDeadLine:each.Tree[0].Task.DeadLine
            })
          }
        })
        if(!findTree){
          wx.getStorage({
            key: 'UserInfor',
            success: function (res) {
              var arr = [];
              arr = res.data.Manage.split(";");
              var flag = false;// 不是管理者
              arr.forEach(item => {
                if (item == currentTask.TaskID) {
                  flag = true;
                  // wx.getStorage({
                  //   key: 'Forest',
                  //   success: function (res) {
                  //     res.data.forEach(each => {
                  //       if (each.TreeId == item) {
                  //         self.setData({
                  //           show: true,
                  //           oneTaskTree: each
                  //         })
                  //         self.onInitByTree();
                  //       }
                  //     })
                  //   },
                  // })
                }
              })
              if (!flag) {
                self.setData({
                  task: currentTask,
                  title: currentTask.Title,
                  pusher: currentTask.Pusher,
                  content: currentTask.Content,
                  status: currentTask.Status,
                  pushDate: currentTask.PushDate,
                  deadLine: currentTask.DeadLine,
                  urgency: currentTask.Urgency
                })
              }
            },
          })
        }
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
  handleTouchMove: function (event) {
    var that = this;
    that.data.x = event.touches[0].pageX
    that.data.y = event.touches[0].pageY
    console.log(that.data.x)
  },
  handleLongtap: function () {

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
    console.log(_this.data.oneTaskTree)
    var json = {
      "TreeID": _this.data.oneTaskTree.TreeId,
      "TaskID": _this.data.oneTaskTree.TreeId,
      "Parent": ""
    };
    console.log(json)
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
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/getManageTrees',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success(res1) {
            console.log(res1.data)
            wx.setStorage({
              key: 'Forest',
              data: res1.data,
            })
            wx.request({
              url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
              header: {
                'content-type': "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                OpenId: "testopenid"
              },
              success(res) {
                wx.setStorage({
                  key: 'UserInfor',
                  data: res.data,
                })
                app.globalData.tasks = res.data.Tasks;
                app.globalData.messages = res.data.Messages;
                wx.navigateBack({

                })
              }
            })
          }
        })
      }
    })
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
        isSelected: false,
        selected_node: {}
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
      // 这里都是默认值，全部都得改
      "OpenId": self.data.user,
      "Title": "no title",
      "Content": "no content",
      "Deadline": self.data.treeDeadLine,
      "Urgency": "0",
      "TreeID": self.data.oneTaskTree.TreeId,
      "Parent": self.data.selected_node[PARENT]
    };
    CanvasDrag.getTaskByIndex(self.data.selected_node[SELF])[TASK][DEADLINE] = self.data.date + "T" + self.data.time + ":00Z";
    console.log(json)
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
        CanvasDrag.getTaskByIndex(self.data.selected_node[SELF])[TASK][TASK_ID] = res.data;
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/getManageTrees',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success(res1) {
            console.log(res1.data)
            wx.setStorage({
              key: 'Forest',
              data: res1.data,
            })
            wx.request({
              url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
              header: {
                'content-type': "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                OpenId: "testopenid"
              },
              success(res) {
                wx.setStorage({
                  key: 'Information',
                  data: res.data,
                })
                app.globalData.tasks = res.data.Tasks;
                app.globalData.messages = res.data.Messages;
              }
            })
          }
        })
      }
    })
  },
  onDelNode: function (e) {
    CanvasDrag.onDelNode();
  },
  onDoDel: function (e) {
    var self = this;
    CanvasDrag.onDoDel();
    var text_selected_node = JSON.parse(self.data.text_selected_node)
    console.log(text_selected_node)
    var json = {
      "TreeID": self.data.oneTaskTree.TreeId,
      "TaskID": text_selected_node.Task.TaskID,
      "Parent": text_selected_node.Task.Parent
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
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/getManageTrees',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success(res1) {
            console.log(res1.data)
            wx.setStorage({
              key: 'Forest',
              data: res1.data,
            })
            wx.request({
              url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
              header: {
                'content-type': "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                OpenId: "testopenid"
              },
              success(res) {
                wx.setStorage({
                  key: 'Information',
                  data: res.data,
                })
                app.globalData.tasks = res.data.Tasks;
                app.globalData.messages = res.data.Messages;
              }
            })
          }
        })
      }
    })
  },
  // 显示编辑框
  onEditNode: function (e) {
    // this.saveCanvas();
    var self = this;
    this.setData({
      isEdit: true
    })
    // CanvasDrag.changeNodeInfo(this.data.edit_info);
    // var text_selected_node = JSON.parse(self.data.text_selected_node)
    // console.log(text_selected_node)
    // var json = {
    //   "TreeID": self.data.oneTaskTree.TreeId,
    //   "TaskID": text_selected_node.Task.TaskID,
    //   "Title": text_selected_node.Task.Title,
    //   "Content": text_selected_node.Task.Content,
    //   "Deadline": text_selected_node.Task.DeadLine,
    //   "Urgency": text_selected_node.Task.Urgency + ""
    // }
    // console.log(json)
    // wx.request({
    //   url: 'https://www.fracturesr.xyz/gugu/alterNode',
    //   header: {
    //     'content-type': "application/x-www-form-urlencoded"
    //   },
    //   method: 'POST',
    //   data: JSON.stringify(json),
    //   dataType: JSON,
    //   success: function (res) {
    //     console.log("把结点编辑信息传给服务器成功")
    //     wx.request({
    //       url: 'https://www.fracturesr.xyz/gugu/getManageTrees',
    //       header: {
    //         'content-type': "application/x-www-form-urlencoded"
    //       },
    //       method: 'POST',
    //       data: {
    //         OpenId: "testopenid"
    //       },
    //       success(res1) {
    //         console.log(res1.data)
    //         wx.setStorage({
    //           key: 'Forest',
    //           data: res1.data,
    //         })
    //         wx.request({
    //           url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
    //           header: {
    //             'content-type': "application/x-www-form-urlencoded"
    //           },
    //           method: 'POST',
    //           data: {
    //             OpenId: "testopenid"
    //           },
    //           success(res) {
    //             wx.setStorage({
    //               key: 'Information',
    //               data: res.data,
    //             })
    //             app.globalData.tasks = res.data.Tasks;
    //             app.globalData.messages = res.data.Messages;
    //           }
    //         })
    //       }
    //     })
    //   }
    // })

  },
  // 编辑框确认按钮
  editConfirm: function (e) {
    var self = this;
    self.setData({
      isEdit: false
    })
    console.log(self.data.edit_info)
    CanvasDrag.changeNodeInfo(self.data.edit_info);
    var selected_node = self.data.selected_node
    console.log(selected_node)
    var json = {
      "TreeID": self.data.oneTaskTree.TreeId,
      "TaskID": self.data.text_selected_node.Task.TaskID,
      "Title": selected_node.Task.Title,
      "Content": selected_node.Task.Content,
      "Deadline": selected_node.Task.DeadLine,
      "Urgency": self.data.text_selected_node.Task.Urgency + ""
    }
    console.log(json)
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
        wx.request({
          url: 'https://www.fracturesr.xyz/gugu/getManageTrees',
          header: {
            'content-type': "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            OpenId: "testopenid"
          },
          success(res1) {
            console.log(res1.data)
            wx.setStorage({
              key: 'Forest',
              data: res1.data,
            })
            wx.request({
              url: 'https://www.fracturesr.xyz/gugu/openIdEntry',
              header: {
                'content-type': "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                OpenId: "testopenid"
              },
              success(res) {
                wx.setStorage({
                  key: 'Information',
                  data: res.data,
                })
                app.globalData.tasks = res.data.Tasks;
                app.globalData.messages = res.data.Messages;
              }
            })
          }
        })
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

  saveCanvas: function (e) {
    CanvasDrag.export()
      .then((filePath) => {
        console.log(filePath);
        this.setData({
          canvasImg: filePath,
        });
      })
      .catch((e) => {
        console.error(e);
      })
  }
})