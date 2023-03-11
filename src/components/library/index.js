// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：vue3移除了过滤器。
// 这就是插件
// vue2插件写法要求：导出一个对象，有install函数，默认传入了vue构造函数，vue基础上扩展
// vue3插件写法要求：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
// 引入加载失败时显示默认图片
import defaultImage from '@/assets/images/200j.jpg'
export default {
  install (app) {
    // 在app上进行扩展，app提供component, directive函数
    // 如果要挂载原型 app.config.globalProperties方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    // 定义指令
    defineDirective(app)
  }
}
// 定义指令
const defineDirective = (app) => {
  // 1. 图片懒加载指令
  // 原理：先存储图片地址，不能放在src上，当图片进入可视区，将你存储图片的地址设置给图片元素即可
  app.directive('lazy', {
    // vue2.0监听指令的DOM是否创建好，钩子函数：inserted
    // vue3.0监听拥有的钩子函数和组件一样，使用指令的DOM是否创建好，钩子函数:mounted
    mounted (el, binding) {
      // 2. 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        // 如果进入可视区
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el)
          // 3. 把指令的值设置给el的src属性 binding.value 就是指令的值
          el.src = binding.value
          // 4. 处理图片加载失败 error是图片加载失败的事件
          el.onerror = () => {
            el.src = defaultImage
          }
        }
      }, {
        // 交叉值
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
