function checkType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

// 格式化时间戳
export function formatTime(date, format) {
  date = typeof date === 'number' ? new Date(date) : date
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

// 节流函数
export function throttle(func, wait) {
  let timeout
  return function() {
    let context = this
    let args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

export function deepClone(obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  let ret = checkType(obj) === 'Object' ? {} : []
  for (let i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      if (checkType(obj[i]) === 'Object' || checkType(obj[i]) === 'Array') {
        ret[i] = deepClone(obj[i])
      } else {
        ret[i] = obj[i]
      }
    }
  }
  return ret
}

export function beforeTime(timestamp) {
  let diff = Date.now() - timestamp
  let seconds = diff / 1000
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  let days = Math.floor(hours / 24)
  if (minutes <= 0) {
    return '刚刚'
  } else if (hours <= 0) {
    return `${minutes} 分钟前`
  } else if (days < 1) {
    return `${hours} 小时 ${minutes % 60} 分钟前`
  } else if (new Date(timestamp).getFullYear() === new Date().getFullYear()) {
    return formatTime(new Date(timestamp), 'MM-dd hh:mm')
  } else {
    return formatTime(new Date(timestamp), 'yyyy-MM-dd hh:mm')
  }
}
