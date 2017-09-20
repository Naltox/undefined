const PRECEDENCY = {
    '<': 10,
    '>': 10,
    '+': 20,
    '-': 20,
    '*': 40,
    '/': 40
}

let OPERATORS = {

}

let TEST = {

}

export default function parse(tokensStream) {
    let program = []

    while (tokensStream.eof() === false) {
        let ast = parseTop(tokensStream)

        program.push(ast)
    }

    return program
}

function getOperatorPrecedence(operator) {
    if (operator === undefined)
        return
    if (typeof operator === 'string')
        return PRECEDENCY[operator]
    else if (operator.type === 'name')
        return OPERATORS[operator.name]
}

function getOperator(operator) {
    if (typeof operator === 'string')
        return operator
    else if (operator.type === 'name')
        return operator.name
}

function parseExpr(tokensStream, lhs, min_precedence) {
    while (tokensStream.eof() === false) {
        let lookahead = tokensStream.peek()

        if (
            lookahead === ')' ||
            lookahead === '(' ||
            lookahead === ';' ||
            lookahead === ',' ||
            lookahead === '=' ||
            lookahead === 'var' ||
            lookahead === '}' ||
            lookahead === '{' ||
            lookahead === 'if' ||
            lookahead === ']' ||
            lookahead === '[' ||
            lookahead === 'while' ||
            lookahead === 'func' ||
            lookahead === '.' ||
            lookahead === 'return' //||
              //  lookahead.type
            //( lookahead.type && (lookahead.type !== 'name' && OPERATORS[lookahead.name] === undefined))
        )
            return lhs



        // if (lhs.name && TEST[lhs.name] !== undefined && TEST[lhs.name] === 'prefix' ) {
        //     tokensStream.next()
        //
        //     lhs = {
        //         type: 'expr',
        //         exr: {
        //             type: { type:'operator', name: getOperator(lhs) },
        //             //type: { type:'operator', name: getOperator(lookahead) },
        //             //left: lhs,
        //             right: lookahead
        //         }
        //     }
        //     continue
        // }

        if (lookahead.type) {
            if (lookahead.type === 'name') {
                if (OPERATORS[lookahead.name] === undefined) {
                    //throw new Error('Unknown operator ' + lookahead.name)
                    //throw new Error('Unknown operator ' + lookahead.name)

                    return lhs
                }
                else {
                     // lookahead = {
                    //     type: 'operator',
                    //     name: lookahead.name
                    // }

                    //lookahead = lookahead.name
                }
            }
            else {
                return lhs
            }
        }


        if (lookahead.type === undefined && getOperatorPrecedence(lookahead) < min_precedence) {
            return lhs
        }

        // if (lookahead.type === 'operator' && OPERATORS[lookahead.name] < min_precedence) {
        //     return lhs
        // }

        tokensStream.next()

        let rhs = parsePrimary(tokensStream)

        //console.log(rhs)

        let nextBin = tokensStream.peek()

        //console.log(nextBin)
        //console.log(rhs, nextBin)

        // if (PRECEDENCY[lookahead] < PRECEDENCY[nextBin]) {
        //     rhs = parseExpr(tokensStream, rhs, PRECEDENCY[lookahead] + 1)
        // }

        if (getOperatorPrecedence(lookahead) < getOperatorPrecedence(nextBin)) {
            rhs = parseExpr(tokensStream, rhs, getOperatorPrecedence(lookahead) + 1)
        }


        lhs = {
            type: 'expr',
            exr: {
                type: { type:'operator', name: getOperator(lookahead) },
                //type: { type:'operator', name: getOperator(lookahead) },
                left: lhs,
                right: rhs
            }
        }

    }

    return lhs
}

function parseInfixExpr(tokensStream) {
    let lhs = parsePrimary(tokensStream)

    return parseExpr(tokensStream, lhs, 0)
}

function parseTop(tokensStream) {
    let tok = tokensStream.peek()

    if (tok === 'var') {
        tokensStream.next()
        return parseVariable(tokensStream)
    }
    else if (tok === 'if') {
        tokensStream.next()
        return parseIf(tokensStream)
    }
    else if (tok === 'while') {
        tokensStream.next()
        return parseWhile(tokensStream)
    }
    else if (tok === 'func') {
        tokensStream.next()
        return parseFunction(tokensStream)
    }
    else if (tok === 'return') {
        tokensStream.next()
        let ast = parseInfixExpr(tokensStream)

        return {type: 'return', expr: ast}
    }
    else if (tok === 'op') {
        return parseOperatorDeclaration(tokensStream)
    }
    else
        return parseInfixExpr(tokensStream)
}

