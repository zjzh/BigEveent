$(function () {
  // 从layui中获取form对象
  let form = layui.form
  // 从layui中获取layer对象才能调用提示框
  let layer = layui.layer

  form.verify({
    // 原密码的验证规则
    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 新密码的验证规则
    newPwd: value => {
      if (value === $('.oldPwd').val()) return '新密码不能与旧密码相同！'
    },
    // 确认密码的验证规则
    rePwd: value => {
      if (value !== $('.newPwd').val()) return '两次密码不一致！'
    }
  })

  $('.layui-form').submit(function (e) {
    e.preventDefault()
    // serialize()函数可以拿到表单里面的所有值
    let formData = $(this).serialize()

    // 发起更新密码请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: formData,
      success: res => {
        console.log(res)
        // 修改密码失败
        if (res.stauts !== 0) return layer.msg(res.message)

        // 修改密码成功
        layer.msg(res.message)
        // 重置密码框
        $('.form-reg')[0].reset() // 这里不清除为什么这个方法不能重置  
      }
    })
  })
})