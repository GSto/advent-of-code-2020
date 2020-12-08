import fs from 'fs'

interface Instruction {
  command: string,
  value: number,
}

interface State {
  value: number,
  position: number,
}

const input: Program = fs.readFileSync(__dirname+'/input.txt', 'utf8')
  .split('\n')
  .map((str) => {
    const spt = str.split(' ')
    return {
      command: spt[0],
      value: parseInt(spt[1])
    }
  })

type Program = Array<Instruction>

function runProgram(program:Program, state:State = {value: 0, position: 0 } ): number {
  const instruction = program[state.position]
  const startingPosition = state.position
  switch(instruction.command) {
    case 'nop': 
      state.position += 1
      break
    case 'acc': 
      state.value += instruction.value
      state.position += 1
      break
    case 'jmp':
      state.position += instruction.value
      break
    case 'end':
      return state.value
  }
  // at the end of the program
  if(state.position >= program.length) {
    return state.value
  }
  return runProgram([
    ...program.slice(0, startingPosition),
    { command: 'end', value: 0 },
    ...program.slice(startingPosition + 1),
  ], state)
}

const firstAnswer = runProgram(input)
console.log(firstAnswer)
