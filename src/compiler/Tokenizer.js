import TextInputStream from "./TextInputStream";


export function tokenize(code) {
    let input = new TextInputStream(code)

    let tokens = []

    while (input.eof() === false) {
        readTill(input, isWhitespace)
        let char = input.peek()

        if (char === '-') {
            input.next()

            if (isDigit(input.peek())) {
                let peek = input.peek()
                input.next()
                tokens.push(readNumber(input, peek, true))
            }
            else {
                tokens.push('-')
                input.next()
            }
        }
        else if (isDigit(char)) {
            tokens.push(readNumber(input))
        }
        else if (char === '\'') {
            input.next()
            tokens.push(
                { type: "str", value: readTill(input, char => char !== '\'') }
            )
            input.next()
        }
        else if (char === '[') {
            tokens.push('[')
            input.next()
        }
        else if (char === ']') {
            tokens.push(']')
            input.next()
        }
        // else if (char === '>') {
        //     tokens.push('>')
        //     input.next()
        // }
        // else if (char === '<') {
        //     tokens.push('<')
        //     input.next()
        // }
        // else if (char === '+') {
        //     tokens.push('+')
        //     input.next()
        // }
        // else if (char === '/') {
        //     tokens.push('/')
        //     input.next()
        // }
        // else if (char === '*') {
        //     tokens.push('*')
        //     input.next()
        // }
        else if (char === ',') {
            tokens.push(',')
            input.next()
        }
        else if (char === '(') {
            tokens.push('(')
            input.next()
        }
        else if (char === ')') {
            tokens.push(')')
            input.next()
        }
        else if (char === '{') {
            tokens.push('{')
            input.next()
        }
        else if (char === '}') {
            tokens.push('}')
            input.next()
        }
        else if (char === ';') {
            tokens.push(';')
            input.next()
        }
        else if (char === 'o') {
            tokens.push(readStr(input, 'op'))
        }
        else if (char === 'v') {
            tokens.push(readStr(input, 'var'))
        }
        else if (char === 'i') {
            tokens.push(readStr(input, 'if'))
        }
        else if (char === 'e') {
            tokens.push(readStr(input, 'else'))
        }
        else if (char === 'r') {
            tokens.push(readStr(input, 'return'))
        }
        else if (char === 'p') {
            let val = readStr(input, 'prefix')

            if (val === 'prefix') {
                tokens.push('prefix')
            }
            else if (val.name === 'postfix') {
                tokens.push('postfix')
            }
            else
                tokens.push(val)
            //postfix
            //tokens.push(readStr(input, 'prefix'))
        }
        else if (char === 't') {
            let val = readStr(input, 'true')

            if (val === 'true')
                tokens.push({ type: 'bool', value: true })
            else {
                tokens.push(val)
            }
        }
        else if (char === 'f') {
            let val = readStr(input, 'false')

            if (val === 'false')
                tokens.push({ type: 'bool', value: false })
            else if (val.name === 'func') {
                tokens.push('func')
            }
            else {
                tokens.push(val)
            }
        }
        else if (char === '=') {
            let val = readStr(input, '==', true)

            if (val.name === '=')
                tokens.push('=')
            else
                tokens.push(val)
        }
        // else if (char === '!') {
        //     tokens.push(readStr(input, '!='))
        // }
        else if (char === 'w') {
            tokens.push(readStr(input, 'while'))
        }
        else if (char === '.') {
            let val = readStr(input, '...', true)

            if (val === '...')
                tokens.push('...')
            else if (val.name === '.')
                tokens.push('.')
            else
                tokens.push(val)
        }
        else if (char === '"') {
            input.next()
            tokens.push(
                { type: "str", value: readTill(input, char => char !== '"') }
            )
            input.next()
        }
        else if (isWhitespace()) {
            readTill(input, isWhitespace)
        }
        else if (isLetter(char)) {
            //let name = readTill(input, isOperator)
            let name = readTill(input, ch => {
                return (
                    isLetter(ch) || isDigit(ch)
                )
            })

            tokens.push({
                type: 'name',
                name
            })
        }
        else {
            let name = readTill(input, ch => {
                return (
                    ch !== ' ' &&
                    ch !== '.' &&
                    isLetter(ch) === false &&
                    isDigit(ch) === false &&
                    isOperator(ch)
                )
            })
            tokens.push({
                type: 'operator',
                name
            })
        }

        readTill(input, isWhitespace)
    }

    return tokens
}

function readStr(input, str, noForwardParsing) {
    let i = 0

    while (!input.eof() && input.peek() === str[i]) {
        input.next()
        i++
    }

    let result = str.slice(0, i)

    let name = ''

    if (noForwardParsing !== true)
        name = readTill(input, isOperator)

    result = result + name

    if (name.length > 0) {
        return {
            type: 'name',
            name: result
        }
    }

    if (i < str.length)
        return {
            type: 'name',
            name: result
        }

    return result
}

function isWhitespace(ch) {
    return ch === ' ' || ch === '\n' || ch === '\t'
}

function isOperator(char) {
    return (
        char !== ' ' &&
        char !== ':' &&
        char !== ',' &&
        char !== ';' &&
        char !== '[' &&
        char !== ']' &&
        char !== '(' &&
        char !== ')' &&
        //char !== '+' &&
        //char !== '*' &&
        char !== ']' &&
        char !== '[' &&
        char !== '.' &&
        !isWhitespace(char)
    )
}

function isLetter(ch) {
    let chCode = ch.charCodeAt(0)

    return (chCode >= 97 && chCode <= 122) || (chCode >= 65 && chCode <= 90)
}

function isDigit(char) {
    return /[0-9]/i.test(char)
}

function readTill(input, condition) {
    let str = ''

    while (!input.eof() && condition(input.peek())) {
        str += input.next()
    }

    return str
}

function readNumber(input, ch = '', isNegative = false) {
    let hasDot = false
    let negative = isNegative
    let isName = false

    let number = readTill(input, char => {
        if (char === '-') {
            if (negative)
                return false

            negative = true
            return true
        }
        else if (char === '.') {
            if (hasDot) return false
            hasDot = true
            return true
        }
        else if (isDigit(char) === true)
            return isDigit(char)
        else if (
            !isWhitespace(char) &&
            !isOperator(char) &&
            char !== '(' &&
            char !== ')' &&
            isLetter(char)
        ) {
            isName = true

            return true
        }

        return false
    })


    if (isName)
        return { type: 'name', name: ch + number}

    let num = parseFloat(ch + number)

    return { type: "num", value: negative ? num * -1 : num }
}
