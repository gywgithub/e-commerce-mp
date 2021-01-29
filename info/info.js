const app = getApp()
// info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    message: '暂无订单数据'
  },
  getOrders: function() {
    console.log(app.globalData.serverUrl)
    console.log(app.globalData.userInfo)
    let self = this
    if (app.globalData.userInfo.userId) {
      wx.request({
        method: 'GET',
        url: app.globalData.serverUrl + '/api/v1/wx/orders/bills',
        data: {
          user_id: app.globalData.userInfo.userId,
          page: 1,
          page_size: 99
        },
        success (res) {
          console.log(res)
          if (res.data.data.length > 0) {
            self.setData({
              items: res.data.data
            })
          } else {
            self.setData({
              message: '暂无订单数据'
            })
          }
        },
        fail (err) {
          console.error(err)
        },
        complete (res) {
          wx.stopPullDownRefresh()
        }
      })
    } else {
      self.setData({
        message: '请先登录，再查询订单数据'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders()
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
    this.getOrders()
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