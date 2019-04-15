// pages/process/taskList/add/add.js
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
    isSelected: false,
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
              var arr = [];
              var manage = "";
              wx.getStorage({
                key: 'UserInfor',
                success: function (res) {
                  arr = res.data.Tasks;
                  manage=res.data.Manage;
                  manage=manage+t;
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
    
  }

})