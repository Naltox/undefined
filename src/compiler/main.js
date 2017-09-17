import {tokenize} from "./Tokenizer";
import TokensStream from "./TokensStream";
import parse from './Parser'
import compile from './Compiler'

let code = `

var i = 0

var arr = []

while (i < 100) {
    array_push(arr, [i])
    i = i+1
}

print(arr)


`

let tokens = tokenize(code)

console.log(tokens)


let tokensStream = new TokensStream(tokens)


let ast = parse(tokensStream)



console.dir(ast, {depth: null})


console.log(compile(ast).functions.render())
console.log(compile(ast).code.render())


