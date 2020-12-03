import fs from 'fs'

const contents = fs.readFileSync(__dirname+'/map.txt', 'utf8')

const answerGrid: string[][] = contents.split('\n').map(row => row.split(''))

const partTwoMoves = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
]


function countTreeCollisions(grid: string[][], rightMove: number, downMove: number): number {
  let row = downMove
  let column = rightMove
  let treesHit = 0
  const rowLength = grid[0].length


  while(row < grid.length) {
    if(grid[row][column] === '#') {
      treesHit += 1
    }
    row = row + downMove
    column = (column + rightMove) % (rowLength)
  }
  return treesHit
}

function solvePartTwo(grid: string[][], moveset: number[][]): number {
  return moveset.reduce((acc: number, move: number[]): number => {
    return acc * countTreeCollisions(grid, move[0], move[1])
  }, 1)
}

console.log('firstAnswer', countTreeCollisions(answerGrid, 3, 1)) //expect 280
console.log('secondAnswer', solvePartTwo(answerGrid, partTwoMoves))