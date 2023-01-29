import { auth } from '@/service/auth'
import { getToken, setToken } from '@/utils/auth'
import { Commit, Module } from 'vuex'
import { SET_TOKEN } from '../types'

const state = {
  token: getToken(),
}

const mutations = {
  [SET_TOKEN]: (state: Store.UserTypes, payload: string) =>
    (state.token = payload),
}

const actions = {
  async auth({ commit }: { commit: Commit }) {
    try {
      const { code, result } = await auth()
      if (code === 401) {
        window.location.href = result
      }

      if (code === 200) {
        commit('SET_TOKEN', 'auth')
        setToken('auth')
      }
      return Promise.resolve({ code, result })
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

const store: Module<Store.UserTypes, Store.RootStateType> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default store
