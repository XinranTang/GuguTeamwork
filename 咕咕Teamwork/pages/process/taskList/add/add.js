// pages/process/taskList/add/add.js
var app = getApp();
var root = {
  title:"根",
  nodes:[
    {
      title:"一"
    },
    {
      title:"二"
    }
  ]
}
var treeData = {
  text: 'My Tree',
  id: 0,
  nodes: [
    {
      text: 'Parent 1',
      id: 1,
      nodes: [
        {
          text: 'Child 1',
          id: 2,
          nodes: [
            {
              text: 'Grandchild 1',
              id: 3,
            },
            {
              text: 'Grandchild 2',
              id: 4,
            },
          ]
        },
        {
          text: 'Child 2',
          id: 5,
        }
      ]
    },
    {
      text: 'Parent 2',
      id: 6,
      nodes: [
        {
          text: 'Child 1',
          id: 7,
        },
        {
          text: 'Child 2',
          id: 8,
        }
      ]
    }
  ]
}
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
    treeData: treeData,
    root:root
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
  handleClick: function(){
    var that = this;
    console.log("新建任务");
    this.setData({
      hide:true
    });
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

})