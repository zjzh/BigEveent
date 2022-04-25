$(function () {
  // 调用getUserInfo()获取用户基本信息
  getUserInfo()

  // 退出功能
  let layer = layui.layer
  $('#sign-out').click(function () {
    layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
      // 退出跳转到登录
      window.location.replace('../../login.html')
      // 清空token
      localStorage.removeItem('token')
    })
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // // 把token添加到请求头这样才能访问有权限的接口
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: res => {
      console.log(res)
      let { status, message } = res
      // 获取用户信息失败
      if (status != 0) return layui.layer.msg(message)

      // 获取成功调用renderUserInfo函数
      renderUserInfo(res)
    },
    // 防止用户通过输入url的方式来访问后台
    // 无论成功还是失败都会调用这个jquery提供的 complete函数
    // complete(res) {
    //   console.log(res)
    //   // 在complete回调函数中可以通过responseJSON拿到服务器返回响应回来的数据
    //   let value = res.responseJSON
    //   if (value.status === 1 && value.message === value.message) {
    //     // 跳转到登录页
    //     window.location.replace('../../login.html')
    //     // 清空token
    //     localStorage.removeItem('token')
    //   }
    // }
  })
}

function renderUserInfo(res) {
  // 解构res对象
  let { nickname, user_pic, username } = res.data
  // 获取用户名
  let uname = nickname || username
  $('.welcmon-user').text('欢迎\t\t' + uname)

  // 判断有没有头像 有就创建img标签没有则显示默认文本头像
  let img = $('<img src="" class="layui-nav-img"/>')
  if (user_pic !== null) {
      // 先进行清除后添加
      $('.layui-nav-img').remove()
      // 添加头像到userinfo DOM元素中
      $('.userinfo').prepend(img)
      $('.layui-nav-img').attr('src', user_pic).show()
      $('.text-avater').hide()
  } else {
    // 渲染文本头像
    $('.layui-nav-img').hide()
    $('.text-avater').text(uname[0].toUpperCase()).show()
  }
}