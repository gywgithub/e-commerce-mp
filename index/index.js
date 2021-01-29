const app = getApp()

Page({
  data: {
    shopInfo: {},
    userInfo: {
      avatarUrl: '/imgs/account_707070_81.png',
      nickName: '未登录用户'
    },
    items: [],
    total: 0,
    viewHeight: '100vh'
  },
  redirectToStorePage: function (event) {
    wx.navigateTo({
      url: '/shop/shop',
    })
  },
  setUserInfo: function (userInfo) {
    this.setData({
      userInfo: userInfo
    })
    app.globalData.userInfo = userInfo
  },
  getUserInfo: function (event) {
    console.log(event)
    let iv = ''
    let encryptedData = ''
    let self = this
    const userInfo = event.detail.userInfo

    this.setData({
      userInfo: userInfo
    })
    wx.login({
      success(res) {
        if (res.code) {
          console.log('code: ', res.code)
          const code = res.code
          wx.getUserInfo({
            success(res) {
              console.log(res)
              if (res.iv && res.encryptedData) {
                iv = res.iv
                encryptedData = res.encryptedData
                console.log('iv: ', iv)
                console.log('encrypteData: ', encryptedData)
                wx.request({
                  url: app.globalData.serverUrl + '/api/v1/wx/users/oauth_user',
                  data: {
                    code: code,
                    encrypted_data: encryptedData,
                    iv: iv
                  },
                  method: 'POST',
                  success(res) {
                    console.log(res)
                    if (res.data.data && res.data.data.user_id) {
                      console.log('userid: ' + res.data.data.user_id)
                      const id = res.data.data.user_id
                      let userInfo = self.data.userInfo
                      userInfo['userId'] = id
                      self.setUserInfo(userInfo)
                      console.log(self.data.userInfo)
                      wx.setStorage({
                        key: 'userInfo',
                        data: userInfo
                      })
                    } else {
                      console.error('login error oauth_user')
                    }
                  },
                  fail(err) {
                    console.error(err)
                  }
                })
              }
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
    if (total === 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    if (!this.data.userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    const detail = this.data.items.filter(item => item.selectedNum > 0)
    const data = {
      store_id: this.data.shopInfo.id,
      user_id: this.data.userInfo.userId,
      money: total,
      real_total_money: total,
      detail: detail,
      coupon: {}
    }
    console.log(data)
    wx.request({
      url: app.globalData.serverUrl + '/api/v1/wx/orders',
      data: data,
      method: 'POST',
      success(res) {
        console.log(res)
        if (res.data.data) {
          let obj = res.data.data
          wx.requestPayment({
            "timeStamp": obj.timeStamp,
            "nonceStr": obj.nonceStr,
            "package": obj.package,
            "signType": "RSA",
            "paySign": obj.paySign,
            "success": function (res) {
              console.log(res)
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '/info/info'
                })
              }, 1500)
            },
            "fail": function (err) {
              console.error(err)
            },
            "complete": function (res) {
              console.log('complete')
            }
          })
        }
      },
      fail(err) {
        console.error(err)
      }
    })
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
  getShopProduct(shopInfo) {
    let self = this

    wx.request({
      method: 'GET',
      url: app.globalData.serverUrl + '/api/v1/admin/product?sid=' + shopInfo.id,
      success(res) {
        if (res.data.data.data_list.length > 0) {
          let dataList = res.data.data.data_list
          for (var item of dataList) {
            item['selectedNum'] = 0
          }
          self.setData({
            viewHeight: 'calc(100vh - 120rpx)',
            items: dataList,
            total: 0
          })
        } else {
          self.setData({
            viewHeight: '100vh',
            items: []
          })
        }
      },
      fail(err) {
        console.error(err)
      }
    })
  },
  onShow() {
    console.log('onShow')
    if (app.globalData.shopInfo && app.globalData.shopInfo.id && app.globalData.shopInfo.id !== this.data.shopInfo.id) {
      this.setData({
        shopInfo: app.globalData.shopInfo
      })
      this.getShopProduct(app.globalData.shopInfo)
    } else {
      console.log('not fresh data')
    }
  },
  onLoad() {
    console.log('onload')
    const self = this
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res.data)
        self.setUserInfo(res.data)
      }
    })

    // get shopInfo, productInfo
    wx.getStorage({
      key: 'shopInfo',
      success(res) {
        console.log(res.data)
      },
      complete(res) {
        if (res.data && res.data.id) {
          self.setData({
            shopInfo: res.data
          })
          app.globalData.shopInfo = res.data
          self.getShopProduct(res.data)
        }
      }
    })
  },
})