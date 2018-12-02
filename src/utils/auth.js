import Cookies from 'js-cookie'

const TokenKey = 'cur_user'

export function getToken() {
  console.log('Get Token: ' + TokenKey)
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
