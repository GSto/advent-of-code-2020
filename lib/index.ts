import { Range } from './types'
export function xor(a:boolean, b:boolean): boolean {
  return (a || b) && !(a && b)
}

export function binarySearch(haystack: any[], needle:any) : boolean {
  let start = 0
  let end = haystack.length - 1
  while(start <= end) {
    let mid = Math.floor((start + end) / 2)
    if (haystack[mid] === needle) return true
    
    if (haystack[mid] < needle) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }
  return false
}

export function inRange(num: number, range: Range): boolean {
  return (num - range.start) * (num - range.end) <= 0
}

export function matchesRegex(str:string, exp:RegExp): boolean {
  return str.match(exp) !== null
}