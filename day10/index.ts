import fs from 'fs'



const input = fs
  .readFileSync(__dirname+'/input.txt', 'utf8')
  .split('\n')
  .map(x => parseInt(x))
  .sort((a, b) => a - b)

  function countDiffs(arr: Array<number>): [number, number] {
    // start at one due to initial port and your device
    let ones = 1 
    let threes = 1

    for(let i = 0; i < arr.length - 1; i++) {
      const diff = arr[i+1] - arr[i]
      if(diff === 1) ones++
      if(diff === 3) threes++
    }
    return [ones, threes]
  }

const diffs = countDiffs(input)
const firstAnswer = diffs[0] * diffs[1]
console.log('firstAnswer', firstAnswer)