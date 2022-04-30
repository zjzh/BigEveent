$(function () {
  // 去注册
  $('.reg').click(function () {
    $('.link-reg').hide()
    $('.link-login').show()
  })
  // 去登录
  $('.login').click(function () {
    $('.link-login').hide()
    $('.link-reg').show()
  })
  // 从layui中获取form对象
  let form = layui.form
  // 从layui中获取layer对象才能调用提示框
  let layer = layui.layer
  // 自定义校验规则
  form.verify({
    username: function (value, item) { //value：表单的值、item：表单的DOM对象
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return '用户名不能有特殊字符';
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return '用户名首尾不能出现下划线\'_\'';
      }
      if (/^\d+\d+\d$/.test(value)) {
        return '用户名不能全为数字';
      }
    },

    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repass: value => {
      /* 
         1.value参数拿到的是确认密码框里面的内容
         2.还需要拿到密码框里面的内容
         3.然后进行相等的判断
         4.如果里面的值不相等则返回一个错误提示
      */
      let reginput = $('.reg-pass2').val()

      if (value != reginput) return '两次输入的密码不一致'
    }
  })

  // 提交注册信息
  $('.form-reg').submit(function (e) {
    // 拿到注册的用户名
    let username = $('.reg-username2').val()
    // 拿到密码
    let password = $('.reg-pass2').val()
    // 阻止默认提交表单
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username,
        password
      },
      success: res => {
        console.log(res);
        // 调用传递数据
        getRegData(res)
      }
    })
  })

  // 注册的处理逻辑函数
  function getRegData(res) {
    // 注册失败
    if (res.status != 0) return layer.msg(res.message)

    // 注册成功

    // 成功后的提示信息
    layer.msg(res.message)
    // 自动跳转到登录页面
    $('.login').click()
    // 重置注册表单
    $('.form-reg').get(0).reset()
  }

  // 登录信息
  $('.form-login').submit(function (e) {
    e.preventDefault()
    // 拿到表单里面的所有值
    let data = $(this).serialize()

    // 提交发起登录请求
    $.ajax({
      method: 'POST',
      url: '/api/login',
      // 表单里面的值
      data: data,
      success: res => {
        // 调用登录的函数
        getLogin(res)
      }
    })
  })

  // 登录的操作逻辑
  function getLogin(res) {
    // 对res对象进行解构
    let { status, message, token } = res
    // 登录失败
    if (status != 0) return layer.msg('请输入正确的用户名和密码!')

    // 登录成功
    layer.msg(message)

    // 把登录的token存储在本地 token用于记录用户登录信息还有用来访问有权限的接口
    window.localStorage.setItem('token', token)

    // 登录成功后跳转到后台
    window.location.replace('./index.html')
  }
})