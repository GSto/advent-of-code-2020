const fs = require('fs')
const TARGET = 2020

const contents = fs.readFileSync(__dirname+'/expense_report.txt', 'utf8')

const expenseReport = contents
  .split('\n')
  .map(num => parseInt(num))
  .sort((a, b) => a - b)

function findPair(items, target) {
  let answer = null
  for(let i = 0; i < items.length; i++) {
    for(let j = 0; j < items.length; j++) {
      const reverseIndex = items.length - j - 1
      const result = items[i] + items[reverseIndex]
      if(result < TARGET) {
        break
      }
      if(result === TARGET) {
        answer = items[i] * items[reverseIndex]
        break
      }
    }
    if(answer) break
  }
  return answer
}

function findTriplet(items, target) {
  let answer = null
  let potentialPairs = []
  const lowest = items[0]
  const highest = items[items.length - 1]

  items.forEach((first, i) => {
    items.forEach((second, j) => {
      if(i === j) return 
      const sum = first + second
      const inverse = TARGET - sum

      if(sum < target && inverse >= lowest && inverse <= highest) {
        potentialPairs.push({
          first,
          second, 
          inverse
        })
      }
    })
  })

  potentialPairs.sort((a, b) => a.inverse - b.inverse)

  for(pair of potentialPairs) {
    console.log(pair)
    for(num of items) {
      if(num === pair.inverse) {
        answer = pair.first * pair.second * num
        break
      }
      if(pair.inverse < num) break
    }
    if(answer) break
  }
  return answer
}

// const firstAnswer = findPair(expenseReport, TARGET)
const secondAnswer = findTriplet(expenseReport, TARGET)
console.log('answer is ', secondAnswer)