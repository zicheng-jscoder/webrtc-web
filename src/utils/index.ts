export function getQueryString(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return decodeURI(r[2])
  }
  return null
}

export function getHashQueryString(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  if (window.location.hash.substr(1).split('?')[1]) {
    const r = window.location.hash.substr(1).split('?')[1].match(reg)
    if (r !== null) {
      return unescape(getCharFromUtf8(r[2]))
    }
    return null
  }

  function getCharFromUtf8(str: string) {
    var cstr = ''
    var nOffset = 0
    if (str == '') return ''
    str = str.toLowerCase()
    nOffset = str.indexOf('%e')
    if (nOffset == -1) return str
    while (nOffset != -1) {
      cstr += str.substr(0, nOffset)
      str = str.substr(nOffset, str.length - nOffset)
      if (str == '' || str.length < 9) return cstr
      cstr += utf8ToChar(str.substr(0, 9))
      str = str.substr(9, str.length - 9)
      nOffset = str.indexOf('%e')
    }
    return cstr + str
  }

  function utf8ToChar(str: string) {
    var iCode, iCode1, iCode2
    iCode = parseInt('0x' + str.substr(1, 2))
    iCode1 = parseInt('0x' + str.substr(4, 2))
    iCode2 = parseInt('0x' + str.substr(7, 2))
    return String.fromCharCode(
      ((iCode & 0x0f) << 12) | ((iCode1 & 0x3f) << 6) | (iCode2 & 0x3f)
    )
  }
}
