// pages/cart/index.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx";
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收获地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数据
    cart = cart.filter(v => v.checked)
    // 总价格总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  // 点击支付
  async handleOrderPay() {
    try {
      // 判断token
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
      }
      // 创建订单
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart;
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 获取订单编号
      const res = await request({ url: "/my/orders/create", methed: "post", data: orderParams })
      console.log(res.data.message);
      // const { order_number } = res.data.message
      // 发起预支付接口
      // const res1 = await request({ url: "/my/orders/req_unifiedorder", methed: "post",  data: { order_number } })
      // const { pay } = res.data.message
      // 发起微信支付
      // await requestPayment(pay)
      // 查询订单状态
      // const res2 = await request({ url: "/my/orders/chkOrder", methed: "post", data: order_number,  })
      await showToast({ title: "支付成功" })
      // 删除缓存已经支付的数据
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => { !v.checked })
      wx.setStorageSync("cart", newCart);
      // 跳转订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }
});