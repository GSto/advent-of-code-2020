import fs from 'fs'
import { uniqifyArray } from '../lib'


const input = fs
  .readFileSync(__dirname+'/input.txt', 'utf8')
  .split('\n')
  .map(str => parseInt(str))

  function sumMatrix(data: number[]): number[] {
  const result = []
  for(let i in data) {
    for(let j in data) {
      if(i !== j) {
        result.push(data[i] + data[j])
      }
    }
  }
  return uniqifyArray(result)
}

function ArraySum(data:number[]): number { 
  return data.reduce((acc, num) => acc + num, 0)
}

function minMaxSum(data:number[]): number {
  const sorted = data.sort((a, b) => a - b)
  return sorted[0] + sorted.slice(-1)[0]
}

function findContiguousSumSet(data:number[], target:number): number[] {
  // start at each number
  // add until you hit or go over
  // repeat
  for(let i in data) {
    if(data[i] > target) continue
    for(let j in data) {
      if(data[j] > target) continue
      if(i === j) continue
      const numI = parseInt(i)
      const numJ = parseInt(j)
      const potentialSet = data.slice(numI,numJ-numI+1)
      if(ArraySum(potentialSet) > target) break
      if(ArraySum(potentialSet) === target) return potentialSet
    }
  }
  return []
}

function invalidNumbers(data: number[], preamble:number): number[] {
  return data
    .slice(preamble)
    .filter((num, i) => {
      const slice = data.slice(i, preamble + i)
      const sums = sumMatrix(slice)
      return !sums.includes(num)
    })
}

function firstInvalidNumber(data: number[], preamble:number):number {
  const invalids = invalidNumbers(data, preamble)
  return invalids[0] || -1
}


const preamble = 25
const firstAnswer = firstInvalidNumber(input, preamble)
const contiguousSet = findContiguousSumSet(input, firstAnswer)
const secondAnswer = minMaxSum(contiguousSet)
console.log('firstAnswer', firstAnswer)
console.log('secondAnswer', secondAnswer)