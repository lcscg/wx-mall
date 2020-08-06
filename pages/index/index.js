//Page Object
import { request } from "../../request/index"
Page({
  data: {
    // 轮播数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },
  //获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(res => {
        this.setData({
          swiperList: res.data.message
        })
      })
  },
  //获取导航数据
  getCatesList() {
    request({ url: "/home/catitems" })
      .then(res => {
        this.setData({
          catesList: res.data.message
        })
      })
  },
  //获取楼层数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(res => {
        this.setData({
          floorList: res.data.message
        })
        // console.log(this.data.floorList);
      })
  }

});