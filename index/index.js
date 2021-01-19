const app = getApp()

Page({
  data: {
    // code: ''
    items: [
      {
        src: '/imgs/1.jpg',
        title: '标题',
        artist: '简介',
        price: 20,
        number: 0,
        selectedNum: 0
      },
      {
        src: '/imgs/2.jpg',
        title: '标题',
        artist: '简介',
        price: 25,
        number: 0,
        selectedNum: 0
      }
    ]
  },
  // login() {
  //   console.log('login')
  //   let self = this
  //   wx.login({
  //     success(res) {
  //       console.log(res)
  //       self.setData({
  //         code: res.code
  //       })
  //     }
  //   })
  // },
  onLoad() {
    let self = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          // wx.request({
          //   url: 'http://127.0.0.1/8080',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('login error')
        }
        
        // self.setData({
        //   code: res.code
        // })
      }
    })
  },
})
