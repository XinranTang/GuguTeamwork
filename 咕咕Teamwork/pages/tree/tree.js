// pages/tree.js

import CanvasDrag from '../../components/canvas-drag/canvas-drag';
Page({

  /**
   * 页面的初始数据
   */
  data: {
        tasks:[
          {
            "title":"主题任务",
            "childs":
            [
              {
                "title": "子任务1",
                "childs": 
                [
                  {
                    "title": "子任务1的子任务1",
                    "childs": []
                  },
                  {
                    "title": "子任务1的子任务2",
                    "childs": []
                  }
                ]
              },
              {
                "title": "子任务2",
                "childs":
                  [
                    {
                      "title": "子任务2的子任务1",
                      "childs": []
                    },
                  ]}
            ]
          }, 
        ],
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
    // 有背景
    // let temp_theme = [{"type":"bgColor","color":"yellow"},{"type":"image","url":"../../assets/images/test.jpg","y":98.78423143832424,"x":143.78423143832424,"w":104.43153712335152,"h":104.43153712335152,"rotate":-12.58027482265038,"sourceId":null},{"type":"text","text":"helloworld","color":"blue","fontSize":24.875030530031438,"y":242.56248473498428,"x":119.57012176513672,"w":116.73966979980469,"h":34.87503053003144,"rotate":8.873370699754087}];
    // 无背景
    let temp_theme = [{ "type": "image", "url": "../../assets/images/test.jpg", "y": 103, "x": 91, "w": 120, "h": 120, "rotate": 0, "sourceId": null }, { "type": "text", "text": "helloworld", "color": "blue", "fontSize": 20, "y": 243, "x": 97, "rotate": 0 }];

    CanvasDrag.initByArr(temp_theme);
  },

  // 通过data里的数据生成树状图
  onInitByTree(){
      CanvasDrag.initByTree(this.data.tasks);
  },
  onClearCanvas: function (event) {
    let _this = this;
    _this.setData({ canvasBg: null });
    CanvasDrag.clearCanvas();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})