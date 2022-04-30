$(function () {
  let layer = layui.layer
  let form = layui.form
  // 初始化富文本编辑器
  initEditor()
  initCate()

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 获取选项框里面的文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        if (res.status != 0) return layer.msg(res.message)

        let htmlStr = template('tpl-cate', res.data)
        $('#cate-select').html(htmlStr)
        form.render()
      }
    })
  }
  // 用按钮来模拟按钮文件上传框
  $('#btnChooseImage').click(function () {
    $('#coverFile').click()
  })

  // 获取用户选择的文件列表
  $('#coverFile').change(function (e) {
    let files = e.target.files
    // 用户没有选择文件取消了文件
    if (files.length === 0) return

    // 用户选择了文件时
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 设置文章的默认发布状态
  let art_state = '已发布'

  // 存为草稿
  $('#btnSave2').click(function () {
    art_state = '草稿'
  })

  // 为表单绑定submit事件
  $('#form-pub').submit(function (e) {
    e.preventDefault()
    // 将jq转换为原生对象因为jq无法直接使用form对象
    let form = $(this)[0]
    // 创建formData对象
    let fd = new FormData(form)

    // 存储文章发布状态到formData对象当中
    fd.append('state', art_state)
    $image.cropper('getCroppedCanvas', {
      // 创建画布
      width: 400,
      height: 400
    }).toBlob(function (blob) {
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 5. 将文件对象，存储到 fd 中
      fd.append('cover_img', blob)
      // 6. 发起 ajax 数据请求
      publishArticle(fd)
    })
    // cate_id文本框选择的id
    fd.forEach(item => console.log(item))
  })
  // 定义发布文章的ajax方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：在jq中向服务器提交formData数据格式时需要添加两个配置项

      // 不修改content-Type属性 使用fromdata对象默认的content-Type值
      contentType: false,
      // 不对fromdata对象中的数据进行url编码，而是将原数据发到服务器
      processData: false,
      success: res => {
        // 发表文章失败时
        if (res.status != 0) return layer.msg(res.message)

        // 发表文章成功

        layer.msg(res.message)
        // 发表后跳转到文章列表页面
        // window.location.replace('../../../article/art-list.html')
        $('#form-pub')[0].reset()
      }
    })
  }
})