// pages/list/list.js
import config from '../../utils/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,//1周转房，2门面房
    detail:{
      title_img:'/f3.jpg',
      address:'武昌区中南路梅饭小区110栋2单元602冬冬',
      record_number:'9527',
      key_name:'冬冬',
      org_name:'省公安厅',
      tenant_name:'可傻啦',
      house_id:'9527'
    },
    page:1,
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.number);
    var self = this;
    wx.request({
      url: config.host + '/api/Admin/getHouselst',
      data:{
        number: app.globalData.number
      },
      success:function(res){
        console.log(res);
        self.setData({
          detail:res.data.data.map(function(data){
            if (data.title_img != false){
              data.title_img = config.host + data.title_img;
            }
            return data;
          })
        })
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
    var update_data = app.globalData.detail;
    console.log(update_data)
    var self = this;
    for (var i = 0; i < this.data.detail.length;i++){
      if(this.data.detail[i].house_id == update_data.house_id){
        this.data.detail.splice(i, 1, update_data);
      }
    }
    console.log(this.data.detail);
    this.setData({
      detail: self.data.detail
    })
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
    var self = this;
    wx.request({
      url: config.host + '/api/Admin/getHouselst',
      data: {
        number: app.globalData.number
      },
      success: function (res) {
        console.log(res);
        self.setData({
          detail: res.data.data.map(function (data) {
            if (data.title_img != false) {
              data.title_img = config.host + data.title_img;
            }
            return data;
          })
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    if(this.data.flag == true){
      self.data.page++;
      console.log(self.data.page);
      wx.request({
        url: config.host + '/api/Admin/getHouselst',
        data: {
          number: app.globalData.number,
          page: self.data.page
        },
        success: function (res) {
          self.setData({
            detail: function () {
              res.data.data.map(function (data) {
                if (data.title_img != false) {
                  data.title_img = config.host + data.title_img;
                }
                self.data.detail.push(data);
              })
              return self.data.detail;
            }()
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  searchData:function(e){
    console.log(e.detail.value);
    if (e.detail.value != ''){
      this.data.flag = false;
    }else{
      this.data.flag = true;
      this.data.page = 1;
    }
    var self = this;
    wx.request({
      url: config.host + '/api/Admin/getHouselst',
      data: {
        number: app.globalData.number,
        find: e.detail.value
      },
      success: function (res) {
        console.log(res);
        self.setData({
          detail: res.data.data.map(function (data) {
            if (data.title_img != false) {
              data.title_img = config.host + data.title_img;
            }
            return data;
          })
        })
      }
    })
  },
  statusChange:function(event){
    if (event.currentTarget.dataset.status == "1"){
      this.setData({
        status : 1
      });
    }else{
      this.setData({
        status: 2
      });
    }
  }
})