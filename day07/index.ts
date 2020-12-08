import fs from 'fs'
import { matchesRegex } from '../lib'


const input = fs.readFileSync(__dirname+'/input.txt', 'utf8').split('\n')

interface Bag {
  contains: {
    [key: string]: number,
  },
  contained_by: Array<string>,
}

interface BagRoot {
  [key:string]: Bag
}

const bags: BagRoot = {}

function bagInRoot(root:BagRoot, key:string) {
  return typeof bags[key] !== 'undefined'
}

function uniqifyArray(arr: Array<any>): Array<any> {
  return Array.from(new Set(arr))
}

// example string: 
// light red bags contain 1 bright white bag, 2 muted yellow bags.
function strToBagTree(descriptor: string): void {

  const content = descriptor.split('contain')
  const bag = content[0].replace(/bag(s)?/,'').trim()

  if(!bagInRoot(bags, bag)) {
    bags[bag] = {
      contains: {},
      contained_by: [],
    }
  }

  // bag contains no other bags case
  if(matchesRegex(content[1], /no other bags/)) {
    return
  }

  // contains other bags, we build out children, and then update other bags 'contained by' index
  const childrenDescriptors = content[1].split(',')
  childrenDescriptors.forEach((desc:string) => {
    const quantity = parseInt(desc)
    const childBag = desc.replace(/([0-9]|bag(s)?|\.)/g,'').trim()
    // add the bag to contains of the current bag
    bags[bag].contains = {
      ...bags[bag].contains,
      [childBag]: quantity,
    }

    //create new contained_by connections
    if(bagInRoot(bags, childBag)) {
      bags[childBag].contained_by = [
        ...bags[childBag].contained_by,
        bag,
      ]
    } else {
      bags[childBag] = {
        contains: {},
        contained_by: [bag],
      }
    }
  })
}


input.forEach((desc:string) => {
  strToBagTree(desc)
})

const target = 'shiny gold'
let containers: string[] = []

const rootContained = bags[target].contained_by
containers = [...rootContained]

function recursiveParentSearch(needle:string, haystack:string):void {
  containers = [...containers, ...bags[haystack].contained_by]

  for(let next of bags[haystack].contained_by) {
    recursiveParentSearch(needle, next)
  }
}

for(let parent of rootContained) {
  recursiveParentSearch(target, parent)
}

const uniqueParents: string[] = uniqifyArray(containers)

// console.log(bags)
console.log('first answer', uniqueParents.length)


// part 2 
// 🤷‍♂️
function containsCount(needle: string): number {
  const thisBag = bags[needle]
  return Object.entries(thisBag.contains).reduce((acc, [bagKey, count]) => {
    return acc + count + (count * containsCount(bagKey))
  }, 0)
}

const secondAnswer:number = containsCount(target)

console.log('second answer', secondAnswer)
