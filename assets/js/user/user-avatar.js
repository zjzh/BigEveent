$(function () {
  // 获取要裁剪的图片(DOM对象)
  let image = $('#image')

  // 裁剪的参数配置对象
  let options = {
    // 纵横比
    aspectRatio: 1,
    // 预览区域
    preview: '.img-preview'
  }

  // 创建裁剪区域
  image.cropper(options)

  // 上传按钮
  $('#btnChooseImage').click(function () {
    // 点击按钮实则打开的是上传文件input框
    $('#file').click()
  })

  // 文件发生变化时

  $('#file').change(function (e) {
    console.log(e);
    // 1. 拿到文件位数组   用户选择的文件
    let files = e.target.files

    let layer = layui.layer
    //  2. 如果用户没有选择文件
    if (files.length === 0) return layer.msg('请选择照片！')

    // 用户选择了文件

    // 3. 拿到用户选择的文件

    let file = e.target.files[0]

    // 4. 将文件转换为路径
    let imgUrl = URL.createObjectURL(file)
    console.log(imgUrl)

    // 5. 重新初始化裁剪区域

    /* 
      销毁旧的裁剪区域
      重新设置图片路径
      重新初始化裁剪区域
    */
    image.cropper('destroy').attr('src', imgUrl).cropper(options)
  })

  $('#btnUpload').click(function () {
    
    // 拿到用户裁剪的头像区域
    let dataUrl = image.cropper('getCroppedCanvas', {
      // 创建一个canvas画布
      width: 100,
      height: 100
    }).toDataURL('image/png') // 将canvas画布上的内容转化为base64格式的字符串

    // 调用接口，把头像上传到服务器

    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataUrl
      },
      success: res => {
        console.log(res);
        // 上传头像失败
        if(res.status != 0) return layer.msg(res.message)

        // 上传成功后

        // 从新请求用户基本信息从而更新页面头像
        window.parent.getUserInfo()

        layer.msg(res.message)
      }
    })

  })

})