// pages/process/taskList/add/add.js
var my_canvas, strat_x, strat_y, end_x, end_y;
Page({

  /**
   * Page initial data
   */
  data: {
    name: '',
    deadline: '',
    infor: '',
    hide: false
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
    //创建canvas实例对象，方便后续使用。
    my_canvas = wx.createCanvasContext('myCanvas', this) 
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
  handleClick:function(){
    console.log("新建任务")
    this.setData({
      hide:true
    })
  },
  EventHandleStart: function (e) {
    console.log(e)    
    strat_x = e.touches[0].x; // 手指开始触摸时的x轴 x轴--->相对于画布左边的距离    
    strat_y = e.touches[0].y;// 手指开始触摸时的y轴 y轴--->相对于画布顶部的距离  
    },  //手指触摸结束时的事件  
  EventHandle: function (e) {
    console.log(e)
    end_x = e.changedTouches[0].x; // 手指结束触摸时的x轴 x轴--->相对于画布左边的距离
    end_y = e.changedTouches[0].y;// 手指结束触摸时的y轴 y轴--->相对于画布顶部的距离   
    my_canvas.beginPath(); //创建一条路径      
    my_canvas.setStrokeStyle('black');  //设置边框色    
    my_canvas.moveTo(strat_x, strat_y) //描述路径的起点为手指触摸的x轴和y轴    
    my_canvas.lineTo(end_x, end_y) //绘制一条直线，终点坐标为手指触摸结束后的x轴和y轴    
    my_canvas.stroke() //画出当前路径的边框    
    my_canvas.draw() //将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。  
  }
})