import fs from 'fs'
import { inRange, matchesRegex } from '../lib'
import { Range } from '../lib/types'

type Rule = [string, (f:string) => boolean]

interface Rules {
  [key:string]: (f:string) => boolean,
}

interface Passport {
  [key: string] : string
}

const contents = fs.readFileSync(__dirname+'/passports.txt', 'utf8')

const data = contents.split('\n\n').map(data => {
  return data.split(/\s+/).reduce((acc: object, kvPair: string): object => {
    const [key, value] = kvPair.split(':')
    return {
      ...acc,
      [key]: value,
    }
  }, {})
})

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt','hcl','ecl','pid']
/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
*/
const strictRules = {
  byr: (field:string) => inRange(parseInt(field), { start: 1920, end: 2020 }),
  iyr: (field:string) => inRange(parseInt(field), { start: 2010, end: 2020 }),
  eyr: (field:string) => inRange(parseInt(field), { start: 2020, end: 2030 }),
  hgt: (field:string) => {
    const validFormat = matchesRegex(field, /[0-9]+(in|cm)$/)
    if(!validFormat) return false
    const num = parseInt(field)
    const range: Range = matchesRegex(field, /in$/) ? { start: 59, end: 76 } : { start: 150, end: 193}
    return inRange(num, range)
  },
  hcl: (field:string) => matchesRegex(field, /^#[0-9a-f]{6}$/i),
  ecl: (field:string) => ['amb','blu','brn','gry', 'grn', 'hzl','oth'].includes(field),
  pid: (field:string) => matchesRegex(field, /^[0-9]{9}$/)
}

function isValidPassport(passport:Passport, required: string[]): boolean {
  const fields = Object.keys(passport)
  return required.reduce((isValid:boolean, field:string):boolean => isValid && fields.includes(field), true)
}

function isStrictlyValidPassport(passport:Passport, rules: Rules): boolean {
  return Object.entries(rules).reduce((isValid:boolean, [ruleField, rule]: Rule): boolean => {
    return isValid && !!passport[ruleField] && rule(passport[ruleField])
  }, true)
}

function countValidPassports(passports: Passport[], required:string[]): number {
  return passports.reduce((validCount:number, passport: Passport): number => isValidPassport(passport, required) ? validCount + 1 : validCount, 0)
}

function countStrictlyValidPassports(passports: Passport[], required:string[], rules: Rules): number {
  return passports.reduce((validCount: number, passport:Passport): number => {
    if(isStrictlyValidPassport(passport, rules)) {
      return validCount + 1
    }
    return validCount
  }, 0)
}

const firstAnswer = countValidPassports(data, requiredFields)
const secondAnswer = countStrictlyValidPassports(data, requiredFields, strictRules)

console.log('firstAnswer', firstAnswer)
console.log('secondAnswer', secondAnswer)