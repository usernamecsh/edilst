import Cookies from 'js-cookie'

// 随着实际情况变化而变化
const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export { Cookies }
