import {tokenize} from "./Tokenizer";
import TokensStream from "./TokensStream";
import parse from './Parser'
import compile from './Compiler'
import SourceCode from "./SourceCode";


let code = `
op prefix '!' 10 (lhs, rhs) {
    return 1
}

op '+' 20 (lhs, rhs) {
    return 1
}

 !1 + !1

`

// let code = `
//
// func std.plus(lhs, rhs)
// func std.minus(lhs, rhs)
// func std.and(lhs, rhs)
// func std.mul(lhs, rhs)
// func std.dev(lhs, rhs)
// func std.less(lhs, rhs)
// func std.greater(lhs, rhs)
// func std.eq2(lhs, rhs)
// func std.notEq2(lhs, rhs)
//
// op '+' 20 (lhs, rhs) {
//     return plus(lhs, rhs)
// }

// op '-' 20 (lhs, rhs) {
//     return minus(lhs, rhs)
// }
//
// op '&&' 20 (lhs, rhs) {
//     return and(lhs, rhs)
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
//
// op prefix '!' 10 (lhs, rhs) {
//     return notEq2(lhs, rhs)
// }
//
// func std.print(...)
//
// !1
//
//
// `


let tokens = tokenize(code)
//dev(plus(dev(1, 2), 1), varFromInt(2))
//console.log(tokens)


let tokensStream = new TokensStream(tokens)


let ast = parse(tokensStream)



console.dir(ast, {depth: null})


console.log(compile(ast).functions.render())

console.log('\n\n')
let main = new SourceCode()

main.add('int main() {')
main.append(compile(ast).code, 1)
main.add('}')

console.log(main.render())


