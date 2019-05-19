// pages/page/myAssociate/myAssociate.js
  const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
    
    },

    /**
     * 
     * 生命周期函数--监听页面加载
     */
    onLoad(opt) {

    },
  upload: function () {
    var self = this
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        self.setData({
          tempFile: tempFilePaths[0],
          hasFile: true
        })
      }
    })
  }
})


