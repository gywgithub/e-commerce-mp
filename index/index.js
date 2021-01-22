const app = getApp()

Page({
  data: {
    userInfo: {
      avatarUrl: '/imgs/account_707070_81.png',
      nickName: '未登录用户'
    },
    items: [
      {
        src: '/imgs/1.jpg',
        title: '动漫头像',
        artist: '动漫女生头像，简笔画头像风格，唯美简约风格，可爱甜美风格',
        price: 20,
        number: 0,
        selectedNum: 0
      },
      {
        src: '/imgs/2.jpg',
        title: '动漫女生头像',
        artist: '动漫女生头像，简笔画头像风格，唯美简约风格，可爱甜美风格，二次元',
        price: 30,
        number: 0,
        selectedNum: 0
      }
    ],
    total: 0
  },
  redirectToStorePage: function (event) {
    wx.navigateTo({
      url: '/shop/shop',
    })
  },
  getUserInfo: function (event) {
    console.log(event)
    const iv = event.detail.iv
    const encryptedData = event.detail.encryptedData
    // const avatar = event.detail.
    // let self = this
    const userInfo = event.detail.userInfo
    this.setData({
      userInfo: userInfo
    })
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.serverUrl + '/api/v1/wx/users/oauth_user',
            data: {
              code: res.code,
              encrypted_data: encryptedData,
              iv: iv
            },
            method: 'POST',
            success (res) {
              if (res.data.data.user_id) {
                console.log('userid: ' + res.data.data.user_id)
              }
            },
            fail (err) {
              console.error(err)
            }
          })
        } else {
          console.log('login error')
        }
      }
    })
  },
  pay: function (event) {
    const total = this.data.total
    console.log(total)
    wx.showToast({
      title: '支付成功！',
      icon: 'success',
      duration: 2000
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/info/info',
      })
    }, 2010)
  },
  minusNum: function (event) {
    const index = event.currentTarget.dataset.index
    let items = this.data.items
    items[index].selectedNum--
    this.setData({
      items: items
    })
    this.getTotal()
  },
  plusNum: function (event) {
    const index = event.currentTarget.dataset.index
    let items = this.data.items
    items[index].selectedNum++
    this.setData({
      items: items
    })
    this.getTotal()
  },
  getTotal: function () {
    let totalNum = 0
    for (const item of this.data.items) {
      totalNum += item.selectedNum * item.price
    }
    this.setData({
      total: totalNum
    })
  },

  onLoad() {
    // wx.request({
    //   method: 'GET',
    //   url: app.globalData.serverUrl + '',
    //   data: {},
    //   success (res) {

    //   },
    //   fail (err) {

    //   }
    // })
  },
})
