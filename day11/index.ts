import fs from 'fs'

interface coordinate {
  x: number,
  y: number,
}

const input = fs
  .readFileSync(__dirname+'/input.txt', 'utf8')
  .split('\n')
  .map(str => str.split(''))

function adjacentSeating(seating: string[][], center:coordinate): string[] {
  let result: string[] = []
  const { x, y } = center
  const onLeft = x === 0
  const onRight = x === seating[0].length - 1
  const onTop = y === 0
  const onBottom = y === seating.length - 1


  // row above
  if(!onLeft && !onTop)     result.push(seating[y - 1][x - 1])
  if(!onTop)                result.push(seating[y - 1][x])
  if(!onRight && !onTop)    result.push(seating[y-1][x + 1])

  //same row
  if(!onLeft)               result.push(seating[y][x -1])
  if(!onRight)              result.push(seating[y][x + 1])

  //row on bottom
  if(!onLeft && !onBottom)  result.push(seating[y + 1][x - 1])
  if(!onBottom)             result.push(seating[y + 1][x])
  if(!onRight && !onBottom) result.push(seating[y + 1][x + 1])

  return result
}

function countOccupied(seating: string[][]):number {
  return seating.reduce((acc:number, row: string[]): number => {
    return acc + row.filter(s => s === '#').length
  }, 0)
}

function iterateSeating(seating: string[][]): [string[][], number] {
  let result: string[][] = []
  let mutations = 0

  for(let y = 0; y < seating.length; y++) {
    const row = seating[y]
    result[y] = []
    for(let x = 0; x < row.length; x++) {
      const seat = row[x]
      const adjacents = adjacentSeating(seating, {x, y})
      const adjacentOccupied = adjacents.filter(a => a === '#').length

      // if a seat is empty (L), and there are no occupied seats adjacent, it becomes occupied(#)
      if(seat === 'L' && adjacentOccupied === 0) {
        result[y][x] = '#'
        mutations++
        continue
      }

      // if a seat is occupied (#) and four or more seats adjacent to it are also occupied, it becomes empty(L)
      if(seat === '#' && adjacentOccupied >= 4) {
        result[y][x] = 'L'
        mutations++
        continue
      }

      // otherwise, seat does not change
      result[y][x] = seat
    }
  }
  return [result, mutations]
}


function solvePart1(seating:string[][]): number {
  let iterations = 0
  let mutations = -1
  let current = seating
  while(mutations !== 0) {
    const result = iterateSeating(current)
    iterations++
    current = result[0]
    mutations = result[1]
  }

  return countOccupied(current)
}

const firstAnswer = solvePart1(input)
console.log('part 1:', firstAnswer)







