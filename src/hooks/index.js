// 提供复用逻辑的函数（钩子

// target { Element } Dom对象
// apiFn { function } API函数
// 引入 useIntersectionObserver   方法
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { ref, onUnmounted } from 'vue'
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
// 支付倒计时
export const usePayTime = () => {
  // 存储真正的倒计时
  const timer = ref(30 * 60)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    timer.value--
    // 转化时间格式
    timeText.value = dayjs.unix(timer.value).format('mm分ss秒')
    if (timer.value <= 0) {
      pause()
    }
  }, 1000, false)
  // 组件卸载清除到期时
  onUnmounted(() => {
    pause()
  })
  // 将resume return 出去
  const start = (countDown) => {
    timer.value = countDown
    // 防止已加载空白卡顿
    timeText.value = dayjs.unix(timer.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText }
}
