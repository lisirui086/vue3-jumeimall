import { createVNode, render } from 'vue'
// 导入确定对话框组件
import XtxConfirm from '@/components/library/xtx-confirm.vue'
// 准备一个DOM容器
const div = document.createElement('div')
div.setAttribute = ('class', 'xtx-confirm-container')
document.body.appendChild(div)
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 取消
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('已取消'))
    }
    // 确定
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 准备一个虚拟DOM容器
    const vn = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  })
}
