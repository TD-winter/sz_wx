var app = getApp();
Page({
  data: {
    markers: [{
      iconPath: "/mark.png",
      id: 0,
      latitude: 30.55386,
      longitude: 114.31599,
      width: 30,
      height: 45
    }],
    controls: [{
      id: 1,
      iconPath: '/destination.png',
      position: {
        left: 0,
        top: 400,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    destination: {
      house_id:null,
      latitude: 30.55386,
      longitude: 114.31599
    },
    position: {
      latitude: 30.55386,
      longitude: 114.31599
      }
  },
  onLoad:function(options){
    //this.getPosition();
    console.log(options);
    this.setData({
      markers: [{
        iconPath: "/mark.png",
        id: 0,
        latitude: options.gps_y,
        longitude: options.gps_x,
        width: 30,
        height: 45
      }],
      destination: {
        house_id:options.house_id,
        latitude: options.gps_y,
        longitude: options.gps_x
      },
      position:{
        latitude: options.gps_y,
        longitude: options.gps_x
      }
    })
  },
  onReady:function(e){
    this.mapCtx = wx.createMapContext("map");
  },
  onUnload: function () {
    app.globalData.destination = this.data.destination;
  },
  markertap(e) {
    console.log('确定');
  },
  toLocation(e) {
    this.mapCtx.moveToLocation()
  },
  setDestination(e){
    var self = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
        self.setData({
          markers: [{
            iconPath: "/mark.png",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 30,
            height: 45
          }],
          destination: {
            house_id: self.data.destination.house_id,
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
  },
  getPosition:function(){
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
        self.setData({
          position:{
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
  }
})