function parseOperatorDeclaration(tokensStream) {
    let type = 'infix'

    if (tokensStream.next() !== 'op')
        throw 'op expected'

    let name = tokensStream.next()

    if (name === 'prefix') {
        type = 'prefix'

        name = tokensStream.next()
    }

    if (name.type !== 'str')
        throw 'operator name expected'

    let precedence = tokensStream.next()

    if (precedence.type !== 'num')
        throw 'Expected operator precedence'

    if (tokensStream.next() !== '(')
        throw 'Expected ('

    let args = []

    while (tokensStream.peek() !== ')' && tokensStream.eof() === false) {

        let ast = parseInfixExpr(tokensStream)

        args.push(ast)

        if (tokensStream.peek() === ')') {
            continue
        }

        if (
            tokensStream.peek() !== ',' &&
            tokensStream.peek() !== ')'
        ) {
            throw 'expected ,'
        }

        tokensStream.next()
    }

    tokensStream.next()

    if (tokensStream.next() !== '{')
        throw 'Expected {'

    let body = []

    while (tokensStream.peek() !== '}' && tokensStream.eof() === false) {
        // if (tokensStream.peek() === 'return') {
        //     tokensStream.next()
        //     let ast = parseInfixExpr()
        //
        //     returnExpr = ast
        //
        //     continue
        // }

        let ast = parseTop(tokensStream)

        body.push(ast)
    }

    if (tokensStream.next() !== '}')
        throw 'Expected }'

    OPERATORS[name.value] = precedence.value
    TEST[name.value] = type

    return {
        type: 'operator',
        args,
        name: name.value,
        body
    }

}

// func $func_name$ ($var$, ...) { ... }
function parseFunction(tokensStream) {
    let name = tokensStream.next()

    if (tokensStream.peek() === '.')
        return parseFunctionPrototype(tokensStream, name)

    if (tokensStream.next() !== '(')
        throw 'Expected ('

    let returnExpr = null
    let args = []

    while (tokensStream.peek() !== ')' && tokensStream.eof() === false) {
        let ast = parseInfixExpr(tokensStream)

        args.push(ast)

        if (tokensStream.peek() === ')') {
            continue
        }

        if (
            tokensStream.peek() !== ',' &&
            tokensStream.peek() !== ')'
        ) {
            throw 'expected ,'
        }

        tokensStream.next()
    }

    tokensStream.next()

    if (tokensStream.next() !== '{')
        throw 'Expected {'

    let body = []

    while (tokensStream.peek() !== '}' && tokensStream.eof() === false) {
        let ast = parseTop(tokensStream)

        body.push(ast)
    }

    if (tokensStream.next() !== '}')
        throw 'Expected }'

    return {
        type: 'func',
        arguments: args,
        name: name.name,
        body,
        returnExpr
        //expr
    }
}

function parseFunctionPrototype(tokensStream, namespace) {
    tokensStream.next()

    let name = tokensStream.next()

    if (name.type !== 'name')
        throw 'expected name'

    if (tokensStream.next() !== '(')
        throw 'Expected ('

    let args = []

    while (tokensStream.peek() !== ')' && tokensStream.eof() === false) {
        if (tokensStream.peek() === '...') {
            args.push('...')
            tokensStream.next()
            continue
        }
        let ast = parseInfixExpr(tokensStream)

        args.push(ast)

        if (tokensStream.peek() === ')') {
            continue
        }

        if (
            tokensStream.peek() !== ',' &&
            tokensStream.peek() !== ')'
        ) {
            throw 'expected ,'
        }

        tokensStream.next()
    }

    tokensStream.next()

    return {
        type: 'func_prototype',
        arguments: args,
        namespace: namespace.name,
        name: name.name
    }
}

// while ($expr$) { ... }
function parseWhile(tokensStream) {
    if (tokensStream.next() !== '(')
        throw 'Expected ('

    let expr = parseInfixExpr(tokensStream)

    if (tokensStream.next() !== ')')
        throw 'Expected )'

    let body = parseCodeBlock(tokensStream)



    return {
        type: 'while',
        body,
        expr
    }
}

