const fs = require('fs')

const contents = fs.readFileSync(__dirname+'/passwords.txt', 'utf8')

// process the file, extract the variables: min, max, key, password
// for each password, build a regex, count instances, see if its in range

function inRange(num: number, start: number, end: number): boolean {
  return (num - start) * (num - end) <= 0
}

function countSubstring(string: string, subString:string): number {

  const pattern = new RegExp(character, 'g')
  return 0
}
