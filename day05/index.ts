import fs from 'fs'

interface Coordinate {
  row: number,
  col: number,
}

interface Plane {
  rowMin: number,
  rowMax: number,
  colMin: number, 
  colMax: number,
}

const planeSpecs:Plane = {
  rowMin: 0,
  rowMax: 127,
  colMin: 0,
  colMax: 7,
}

const passes = fs.readFileSync(__dirname+'/boarding_passes.txt', 'utf8')
  .split('\n')

function calcSeatId(pass:string): number {
  const binary = pass
    .replace(/F|L/ig, '0')
    .replace(/B|R/ig, '1')
  return parseInt(binary, 2)
}

const seatIdList: Array<number> = passes.map(calcSeatId).sort((a, b) => a - b)
let firstAnswer = seatIdList.slice(-1)[0]

let secondAnswer = null
for(let seatId in seatIdList) {
  const oneUp: number = parseInt(seatId) + 1
  if(seatIdList[oneUp] - seatIdList[seatId] === 2) {
    secondAnswer = seatIdList[seatId] + 1
    break
  }
}

console.log('firstAnswer', firstAnswer)
console.log('secondAnswer', secondAnswer)