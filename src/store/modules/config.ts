import { Module } from 'vuex'

const state = {
  provider: '',
  shouldRedirect: null,
}

const mutations = {}

const actions = {}

const store: Module<Store.ConfigTypes, Store.RootStateType> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default store
