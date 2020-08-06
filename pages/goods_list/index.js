// pages/goods_list/index.js
import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    console.log(e);
    // 1获取被点击的标题索引
    const { index } = e.detail
    // 2修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? v.isActive = true : v.isActive = false
    });
    // 3赋值
    this.setData({
      tabs
    })
  },
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams })
    //总条数
    const total = res.data.message.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  // 滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页
      wx.showToast({
        title: '我是有底线的',
      });
    } else {
      // 还有下一页
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  onPullDownRefresh: function () {
    // 触发下拉刷新时执行
    this.setData({
      // 拼接数组
      goodsList: []
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList()
  },
})