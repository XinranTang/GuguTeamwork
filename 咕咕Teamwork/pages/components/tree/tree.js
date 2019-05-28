// pages/components/tree/tree.js
import CanvasDrag from '../../../components/canvas-drag/canvas-drag';

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    text_selected_node: '...',
    isSelected: false,
    tasks: [
      {
        "title": "主题任务",
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
                ]
            }
          ]
      },
    ],
    oneTaskTree: {
      "Tree": [
        {
          "Task": {
            "TaskID": "testopenidtaskid1",
            "Title": "熟悉咕咕",
            "Pusher": "咕咕鸡",
            "Content": "这是一个测试任务",
            "Status": false,
            "PushDate": "2019-04-01 00:00:00",
            "DeadLine": "2100-01-01 00:00:00",
            "Urgency": 3
          },
          "Self": 0,
          "Child": [
            1,
            2
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
            "PushDate": "2019-04-01 00:00:00 ",
            "DeadLine": "2100-01-01 00:00:00 ",
            "Urgency": 3
          },
          "Self": 1,
          "Child": [
            0
          ],
          "TeamMates": [
            "testopenid"
          ]
        },
        {
          "Task": {
            "TaskID": "testopenidtaskid3",
            "Title": "尝试使用咕咕",
            "Pusher": "咕咕鸡",
            "Content": "这是一个测试子任务",
            "Status": false,
            "PushDate": "2019-04-01 00:00:00",
            "DeadLine": "2100-01-01 00:00:00",
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
   * Component methods
   */
  methods: {
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
      this.onSetData();
      CanvasDrag.clearCanvas();
      CanvasDrag.initByTreeArr(this.data.oneTaskTree["Tree"]);

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
  }
})
