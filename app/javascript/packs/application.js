// import Vue from 'vue'
// import App from '../lists.vue'
//
// document.addEventListener('DOMContentLoaded', () => {
//   const el = document.body.appendChild(document.createElement('list'))
//   const app = new Vue({
//     el,
//     render: h => h(App)
//   })
//
//   console.log(app)
// })

//
// If the using turbolinks, install 'vue-turbolinks':
//
// yarn add 'vue-turbolinks'
//
// Then uncomment the code block below:
//
//window.Vue = require('vue')
import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
import App from '../lists.vue'
import VueResource from 'vue-resource'
import iview from 'iview'
import 'iview/dist/styles/iview.css';
window._ = require("lodash");

Vue.use(VueResource);
Vue.use(TurbolinksAdapter);
Vue.use(iview);

import API from './lib/api';
Vue.prototype.$api = API;

const requireComponent = require.context(
  // 其组件目录的相对路径
  './screens',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\.vue$/i
)
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 获取组件的 PascalCase 命名
  const componentName = _.upperFirst(
    _.camelCase(
      // 剥去文件名开头的 `./` 和结尾的扩展名
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )
  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

document.addEventListener('turbolinks:load', () => {
  // Vue.http.headers.common['X-CSRF-Token'] = document.
  // querySelector('meta[name="csrf-token"]').getAttribute('content')

  var app = new Vue({
    el: '[data-behavior="vue"]',
    components: { App}
  })

  console.log(app)
})
