// 提供复用逻辑的函数（钩子

// target { Element } Dom对象
// apiFn { function } API函数
// 引入 useIntersectionObserver   方法
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
// 懒加载函数
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // target 监听的目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // inINtersecting 是否进入可视区
      if (isIntersecting) {
        // 停止观察
        stop()
        // 调用API函数
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    },
    // 配置选项
    {
      // Either a single number or an array of numbers between 0.0 and 1.
      threshold: 0
    }
  )
  return { result, target }
}
