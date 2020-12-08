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

function replaceAt(arr: Array<any>, replaceAt: number, replacement: any): Array<any> {
  return [
    ...arr.slice(0, replaceAt),
    replacement,
    ...arr.slice(replaceAt + 1),
  ]
}

function runProgram(program:Program, state:State = {value: 0, position: 0 } ): [number, boolean] {
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
      return [state.value, false]
  }

  // at the end of the program
  if(state.position >= program.length) {
    return [state.value, true]
  }

  return runProgram(replaceAt(program, startingPosition, { command: 'end', value: 0 }), state)
}

const firstAnswer = runProgram(input)
console.log('first answer', firstAnswer[0])

// part 2
// create an iteration with one nop switched to a jmp or vice versa
const programIterations: Array<Program> = input.reduce((acc:Array<Program>, instruction:Instruction, i:number, src:Program) => {
  switch(instruction.command) {
    case 'nop':
      return [
        ...acc, 
        replaceAt(src, i, { command: 'jmp', value: instruction.value })
      ]
    case 'jmp':
      return [
        ...acc, 
        replaceAt(src, i, { command: 'nop', value: instruction.value })
      ]  
    default: 
      return acc
  }
}, [])


for(const iteration of programIterations) {
  const [answer, finished] = runProgram(iteration)
  if(finished) {
    console.log('secondAnswer', answer)
    break
  }
}