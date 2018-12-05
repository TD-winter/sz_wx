// pages/login/login.js
import config from '../../utils/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password:'',
    token: '12'
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
  
  },
  formSubmit:function(e){
    console.log(e.detail.value);
    wx.request({
      url: config.host + '/admin.php/wx/login/login',
      data: e.detail.value,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        app.globalData.token = res.data.data.token;
        if (res.data.code == 1){
          wx.reLaunch({
            url: '../vacate/vacate'
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },
  forgetPassword:function(){
    // wx.navigateTo({
    //   url: '/pages/reset_password/reset_password'
    // })
    wx.makePhoneCall({
      phoneNumber: '18372610361' //仅为示例，并非真实的电话号码
    })
  }
})