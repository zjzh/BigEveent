$(function () {

  let layer = layui.layer

  // 从layui中获取form对象
  let form = layui.form

  // 获取文章管理数据
  getCategoryList()


  // 请求文章管理数据
  function getCategoryList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        console.log(res)
        // 获取文章列表失败
        if (res.status != 0) return layer.msg(res.message)

        // 成功后的逻辑

        // 这两个数据不为空才做渲染和添加
        if (res.data.name !== '' && res.data.alias !== '') {
          // 使用模板引擎渲染数据
          let htmlCategory = template('tpl-category', res)

          // 将渲染后的模板添加给tbody
          $('.tbody').html(htmlCategory)
        }
      }
    })
  }

  // 点击添加分类按钮展示弹出层
  let indexAdd = null
  $('#addCategory').click(function () {
    // 弹出层配置对象
    indexAdd = layer.open({
      type: 1,
      // 设置宽高
      area: ['500px', '250px'],
      title: '添加文章分类',
      // 将获取的DOM元素添加到弹出层的内容区域
      content: $('#dailog').html()
    })
  })

  // 由于#dailog里面的form里面的表单时动态创建的所以需要使用事件代理
  $('body').on('submit', '.form-category', function (e) {
    // 阻止默认提交
    e.preventDefault()
    // serialize()函数可以拿到表单里面的所有值
    let formData = $(this).serialize()

    // 发起post请求添加数据
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: formData,
      success: res => {
        // 添加失败
        if (res.status != 0) return layer.msg(res.message)

        // 添加成功逻辑

        // 添加成功刷新文章管理数据
        getCategoryList()
        // 添加成功提示
        layer.msg(res.message)

        // 关闭弹框
        layer.close(indexAdd)
      }
    })
  })

  // 编辑按钮 也是动态创建的也需要使用事件代理

  let indexEdit = null
  $('body').on('click', '.btn', function () {
    // 弹出层配置对象
    indexEdit = layer.open({
      type: 1,
      // 设置宽高
      area: ['500px', '250px'],
      title: '添加文章分类',
      // 将获取的DOM元素添加到弹出层的内容区域
      content: $('#edit-dailog').html()
    })

    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      // 需要拼接id这个查询参数
      url: '/my/article/cates/' + id,
      success: res => {
        // 获取失败
        if (res.status != 0) return layer.msg(res.message)

        // 成功

        // 使用form.val快速为表单设置值
        form.val('form-edit', res.data)
      }
    })
  })

  // 提交修改弹框里的表单
  $('body').on('submit','.form-edit', function(e) {
    // 阻止默认事件
    e.preventDefault()
    let formData = $(this).serialize()
    console.log(formData)
    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: formData,
      success: res => {
        console.log(res)
        // 修改分类失败
        if(res.status != 0) return layer.msg(res.message)

        // 修改成功
        layer.msg(res.message)

        // 关闭修改分类弹出框
        layer.close(indexEdit)

        // 刷新文章管理的请求数据保持页面数据是最新的
        getCategoryList()
      }
    })
  })

  // 点击删除按钮删除本行数据
  $('body').on('click', '.btn-edit', function() {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除 ?', {icon: 3, title:'提示'}, function(index){
      // 在回调中发起请求删除本行数据
      $.ajax({
        method: 'GET',
        // 需要拼接id这个查询参数 指定删除那行
        url: '/my/article/deletecate/' + id,
        success: res => {
          // 删除失败
          if(res.status != 0) return layer.msg(res.message)

          // 删除成功

          layer.msg(res.message)
          layer.close(index)

          // 刷新文章管理的请求数据保持页面数据是最新的
          getCategoryList()
        }
      })
        
    })
  })
})