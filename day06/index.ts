import fs from 'fs'

interface Key {
  [key:string]: number
}

const input = fs
  .readFileSync(__dirname+'/answers.txt', 'utf8')
  .split('\n\n')

function buildKey(group:string):Key {
  return group.split(/\s?/).reduce((acc:Key, char:string ):Key => {
    return {
      ...acc,
      [char]: typeof acc[char] !== 'undefined' ? acc[char] + 1 : 1,
    }
  }, {})
}

function countUnanimousAnswers(answers:Key, target:number): number {
  return Object.values(answers).filter(x => x === target).length
}

const anyoneAnsweredYes = input.reduce((acc:number, group:string): number => {
  return acc + new Set(group.split(/\s?/)).size
}, 0)

const everyoneAnsweredYes = input.reduce((acc: number, group:string): number => {
  const sampleSize = group.split('\n').length
  const key:Key = buildKey(group)
  return acc + countUnanimousAnswers(key, sampleSize)
}, 0)

console.log('firstAnswer', anyoneAnsweredYes)
console.log('secondAnswer', everyoneAnsweredYes)