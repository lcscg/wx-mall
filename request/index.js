// 同时发送异步代码的次数
let axiosTimes = 0;
export const request = (params) => {
    axiosTimes++;
    // 显示加载效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                axiosTimes--;
                if (axiosTimes === 0) {
                    // 关闭加载窗口
                    wx.hideLoading()
                }
            }
        })
    })
}