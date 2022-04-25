$(function() {
   // 从layui中获取form对象
   let form = layui.form
   // 从layui中获取layer对象才能调用提示框
  let layer = layui.layer
   // 自定义校验规则
   form.verify({
     nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
       if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
         return '用户昵称不能有特殊字符';
       }
       if (/(^\_)|(\__)|(\_+$)/.test(value)) {
         return '用户昵称首尾不能出现下划线\'_\'';
       }
       if (/^\d+\d+\d$/.test(value)) {
         return '用户昵称不能全为数字';
       }
       if(value.length > 6) {
         return '昵称必须在 1 ~ 6个字符之间!'
       }
     }
   })

   initUserInfo()
  //  初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: res => {
        console.log(res)
        // 获取失败
        if(res.status != 0) {
          return layer.msg(res.message)
        }
        // 使用form.val快速为表单设置值
        form.val('formUserInfo', res.data)
      }
    })
  } 

  // 重置表单数据
  $('.resetBtn').click(function(e) {
    // 阻止默认重置事件
    e.preventDefault()

    // 再次发送初始化请求
    initUserInfo()
  })
  
  // 提交表单更新用户信息
  $('.user-form').submit(function(e) {
    e.preventDefault()
    // serialize()函数可以拿到表单里面的所有值
    let formData = $(this).serialize()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: formData,
       success: res=> {
        console.log(res)
        // 修改失败
        if(res.status != 0) {
          return layer.msg(res.message)
        }

        // 修改成功
        // 调用父页面的方法,重新渲染用户头像和用户信息
        // prent代表父页面
        window.parent.getUserInfo()
        layer.msg(res.message)
      }
    })
  })
})