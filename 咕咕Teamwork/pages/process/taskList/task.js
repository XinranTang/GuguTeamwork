// pages/process/taskList/task.js
var app = getApp()
import CanvasDrag from '../../../components/canvas-drag/canvas-drag';
Page({

  /**
   * Page initial data
   */
  data: {
    "title":'测试',
    "pusher":'',
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
    graph: {}
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
    console.log(app.globalData.currentTask)
    var self = this;

    var currentTask = app.globalData.currentTask;
    wx.getStorage({
      key: 'UserInfor',
      success: function (res) {
        var arr = [];
        arr = res.data.Manage.split(";");
        var flag = false;// 不是管理者
        arr.forEach(item => {
          if (item == currentTask.TaskID) {
            flag = true;
            wx.getStorage({
              key: 'Forest',
              success: function (res) {
                res.data.forEach(each => {
                  if (each.TreeId == item) {
                    self.setData({
                      show: true,
                      oneTaskTree: each
                    })
                    self.onInitByTree();
                  }
                })
              },
            })
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
    }
    else {
      this.setData({
        isSelected: true
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
  }
})