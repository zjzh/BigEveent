// 管理统一的请求地址

// 注意：每次调用 $.ajax()的时候会先调用$.ajaxPrefilter()函数在这个函数中可以拿到ajax的配置对象

// 在发起ajax之前，统一拼接请求的根路径
$.ajaxPrefilter(options => {
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // console.log(options)
  // 判断该接口是否有权限
  if (options.url.indexOf('/my/') !== -1) {
    // 为有权限的接口统一添加token
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 防止用户通过输入url的方式来访问后台 *全局拦截
  // 无论成功还是失败都会调用这个jquery提供的 complete函数
  options.complete = function(res) {
    // console.log(res)
    // 在complete回调函数中可以通过responseJSON拿到服务器返回响应回来的数据
    let value = res.responseJSON
    if (value.status === 1 && value.message === value.message) {
      // 跳转到登录页
      window.location.replace('../../index.html')
      // 清空token
      localStorage.removeItem('token')
    }
  }
})