import fs from 'fs'

interface PasswordPolicy {
  start: number,
  end: number, 
  substring: string,
  password: string
}

interface Range {
  start: number, 
  end: number,
}

const contents = fs.readFileSync(__dirname+'/passwords.txt', 'utf8')
const passwords: string[] = contents.split('\n')
const policyList: PasswordPolicy[] = passwords.map(buildPolicy)

function inRange(num: number, range: Range): boolean {
  return (num - range.start) * (num - range.end) <= 0
}

function countSubstring(string: string, subString: string): number {
  if (!string || !subString) return 0
  const pattern: RegExp = new RegExp(subString, 'g')
  const matches: RegExpMatchArray | null = string.match(pattern)
  return matches ? matches.length : 0
}

// example string 5-6 x: xxxxxmxf
function buildPolicy(row: string): PasswordPolicy {
  // extract password
  const passwordSplit: string[] = row.split(':')
  if(passwordSplit.length !== 2) throw new Error('invalid policy type')
  const prefix: string = passwordSplit[0]
  const password: string = passwordSplit[1].trim()

  //extract substring
  const substringSplit: string[] = prefix.split(' ')
  if(substringSplit.length !== 2) throw new Error('invalid policy type')
  const range: string = substringSplit[0]
  const substring: string = substringSplit[1]

  //convert range to numbers
  const rangeSplit: string[] = range.split('-')
  if(rangeSplit.length !== 2) throw new Error('invalid policy type')
  const start: number = parseInt(rangeSplit[0])
  const end: number = parseInt(rangeSplit[1])

  return {
    start, 
    end, 
    substring,
    password
  }
}

//instances of substring must be between 'start' and 'end'
function isValidPolicyByLength(policy: PasswordPolicy): boolean {
  const instances: number = countSubstring(policy.password, policy.substring)
  return inRange(instances, policy)
}

// substring must appear at exactly one of the start and end positions. 
// start and end are not zero-indexed, so start=1 is first chatacter.
function isValidPolicyByExclusivePosition(policy: PasswordPolicy): boolean {

  const atStart: boolean = policy.password.charAt(policy.start - 1) === policy.substring
  const atEnd: boolean = policy.password.charAt(policy.end - 1) === policy.substring
  return (atStart || atEnd) && !(atStart && atEnd)
}

function countValidPasswords(passwords:PasswordPolicy[], validationRule: (p: PasswordPolicy) => boolean) : number {
  return passwords.reduce((acc: number, policy: PasswordPolicy): number => {
    if(validationRule(policy)) {
      return acc + 1
    }
    return acc
  }, 0)
}

const firstAnswer: number = countValidPasswords(policyList, isValidPolicyByLength)
const secondAnswer: number = countValidPasswords(policyList, isValidPolicyByExclusivePosition)

console.log('part 1:', firstAnswer)
console.log('part 2:', secondAnswer)
