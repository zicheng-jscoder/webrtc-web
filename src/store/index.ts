import { createStore, useStore as BaseStore } from 'vuex'

import user from './modules/user'
import config from './modules/config'

const store = createStore({
  modules: { user, config },
})

export function useStore<T = Store.ModuleState>() {
  return BaseStore<T>
}

export default store
