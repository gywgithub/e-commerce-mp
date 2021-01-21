const app = getApp()

Page({
  data: {
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
  pay: function (event) {
    const total = this.data.total
    console.log(total)
    wx.showToast({
      title: '支付成功！',
      icon: 'success',
      duration: 20000
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/info/info',
      })
    }, 2000)
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
    let self = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          console.log(res.code)
          // wx.request({
          //   url: 'http://127.0.0.1:3000',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('login error')
        }
      }
    })
  },
})
