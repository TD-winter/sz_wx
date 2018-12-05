// pages/reset_password/reset_password.js
import config from '../../utils/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  formSubmit:function(e){
    console.log(e.detail.value);
    wx.request({
      url: config.host + '/api/Admin/editPassword',
      data: {
        number : app.globalData.number,
        old_password: e.detail.value.old_password,
        new_password: e.detail.value.new_password
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        app.globalData.number = res.data.data.number;
        if (res.data.retcode == '2000') {
          wx.reLaunch({
            url: '../list/list'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  }
})