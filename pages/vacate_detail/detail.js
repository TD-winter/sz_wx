// pages/list/list.js
import config from '../../utils/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    status: '',//1周转房，2门面房
    radioItems: [
      { name: '到期退租', value: 1 },
      { name: '中途退租', value: 2, checked: true }
    ],
    hidden: false,
    base_detail:{

    },
    detail:{
      tt_name:'',
      org_name:'',
      address:'',
      id_card:'',
      sdate:'',
      edate:'',
      turn_type:'',
      t_reason:'',
      e_water:'',
      e_elect:'',
      e_gas:'',
      e_warm:'',
      tp_imgs:''
    },
    img_one:[],
    img_two:[],
    img_three:[],
    img_four:[],
    img_url:{
      img_one: [],
      img_two: [],
      img_three: [],
      img_four: []
    },
    add_img_array:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      status: options.status
    })
    this.getDetail(options.id);
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
  radioChange: function (e) {
    var checked = e.detail.value;
    var changed = {};
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].value) !== -1) {
        changed['radioItems[' + i + '].checked'] = true
      } else {
        changed['radioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed);
  },
  addImg: function (e) {
    var self = this;
    var pic_type = e.currentTarget.dataset.type;
    console.log(pic_type);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        self.data[pic_type].push(tempFilePaths[0]);
        if (pic_type == 'img_one'){
          self.setData({
            img_one: self.data[pic_type]
          })
        } else if (pic_type == 'img_two'){
          self.setData({
            img_two: self.data[pic_type]
          })
        } else if (pic_type == 'img_three'){
          self.setData({
            img_three: self.data[pic_type]
          })
        }else{
          self.setData({
            img_four: self.data[pic_type]
          })
        }

        wx.uploadFile({
          url: config.host + '/admin.php/wx/annex/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            // 'token': '28b554ac7b79dbe6e200dbbe70805c9f',
            'token': app.globalData.token,
            'name': 'CertificateRight',
            'thumb': 'no',
            'group' : 'thouse',
            'water' : 'no'
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data);
            self.data.img_url[pic_type].push(data.data.file);
          }
        })
      }
    })
  },
  removeImg: function (e) {
    var self = this;
    var re = new RegExp(config.host);
    var pic_type = e.currentTarget.dataset.type;

    var remove_index = this.arrayRemove(this.data[pic_type], e.currentTarget.dataset.img);
    var remove_img = this.data.img_url[pic_type][remove_index];
    this.data.img_url[pic_type].splice(remove_index,1);

    if (pic_type == 'img_one') {
      self.setData({
        img_one: self.data[pic_type]
      })
    } else if (pic_type == 'img_two') {
      self.setData({
        img_two: self.data[pic_type]
      })
    } else if (pic_type == 'img_three') {
      self.setData({
        img_three: self.data[pic_type]
      })
    } else {
      self.setData({
        img_four: self.data[pic_type]
      })
    }

    wx.request({
      url: config.host + '/admin.php/wx/annex/handle',
      method: 'POST',
      data: {
        'token': app.globalData.token,
        // 'token': '28b554ac7b79dbe6e200dbbe70805c9f',
        'url': remove_img
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        console.log(self.data.img_url);
      }
    })
  },
  arrayRemove: function (array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
      return index;
    }
  },
  getDetail:function(id){
    var _self = this;
    if (_self.data.status == 1) {
      var url_string = '/admin.php/wx/index/tTurnDetail';
    } else if (_self.data.status == 2) {
      var url_string = '/admin.php/wx/index/bTurnDetail';
    }
    _self.setData({
      id:id
    });
    wx.request({
      url: config.host + url_string, 
      method:'POST',
      data: {
        id:id,
        token: app.globalData.token
        //id: '1000732',
        // token:'28b554ac7b79dbe6e200dbbe70805c9f'
      },
      header: {
        'content-type': 'application/json' 
      },
      success(res) {
        console.log(res);
        _self.setData({
          detail:res.data.data,
          radioItems: [
            { name: '到期退租', value: 1, checked: (res.data.data.turn_type==1?true:false)},
            { name: '中途退租', value: 2, checked: (res.data.data.turn_type == 2 ? true : false) }
          ]
        });
      }
    })
  },
  formSubmit:function(event){
    var _self = this;
    var post_img_url = this.data.img_url.img_one.concat(this.data.img_url.img_two).concat(this.data.img_url.img_three).concat(this.data.img_url.img_four);
    //event.detail.value.tp_imgs = this.add_img_array.join(',');
    // event.detail.value.token = "28b554ac7b79dbe6e200dbbe70805c9f";
    event.detail.value.token = app.globalData.token;
    event.detail.value.id = this.data.id;
    event.detail.value.turn_type = parseInt(event.detail.value.turn_type) || 1;
    
    console.log(event);
    if (_self.data.status == 1) {
      var url_string = '/admin.php/wx/index/tTurnForm';
      event.detail.value.tp_imgs = post_img_url.join(';');
    } else if (_self.data.status == 2) {
      var url_string = '/admin.php/wx/index/bTurnForm';
      event.detail.value.bp_imgs = post_img_url.join(';');
    }
    wx.request({
      url: config.host + url_string,
      method: 'POST',
      data: event.detail.value,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})