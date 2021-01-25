const app = getApp()
// shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },
  selectedShop(event) {
    console.log(event)
    app.globalData.shopInfo = event.currentTarget.dataset.item
    console.log(app.globalData.shopInfo)
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    wx.request({
      url: app.globalData.serverUrl + '/api/v1/stores',
      method: 'GET',
      success(res) {
        console.log(res)
        if (res.data.data.length > 0) {
          // self.setData({
          //   items: res.data.data
          // })
          let arr = res.data.data
          console.log(app.globalData.shopInfo)
          let shopId = app.globalData.shopInfo.id
          console.log(shopId)
          for (let i = 0; i < arr.length; i++) {
            if (shopId === arr[i].id) {
              arr[i].checked = true
            }
          }
          console.log(arr)
          self.setData({
            items: arr
          })
        }
      },
      fail(err) {
        console.error(err)
      }
    })
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