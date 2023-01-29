/// <reference types="node" />

declare module 'js-cookie'

// store module extensions
declare namespace Store {
  enum userToLoginType {
    none = '',
    openWeb = 'openWeb',
    other = 'other',
  }
  interface ConfigTypes {}

  interface UserTypes {
    token: string
  }

  interface RootStateType {
    config: ConfigTypes
    user: UserTypes
  }

  interface ModuleState extends RootStateType {}
}

interface ResponseDataType {
  code: string | number
  result: any
}

interface Form {
  name: string
  phone: string
  createTime: string
}
