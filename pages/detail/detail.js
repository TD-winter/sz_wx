// pages/detail/detail.js
import config from '../../utils/config.js';
var app = getApp();
Page({
  data: {
    top_detail:'',
    one_state: true,
    two_state: true,
    three_state: true,
    four_state:true,
    house_id:null,
    detail_one:{
      address:'',
      pre_rent:'',
      act_rent:'',
      gps_x:'',
      gps_y:'',
      cover_area:'',
      inside_area:'',
      record_number:'',
      key_name:''
    },
    detail_two:{
      handed:'',
      pledge_rent:'',
      water_rent:'',
      elect_rent:'',
      gas_rent:'',
      warm_rent:'',
      tenant_start_time:'',
      tenant_end_time:'',
      remark: ""
    },
    detail_thr: {
      tenant_name: '',
      post_name: '',
      post_sort:'',
      org_name: '',
      tel: '',
      home_tel:'',
      id_card: '',
      sort: '',
      insz_time: '',
      inoffice_time: ''
    },
    detail_four:[],
    remove_img_array:[],
    add_img_array:[],
    index:0,
    array: ['待查', '待售', '空置', '无合同待查', '移交合同', '移交钥匙','已出售'],
    tenant_start_time:'1991-11-17',
    tenant_end_time:'',
    insz_time:'',
    inoffice_time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var self = this;
    this.setData({
      house_id: options.house_id
    })
    wx.request({
      url: config.host + '/api/Admin/detail',
      data: {
        number: app.globalData.number,
        house_id: options.house_id
      },
      success: function (res) {
        console.log(res.data.data);
        self.setData({
          detail_one:res.data.data.one,
          detail_two: res.data.data.two,
          detail_thr: res.data.data.three,
          detail_four: function(){
            if (res.data.data.four.imgs != ''){
              var img_array = res.data.data.four.imgs.split(',');
              return img_array.map(function (data) {
                return config.host + data;
              })
            }else{
              return [];
            }
          }(),
          tenant_start_time: res.data.data.two.tenant_start_time,
          tenant_end_time: res.data.data.two.tenant_end_time,
          insz_time: res.data.data.three.insz_time,
          inoffice_time: res.data.data.three.inoffice_time,
          index: self.data.array.indexOf(res.data.data.two.handed) > -1 ? self.data.array.indexOf(res.data.data.two.handed):0
        })
        console.log(self.data.detail_four);
      }
    })
    wx.request({
      url: config.host + '/api/Admin/getLastEditHouse',
      data:{
        number: app.globalData.number,
        house_id: options.house_id
      },
      success:function(res){
        self.setData({
          top_detail: res.data.data.message
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
    if (this.data.house_id == app.globalData.destination.house_id){
      this.data.detail_one.gps_x = app.globalData.destination.longitude;
      this.data.detail_one.gps_y = app.globalData.destination.latitude;
    }
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
    app.globalData.detail.house_id = this.data.house_id;
    app.globalData.detail.key_name = this.data.detail_one.key_name;
    app.globalData.detail.record_number = this.data.detail_one.record_number;
    app.globalData.detail.address = this.data.detail_one.address;
    app.globalData.detail.org_name = this.data.detail_thr.org_name;
    app.globalData.detail.tenant_name = this.data.detail_thr.tenant_name;
    if (this.data.detail_four){
      app.globalData.detail.title_img = this.data.detail_four[0];
    }else{
      app.globalData.detail.title_img = false;
    }
    console.log(app.globalData.detail);
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
  editOne:function(){
    this.setData({
      one_state: false
    })
  },
  formSubmitOne:function(e){
    e.detail.value.number = app.globalData.number;
    e.detail.value.house_id = this.data.house_id;
    e.detail.value.gps_x = this.data.detail_one.gps_x;
    e.detail.value.gps_y = this.data.detail_one.gps_y;
    e.detail.value.pre_rent = Math.round(e.detail.value.cover_area * 1.66) * 12;
    console.log(e.detail.value);
    // set global detail
    this.setData({
      one_state: true,
      detail_one: e.detail.value
    })
    wx.request({
      url: config.host + '/api/Admin/editHouse',
      data: e.detail.value,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

      }
    })
  },
  editTwo: function () {
    this.setData({
      two_state: false
    })
  },
  formSubmitTwo:function(e){
    e.detail.value.number = app.globalData.number;
    e.detail.value.house_id = this.data.house_id;
    e.detail.value.handed = this.data.array[this.data.index];
    e.detail.value.tenant_start_time = this.data.tenant_start_time;
    e.detail.value.tenant_end_time = this.data.tenant_end_time;
    console.log(e.detail.value);
    this.setData({
      two_state: true,
      detail_two: e.detail.value
    })
    wx.request({
      url: config.host + '/api/Admin/editHouse',
      data: e.detail.value,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

      }
    })
  },
  editThr: function () {
    this.setData({
      three_state: false
    })

  },
  formSubmitThr:function(e){
    e.detail.value.number = app.globalData.number;
    e.detail.value.house_id = this.data.house_id;
    e.detail.value.tenant_id = this.data.detail_thr.tenant_id;
    e.detail.value.insz_time = this.data.insz_time;
    e.detail.value.inoffice_time = this.data.inoffice_time;
    e.detail.value.flag = 1;
    console.log(e.detail.value)
    this.setData({
      three_state: true,
      detail_thr: e.detail.value
    })
    wx.request({
      url: config.host + '/api/Admin/editTenant',
      data: e.detail.value,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

      }
    })
  },
  editFour: function () {
    this.setData({
      four_state: false
    })
  },
  submitFour:function(){
    this.setData({
      four_state: true
    })
  },
  addImg:function(){
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        self.data.detail_four.push(tempFilePaths[0]);
        self.data.add_img_array.push(tempFilePaths[0]);
        self.setData({
          detail_four: self.data.detail_four,
          add_img_array: self.data.add_img_array

        })
        wx.uploadFile({
          url: config.host + '/api/Admin/editHouseImg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'number': app.globalData.number,
            'house_id': self.data.house_id,
            'img_src':''
          },
          success: function (res) {
            var data = res.data
            console.log(res);
          }
        })
      }
    })
  },
  removeImg: function (e) {
    console.log(e.currentTarget.dataset.img);
    var self = this;
    var re = new RegExp(config.host);
    var remove_img = e.currentTarget.dataset.img.replace(re,'');
    console.log(remove_img);
    var remove_add_array_index = this.data.add_img_array.indexOf(remove_img);
    if (remove_add_array_index > -1) {
      this.arrayRemove(this.data.add_img_array, remove_img);
    } else {
      this.data.remove_img_array.push(remove_img);
    }
    this.arrayRemove(this.data.detail_four, e.currentTarget.dataset.img);
    this.setData({
      detail_four: self.data.detail_four
    })
    console.log(remove_img);
    wx.request({
      url: config.host + '/api/Admin/editHouseImg',
      method:'POST',
      data: {
        'number': app.globalData.number,
        'house_id': self.data.house_id,
        'img_src': remove_img
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  arrayRemove: function (array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
  },
  goMap:function(){
    var self = this;
    wx.navigateTo({
      url: '/pages/map/map?gps_x=' + self.data.detail_one.gps_x + '&gps_y=' + self.data.detail_one.gps_y + '&house_id=' + self.data.house_id
    })
  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  bindStartTimeChange:function(e){
    this.setData({
      tenant_start_time: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      tenant_end_time: e.detail.value
    })
  },
  bindInszTimeChange: function (e) {
    this.setData({
      insz_time: e.detail.value
    })
  },
  bindInofficeTimeChange: function (e) {
    this.setData({
      inoffice_time: e.detail.value
    })
  },
  reviewImg:function(e){
    var self = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src, 
      urls: self.data.detail_four
    })
  },
  goPhone:function(event){
    console.log(event);
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone
    })
  }
})