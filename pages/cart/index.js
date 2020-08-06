// pages/cart/index.js
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx"
Page({
  data: { address: {}, cart: [] },
  onShow() {
    // 获取缓存中的收获地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart");
    this.setData({ address, cart })
  },
  // 点击收获地址
  async handleChooseAddress() {
    try {
      // 1.获取权限状态
      const res = await getSetting()
      console.log(res);
      const scopeAddress = res.authSetting["scope.address"]
      // 2判断权限状态
      if (scopeAddress === false) {
        // 3诱导用户打开授权页面
        await openSetting()
      }
      // 4调用获取收获地址API
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 5存入到缓存中
      wx.setStorageSync("address", address);
    } catch (err) {
      console.log(err);
    }

  }
})