// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：vue3移除了过滤器。
// 这就是插件
// vue2插件写法要求：导出一个对象，有install函数，默认传入了vue构造函数，vue基础上扩展
// vue3插件写法要求：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
export default {
  install (app) {
    // 在app上进行扩展，app提供component, directive函数
    // 如果要挂载原型 app.config.globalProperties方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
  }
}
