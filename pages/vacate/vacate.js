// pages/list/list.js
import config from '../../utils/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,//1周转房，2门面房
    search_data:'',
    detail_1:[{
      address:'',
      tp_id : '',
      edate : '',
      tt_name : '',
      sum_unpaid : 0,
      org_name : ''
    }],
    detail_2: [{
      "b_id": '',
      "address": "",
      "area": "",
      "bp_id": '',
      "edate": "",
      "bt_name": "",
      "sum_unpaid": ''
    }],
    page:1,
    flag:true
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
    this.getList();
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
    this.getList(e.detail.value);
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
    this.setData({
      search_data: ''
    });
    this.getList();
  },
  getList:function(value){
    var _self = this;
    if(_self.data.status == 1){
      var url_string = '/admin.php/wx/index/getTturnList';
    }else if(_self.data.status == 2){
      var url_string = '/admin.php/wx/index/getBturnList';
    }
    console.log(app.globalData.token);
    wx.request({
      url: config.host + url_string,
      method:'POST',
      data: {
        token: app.globalData.token
        // token: '28b554ac7b79dbe6e200dbbe70805c9f'
        , keywords: value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        if (_self.data.status == 1) {
          _self.setData({
            detail_1: res.data.data
          });
        } else if (_self.data.status == 2) {
          _self.setData({
            detail_2: res.data.data
          });
        }
      }
    })
  },
  goVacate:function(e){
    var _self = this;
    var money = e.currentTarget.dataset.money;
    var id = e.currentTarget.dataset.id;
    if(money > 0 ){
      wx.showModal({
        title: '提示',
        content: '当前还有' + money + '元租金未缴纳，是否 确认腾退？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/vacate_detail/detail?id=' + id + '&status=' + _self.data.status
            })
          } else if (res.cancel) {

          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/vacate_detail/detail?id=' + id + '&status=' + _self.data.status
      })
    }
  }
})