function parsePrimary(tokensStream) {
    let tok = tokensStream.next()
    let peek = tokensStream.peek()

    if (!tok)
        tokensStream.error()

    if (tok === '(')
        return parseBlock(tokensStream)
    if (tok === '[')
        return parseArray(tokensStream)
    else if (tok.type && tok.type === 'name' && peek === '(') {
        if (tokensStream.peek() === '(')
            return parseFunctionCall(tokensStream, tok)
    }
    else if (tok.type && tok.type === 'name' && peek === '[') {
        if (tokensStream.peek() === '[')
            return parseArrayAccess(tokensStream, tok)
    }
    else if (tok.type && tok.type === 'name' && peek === '=') {
        return parseVariableEq(tokensStream, tok)
    }
    else  if (tok.type && tok.type === 'num' || tok.type === 'name' || tok.type === 'str' || tok.type === 'bool') {
        return tok
    }
    // else if (tok.type && tok.type === 'num' || tok.type === 'name' || tok.type === 'str' || tok.type === 'bool') {
    //     return parseExpr(tokensStream, tok, 0)
    // }
    // else  if (tok === 'var') {
    //    return parseVariable()
    // }
    else
        tokensStream.errorPrev()
}

// %arr%[%expr%]...
function parseArrayAccess(tokensStream, variable) {
    return {
        type: 'array_accessor',
        variable,
        expr: parseArrayAcc(tokensStream)
    }
}

// %arr%[%expr%]...
function parseArrayAcc(tokensStream) {
    let exprs =  []

    if (tokensStream.next() !== '[')
        throw 'asd'


    let expr = parseInfixExpr(tokensStream)
    exprs.push(expr)

    if (tokensStream.next() !== ']')
        throw 'expected ]'

    if (tokensStream.peek() === '[') {
        exprs.push(...parseArrayAcc(tokensStream))

        //console.log(123)
        //console.log(parseArrayAcc())
    }


    return exprs
}

// %var_name% = %expr%
function parseVariableEq(tokensStream, variable) {
    if (tokensStream.next() !== '=')
        throw 'expected ='

    let expr = parseInfixExpr(tokensStream)

    return {
        type: 'equality',
        variable,
        expr
    }
}

// %func_name%(%arg%, ...)
function parseFunctionCall(tokensStream, funcName) {
    tokensStream.next()

    let args = []

    while (tokensStream.eof() === false) {
        if (tokensStream.peek() === ')') {
            tokensStream.next()

            return {
                type: 'call',
                func: funcName,
                args: args
            }
        }

        args.push(parseInfixExpr(tokensStream))



        if (tokensStream.peek() !== ')' && tokensStream.peek() !== ',') {
            throw new Error(', expected')
        }
        else if (tokensStream.peek() === ',')
            tokensStream.next()
        // if (tokensStream.next() !== ',' && tokensStream.peek() !== ')')
        //     throw new Error(', expected')
    }
}

// (%expr)
function parseBlock(tokensStream) {
    var data = parseInfixExpr(tokensStream)

    let tok = tokensStream.next()

    if (tok !== ')')
        throw SyntaxError('expexted )')

    return { type: 'block', value: data }
}

// [%expr%, ...]
function parseArray(tokensStream) {
    let values = []

    while (tokensStream.peek() !== ']' && tokensStream.eof() === false) {
        let ast = parseInfixExpr(tokensStream)

        values.push(ast)

        if (tokensStream.peek() === ']') {
            tokensStream.next()

            return {
                type: 'array',
                values
            }
        }

        if (
            tokensStream.peek() !== ','
        ) {
            throw 'expected ,'
        }

        tokensStream.next()
    }

    tokensStream.next()

    return {
        type: 'array',
        values: []
    }
}

// var %name% = %expr%
function parseVariable(tokensStream) {
    let name = tokensStream.next()

    if (name.type !== 'name')
        tokensStream.errorPrev()

    if (tokensStream.next() !== '=')
        tokensStream.errorPrev()

    let value = parseInfixExpr(tokensStream)

    // if (tokensStream.next() !== ';')
    //     tokensStream.errorPrev()

    return {
        type: 'var',
        name: name.name,
        value
    }
}

// { %expr% }
function parseCodeBlock(tokensStream) {
    if (tokensStream.next() !== '{')
        throw 'Expected {'

    let body = []

    while (tokensStream.peek() !== '}' && tokensStream.eof() === false) {
        let ast = parseTop(tokensStream)

        body.push(ast)
    }

    if (tokensStream.next() !== '}')
        throw 'Expected }'

    return body
}

function parseIf(tokensStream) {
    if (tokensStream.next() !== '(')
        throw 'Expected ('

    let expr = parseInfixExpr(tokensStream)

    if (tokensStream.next() !== ')')
        throw 'Expected )'

    let body = parseCodeBlock(tokensStream)
    let elseBlock = null

    if (tokensStream.peek() === 'else') {
        tokensStream.next()
        elseBlock = parseCodeBlock(tokensStream)
    }

    return {
        type: 'if',
        body,
        elseBlock,
        expr
    }
}
