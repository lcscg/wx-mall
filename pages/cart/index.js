// pages/cart/index.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx";
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收获地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选
    this.setData({
      address
    });
    this.setCart(cart)

  },
  // 点击收货地址
  async handleChooseAddress() {
    try {
      // 1.获取权限状态
      const res = await getSetting();
      const scopeAddress = res.authSetting["scope.address"];
      // 2判断权限状态
      if (scopeAddress === false) {
        // 3诱导用户打开授权页面
        await openSetting();
      }
      // 4调用获取收获地址API
      let address = await chooseAddress();
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo;
      // 5存入到缓存中
      wx.setStorageSync("address", address);
    } catch (err) {
      console.log(err);
    }
  },
  // 商品选中事件
  handleChange(e) {
    // 获取商品id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 选择反选
    cart[index].checked = !cart[index].checked
    // 吧购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  //设置购物车状态同时重新就算数据
  setCart(cart) {
    let allChecked = true;
    // 总价格总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  // 全选
  handleAllChange() {
    let { cart, allChecked } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
  },
  async handleItemNumEdit(e) {
    // 获取参数 
    const { operation, id } = e.currentTarget.dataset
    // 获取购物车数组
    let { cart } = this.data
    // 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({ content: "您是否要删除该商品？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  }
});