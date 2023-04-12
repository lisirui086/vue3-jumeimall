import request from '@/utils/request'
// 获取收藏
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => request('/member/collect', 'get', { page, pageSize, collectType })
// 获取我的足迹
export const findBrowseHistory = ({ page = 1, pagSize = 10 }) => request('/member/browseHistory', 'get', { page, pagSize })
