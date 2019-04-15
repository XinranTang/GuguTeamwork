// pages/page/myMarkDown/myMarkDown.js
var util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    has:true,
    id:-1,
    visible: false,
    actions: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    initData(this);
  },

  /**
   * 编辑事件
   */
  edit:function(e) {
    var id = e.currentTarget.dataset.id;
    // 跳转 navigateTo
    wx.navigateTo({
      url: 'add/add?id=' + id
    })
  },

  /**
   * 添加事件
   */
  add:function() {
    wx.navigateTo({
      url: 'add/add',
    })
  },
  del:function(e){
    this.setData({
      id:e.currentTarget.dataset.id,
      visible:true
    })
  },
  handleClick({ detail }) {
    if (detail.index === 0) {
      this.setData({
        visible: false
      });
    } else {
      const action = [...this.data.actions];
      action[1].loading = true;

      this.setData({
        actions: action
      });
      var i = 0;
      var arr = wx.getStorageSync('txt');
      if (arr.length) {
        for(i=0;i<arr.length;i++){
          if (arr[i].id == this.data.id) {
            arr.splice(i, 1)
          }
        }
      }
      wx.setStorage({
        key: 'txt',
        data: arr,
      })
      setTimeout(() => {
        action[1].loading = false;
        this.setData({
          visible: false,
          actions: action
        });
        wx.showToast({
          title: '删除成功',
          icon:'none'
        })
      }, 500);
      initData(this);
    }
  }

})

/**
 * 处理初始化页面列表数据
 */
function initData(page) {
  var arr = wx.getStorageSync('txt');
  if (arr.length) {
    arr.forEach((item, i) => {
      var t = new Date(Number(item.time));
      item.time = util.dateFormate(t);
    })
    page.setData({
      lists: arr
    })
  } 
}