import Cookies from 'js-cookie'

const TokenKey = 'access'

export function getAccess() {
  return Cookies.get(TokenKey)
}

export function setAccess(token) {
  return Cookies.set(TokenKey, token)
}

export function removeAccess() {
  return Cookies.remove(TokenKey)
}
