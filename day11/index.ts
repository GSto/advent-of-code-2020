import fs from 'fs'
import { xor } from '../lib'

interface coordinate {
  x: number,
  y: number,
}

interface seatTraversal {
  (seating: string[][], center: coordinate): string[]
}

const input = fs
  .readFileSync(__dirname+'/input.txt', 'utf8')
  .split('\n')
  .map(str => str.split(''))


const directlyAdjacent: seatTraversal = (seating, center) => {
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

function addCoordinates(a:coordinate, b:coordinate):coordinate {
  return { 
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

function coordinatesEqual(a:coordinate, b:coordinate):boolean {
  return a.x === b.x && a.y === b.y
}

function traverseLine(seating: string[][], start:coordinate, move:coordinate, bound:coordinate): string {

  // starting at the edge, treat empty space as empty seats
  if(coordinatesEqual(start, bound)) {
    return '.' 
  }
  const point = addCoordinates(start, move)

  if(move.y < 0 && point.y < 0) return '.' //moved up out of bounds
  if(move.x > 0 && point.x > bound.x) return '.' //moved right out of bounds
  if(move.x < 0 && point.x < 0) return '.' //moved left out of bounds
  if(move.y > 0 && point.y > bound.y) return '.' //moved down out of bounds

  const seat = seating[point.y][point.x]
  if(seat === '#' || seat === 'L' || coordinatesEqual(point, bound)) {
    return seat
  }
  return traverseLine(seating, point, move, bound)
}

function traverser(seating: string[][], start: coordinate) {
  return  (move:coordinate, bound:coordinate):string => traverseLine(seating, start, move, bound)
}

const lineOfSight:seatTraversal = (seating, center) => {
  const rightBound = seating[0].length - 1
  const bottomBound = seating.length - 1
  const view = traverser(seating, center)
  return [
    view({ y: -1, x: -1 }, { y: 0, x: 0 }),                    // up-left,
    view({ y: -1, x: 0  }, { y: 0, x: center.x }),             // up
    view({ y: -1, x: 1 },  { y: 0, x: rightBound }),           // up-right
    view({ y: 0,  x: -1 }, { y: center.y, x: 0 }),             // left
    view({ y: 0,  x: 1 },  { y: center.y, x: rightBound }),    // right,
    view({ y: 1, x: -1 },  { y: bottomBound, x: 0 }),          // down-left, 
    view({ y: 1, x: 0 },   { y: bottomBound, x: center.x }),   // down,
    view({ y: 1, x: 1 },   { y: bottomBound, x: rightBound }), // down-right
  ] 
}

function countOccupied(seating: string[][]):number {
  return seating.reduce((acc:number, row: string[]): number => {
    return acc + row.filter(s => s === '#').length
  }, 0)
}

function iterateSeating(seating: string[][], traversal:seatTraversal, seatTolerance:number): [string[][], number] {
  let result: string[][] = []
  let mutations = 0

  for(let y = 0; y < seating.length; y++) {
    const row = seating[y]
    result[y] = []
    for(let x = 0; x < row.length; x++) {
      const seat = row[x]
      const adjacents = traversal(seating, {x, y})
      const adjacentOccupied = adjacents.filter(a => a === '#').length

      // if a seat is empty (L), and there are no occupied seats adjacent, it becomes occupied(#)
      if(seat === 'L' && adjacentOccupied === 0) {
        result[y][x] = '#'
        mutations++
        continue
      }

      // if a seat is occupied (#) and four or more seats adjacent to it are also occupied, it becomes empty(L)
      if(seat === '#' && adjacentOccupied >= seatTolerance) {
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


function solve(seating:string[][], traversal:seatTraversal, seatTolerance:number): number {
  let mutations = -1
  let current = seating
  while(mutations !== 0) {
    const result = iterateSeating(current, traversal, seatTolerance)
    current = result[0]
    mutations = result[1]
  }

  return countOccupied(current)
}

function solvePart1():number {
  return solve(input, directlyAdjacent, 4)
}

function solvePart2():number {
  return solve(input, lineOfSight, 5)
}

console.log('part 1:', solvePart1())
console.log('part 2:', solvePart2())







