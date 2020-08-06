// pages/category/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧菜单数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧滚动置顶
    scrolltop: 0,
  },
  // 接口返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      // 不存在，发起请求
      this.getCates()
    } else {
      // 存在,定义过期时间
      if (Date.now() - Cates.time > 1000 * 60 * 10) {
        // 重新发起请求
        this.getCates()
      } else {
        // 使用缓存数据
        console.log('使用缓存数据');
        this.Cates = Cates.data
        //左侧数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 右侧数据
        let rightContent = this.Cates[0].children
        this.setData({ leftMenuList, rightContent })
      }
    }
  },
  async getCates() {
    // request({ url: "/categories" })
    //   .then(res => {
    //     this.Cates = res.data.message
    //     //接口数据存入本地缓存中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    //     //左侧数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name)
    //     // 右侧数据
    //     let rightContent = this.Cates[0].children
    //     this.setData({ leftMenuList, rightContent })
    //   })
    // 使用es7的async await发送异步请求
    const res = await request({ url: "/categories" });
    this.Cates = res.data.message
    //接口数据存入本地缓存中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    //左侧数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 右侧数据
    let rightContent = this.Cates[0].children
    this.setData({ leftMenuList, rightContent })

  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    console.log(e);
    // 1获取被点击的标题身上的索引
    // 2给data中的currentIndex赋值就可以了
    // 3根据不同的索引来渲染右侧的商品内容

    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrolltop: 0
    })

  }
})