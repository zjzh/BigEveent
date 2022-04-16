// 管理统一的请求地址

// 注意：每次调用 $.ajax()的时候会先调用$.ajaxPrefilter()函数在这个函数中可以拿到ajax的配置对象

// 在发起ajax之前，统一拼接请求的根路径
$.ajaxPrefilter(options => {options.url = 'http://www.liulongbin.top:3007' + options.url})