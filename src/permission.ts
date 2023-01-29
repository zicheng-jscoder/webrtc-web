import router from './router'
import store from './store'
import { Dialog } from 'vant'
import { RouteLocationNormalized } from 'vue-router'

const detaultTitle = '天府市民云'

router.beforeEach(async (to) => {
  return await authLogic({ to })
})

// 登录授权逻辑
async function authLogic({
  to,
}: {
  to: RouteLocationNormalized
}): Promise<boolean | { path: string }> {
  // 判断 是否是天赋市民云app环境
  const isInApp = ~navigator.userAgent.toLowerCase().indexOf('tfsmy')
  // 保存不需要鉴权的路由，字符串 || 正则
  const whiteList = ['/404', '/403']
  // 判断path是否在白名单
  const isInWhiteList = whiteList.some((rule) => new RegExp(rule).test(to.path))
  // 在白名单直接放行
  if (isInWhiteList) {
    return true
  }

  if (!isInApp) {
    try {
      const { code, result } = await dispatchAuth()
      if (+code !== 200) return { path: '/403' }
      // 设置文档title
      document.title = resolveDocTitle(to)
      sessionStorage.user = (result && JSON.stringify(result)) || ''
      return true
    } catch (error) {
      console.log(error)
      return retryAuth(to)
    }
  }

  // app放行
  return true
}

// 授权失败重试
async function retryAuth(to: RouteLocationNormalized) {
  try {
    await Dialog.confirm({
      message: '授权失败, 是否重试',
    })
    return authLogic({ to })
  } catch (error) {
    return { path: '/404' }
  }
}

// 请求接口
function dispatchAuth() {
  return store.dispatch('user/auth')
}

// 修改html title
function resolveDocTitle(to: RouteLocationNormalized) {
  return `${(to.meta.title && to.meta.title + '-') || ''}${detaultTitle}`
}
