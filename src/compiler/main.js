import {tokenize} from "./Tokenizer";
import TokensStream from "./TokensStream";
import parse from './Parser'
import compile from './Compiler'
import SourceCode from "./SourceCode";
import {readFileSync} from "fs";


let code = readFileSync('../src/compiler/main.un', 'utf-8')
// let code = `
// func std.array_push(lhs, dff)
//
//
//
// `
//
// let code = `
// func std.plus(lhs, rhs)
// func std.minus(lhs, rhs)
// func std.and(lhs, rhs)
// func std.or(lhs, rhs)
// func std.mul(lhs, rhs)
// func std.dev(lhs, rhs)
// func std.less(lhs, rhs)
// func std.greater(lhs, rhs)
// func std.eq2(lhs, rhs)
// func std.notEq2(rhs)
// func std.not(rhs)
// func std.incr(lhs)
// func std.decr(lhs)
// func std.negative(lhs)
//
// op '+' 20 (lhs, rhs) {
//     return plus(lhs, rhs)
// }
//
// op '-' 20 (lhs, rhs) {
//     return minus(lhs, rhs)
// }
//
// op '&&' 20 (lhs, rhs) {
//     return and(lhs, rhs)
// }
//
// op '||' 20 (lhs, rhs) {
//     return or(lhs, rhs)
// }
//
// op '*' 40 (lhs, rhs) {
//     return mul(lhs, rhs)
// }
//
// op '/' 40 (lhs, rhs) {
//     return dev(lhs, rhs)
// }
//
// op '<' 10 (lhs, rhs) {
//     return less(lhs, rhs)
// }
//
// op '>' 10 (lhs, rhs) {
//     return greater(lhs, rhs)
// }
//
// op '^' 40 (lhs, rhs) {
//     var i = 0
//
//     while (i < rhs - 1) {
//         lhs = lhs * lhs
//         i = i + 1
//     }
//
//     return lhs
// }
//
// op '==' 10 (lhs, rhs) {
//     return eq2(lhs, rhs)
// }
//
// op '!=' 10 (lhs, rhs) {
//     return notEq2(lhs, rhs)
// }
//
// op prefix '!' 10 (rhs) {
//     return not(rhs)
// }
//
// op postfix '++' 10 (lhs) {
//     return incr(lhs)
// }
//
// op postfix '--' 10 (lhs) {
//     return decr(lhs)
// }
//
// op prefix '-' 20 (rhs) {
//     return negative(rhs)
// }
//
// func std.print(...)
//
// func std.array_push(arr, value)
//
//
// var loh = "loh"
// var pidor = "pidor"
// var loh_pidor = loh+" "+pidor
//
// print(loh_pidor)
//
// `


let tokens = tokenize(code)
//dev(plus(dev(1, 2), 1), varFromInt(2))
tokens.map(t => {
    console.log(t)
})


let tokensStream = new TokensStream(tokens)


let ast = parse(tokensStream)



//console.dir(ast, {depth: null})


console.log(compile(ast).functions.render())

console.log('\n\n')
let main = new SourceCode()

main.add('int main() {')
main.append(compile(ast).code, 1)
main.add('}')

console.log(main.render())


