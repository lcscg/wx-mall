// pages/1ogin/index.js
Page({
  getUserInfo(e){
    const {userInfo}=e.detail
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})