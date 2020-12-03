import fs from 'fs'
import { binarySearch } from '../lib'

interface PotentialPair {
  first: number,
  second: number,
  inverse: number,
}

const TARGET = 2020

const contents = fs.readFileSync(__dirname+'/expense_report.txt', 'utf8')

const expenseReport: number[] = contents
  .split('\n')
  .map(num => parseInt(num))
  .sort((a, b) => a - b)

function findPair(items: number[], target: number): number | null {
  for(let item of items) {
    const inverse = target - item
    if(binarySearch(items, inverse)) {
      return item * inverse
    }
  }

  return null
}

function findTriplet(items: number[], target: number): number | null {
  for(let i in items) {
    for(let j in items) {
      if(i === j) break
      const inverse = target - (items[i] + items[j])
      if(binarySearch(items, inverse)) {
        return items[i] * items[j] * inverse
      }
    }
  }
  return null
}

const firstAnswer = findPair(expenseReport, TARGET)
const secondAnswer = findTriplet(expenseReport, TARGET)
console.log('firstAnswer ', firstAnswer)
console.log('secondAnswer', secondAnswer)
