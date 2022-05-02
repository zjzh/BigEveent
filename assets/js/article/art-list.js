$(function () {
  let layer = layui.layer

  // 从layui中获取form对象
  let form = layui.form

  var laypage = layui.laypage;

  // 处理时间的过滤器 使用方式：在模板中使用 |符号调用
  template.defaults.imports.dateFormat = function (date) {
    let time = new Date(date)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()

    // 时间
    let hh = time.getHours()
    hh = hh < 10 ? '0' + hh : hh
    let mm = time.getMinutes()
    mm = mm < 10 ? '0' + mm : mm
    let ss = time.getSeconds()
    ss = ss < 10 ? '0' + ss : ss
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义查询参数对象，请求数据的时候需要将请求参数提交到服务器
  let q = {
    // 页码值，默认请求第一页
    pagenum: 1,
    // 每页显示多少条数据，默认显示2页数据
    pagesize: 2,
    // 文章分类的id
    cate_id: '',
    // 文章的发布状态
    state: ''
  }
  // 调用发起请求表格列表数据
  initTableListData()

  // 获取表格列表数据函数
  function initTableListData() {
    $.ajax({
      method: 'GEt',
      url: '/my/article/list',
      data: q,
      success: res => {
        console.log(res)
        // 获取数据失败
        if (res.status != 0) return layer.msg(res.message)

        // 成功后

        // 存储渲染好的模板
        let tabDataList = template('tpl-table', res.data)

        // 将模板展示到表格
        $('.tableData').html(tabDataList)

        // 注意：只有表格渲染完成后才请求分页数据进行渲染
        renderPage(res.total)
      }
    })
  }
  // 初始化文章分类
  initCate()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        console.log(res)
        if (res.status != 0) return layer.msg(res.message)

        let htmlArtCate = template('tpl-select', res.data)
        $('.select').html(htmlArtCate)

        // 由于layui渲染机制的原因会导致下拉框渲染不出来所以需要使用form.render重新渲染

        form.render()
      }
    })
  }

  // 为表单绑定submit事件实现筛选功能
  $('#form-search').submit(function (e) {
    e.preventDefault()
    // 选择框选择的值
    let cate_id = $('.select').val()
    // 文章布状态
    let state = $('#draft').val()

    // 为查询参数对应的值进行赋值
    q.cate_id = cate_id
    q.state = state

    // 根据最新的q查询参数对象，请求最新的数据
    initTableListData()
  })

  // totle数据的总条数
  function renderPage(total) {
    //执行一个laypage实例
    laypage.render({
      // 分页容器 注意，这里的 test1 是 ID，不用加 # 号
      elem: 'pageBox',
      //数据总数，从服务端得到
      count: total,
      // 每页显示条数 从q查询参数对象中得到
      limit: q.pagesize,
      // 切换的页码值 从q查询参数对象中得到
      curr: q.pagenum,
      limits: [2, 3, 5, 10],
      // 分页配置功能
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

      /* 
        jump函数触发的方式有两种：
          1. 点击页码的时候会触发jump回调
          2. 只要调用 laypage.render方法，就会触发jump回调
          3. initTableListData() -> renderPage() -> initTableListData() 发生死循环
      */
      jump: (obj, first) => {  // 页码值发生切换时，就会触发jump回调

        // 当分页发生切换时把最新的页码值赋给查询参对象发送对应的请求从而得到最新的数据
        q.pagenum = obj.curr
        // 把最新的条目数,赋值到 q 查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        // 注意：initTableListData() 这里直接调用会触发死循环，数据和页码值不会发生改变

        /*  
        可以通过first的值，来判断通过那种方式，触发的jump回调：
          1. 如果first的值true，证明是方式2进行触发的
          2. 否则就是方式1触发的
        */

        // 不为方式二(不为true)的时候才进行调用initTableListData()
        if (!first) {
          // 根据最新的q查询参数对象，请求最新的数据
          initTableListData()
        }

      }
    })
  }
  // 根据代理的新式为删除按钮绑定点击事件

  $('tbody').on('click', '.delete-crt-list', function () {
    // 获取删除按钮的个奥数
    let len = $('.delete-crt-list').length
    // 获取点击的这一行id值
    let id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: res => {
          // 删除失败
          if (res.status != 0) return layer.msg(res.message)

          // 成功
          layer.msg(res.message)
          /* 
            当数据删除完成后,需要判断当前这一页中,是否还有剩余的数据如果没有剩余的数据,
            则让页码之减1再重新调用initTableListData() 
          */

          /* 
            注意: 由于删完页码值当前最后的数据时,q.pagenum是不会发生变化所以需要每次删除最后一条数据时让他减1
            这里是通过按钮的个数来判断的 
          */
          if (len <= 1) {
            // 如果len的值小于等于1,证明删除完毕之后,页面上就没有任何数据了
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          // 删除成功后刷新表格列表数据
          initTableListData()
        }
      })
      // 关闭提示框
      layer.close(index)
    })
  })
})