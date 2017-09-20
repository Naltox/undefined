import SourceCode from "./SourceCode";

const OPERATOR_ALIASES = {
    '+': 'plus',
    '-': 'minus',
    '~': 'tilda',
    '&&': 'and',
    '/': 'dev',
    '*': 'mul',
    '^': 'pow',
    '<': 'less',
    '>': 'greater',
    '==': 'eq2',
    '!=': 'notEq2',
    '!': 'not'
}

const FUNCTIONS = {

}

export default function compile(ast, tab = 0) {
    // let functions = genTab(tab)
    //
    // //let code = ''
    // let code = genTab(tab)


    let functions = new SourceCode()
    let code = new SourceCode()

    for (let tree of ast) {
        if (tree.type === 'var') {
            code.add(compileExpr(tree), tab)
        }
        if (tree.type === 'equality') {
            code.add(compileExpr(tree), tab)
        }
        if (tree.type === 'expr') {
            code.add(compileExpr(tree.exr) + ';', tab)
        }
        if (tree.type === 'call') {
            code.add(compileExpr(tree) + ';', tab)
        }
        if (tree.type === 'if') {
            code.append(compileExpr(tree), tab)
        }
        if (tree.type === 'while') {
            code.append(compileExpr(tree), tab)
        }
        if (tree.type === 'array') {
            code.add(compileExpr(tree), tab)
        }
        if (tree.type === 'return') {
            code.add(compileExpr(tree), tab)
        }
        if (tree.type === 'array_accessor') {
            code.add(compileExpr(tree), tab)
        }
        if (tree.type === 'func') {
            FUNCTIONS[tree.name] = tree
            functions.append(compileFunction(tree, tab), tab)
        }
        if (tree.type === 'func_prototype') {
            FUNCTIONS[tree.name] = tree
        }
        if (tree.type === 'operator') {
            functions.append(compileOperator(tree, tab), tab)
        }
    }


    return {
        functions,
        code
    }
}

function compileOperator(ast, tab) {
    let code = new SourceCode()

    code.add(`static inline var op_${OPERATOR_ALIASES[ast.name]}(${ast.args.map(a => 'var ' + compileExpr(a)).join(', ')}) {`)
    code.append(compile(ast.body, tab + 1).code)


    let ret = ast.body.find(e => e.type === 'return')

    if (!ret) {
        code.add('return NaN();', 1)
    }

    code.add(`}`)

    return code
}

function compileFunction(ast, tab) {
    let code = new SourceCode()

    code.add(`var user_${ast.name}(${ast.arguments.map(a => 'var ' + compileExpr(a)).join(', ')}) {`)
    code.append(compile(ast.body, tab + 1).code)


    let ret = ast.body.find(e => e.type === 'return')

    if (!ret) {
        code.add('return NaN();', 1)
    }

    code.add(`}`)

    return code
}

function compileExpr(expression) {
    if (typeof expression === 'number')
        return '' + expression

    if (expression.type) {
        if (expression.type === 'var') {
            return `var ${expression.name} = ${compileExpr(expression.value)};`
        }
        if (expression.type === 'equality') {
            return `${expression.variable.name} = ${compileExpr(expression.expr)};`
        }
        if (expression.type === 'if') {
            let code = new SourceCode()

            code.add(`if (isTrue(${compileExpr(expression.expr)})) {`)
            code.append(compile(expression.body).code, 1)
            code.add('}')

            if (expression.elseBlock) {
                code.add('else {')
                code.append(compile(expression.elseBlock).code, 1)
                code.add('}')
            }

            return code
        }
        if (expression.type === 'while') {
            let code = new SourceCode()

            code.add(`while (isTrue(${compileExpr(expression.expr)})) {`)
            code.append(compile(expression.body).code, 1)
            code.add('}')

            return code
            //return `while (isTrue(${compileExpr(expression.expr)})) {\n${compile(expression.body).code}\n}`
        }
        if (expression.type === 'array') {
            return `var_array_create_inline(${expression.values.length}${expression.values.length > 0 ? ', ' : ''}${expression.values.map(v => `${compileExpr(v)}`).join(', ')})`
        }
        if (expression.type === 'call') {
            return compileFuncCall(expression)
        }
        if (expression.type === 'num') {
            return `varFromInt(${expression.value})`
        }
        if (expression.type === 'str') {
            return `varFromString("${expression.value}")`
        }
        if (expression.type === 'bool') {
            if (expression.value === true)
                return 'varFromBool(true)'
            else
                return 'varFromBool(false)'
        }
        if (expression.type === 'array_accessor') {
            return `var_array_get_recursive(&${compileExpr(expression.variable)}, ${expression.expr.length}, ${expression.expr.map(e => compileExpr(e)).join(', ')})`
        }
        if (expression.type === 'name')
            return "" + expression.name
        if (expression.type === 'expr')
            return compileExpr(expression.exr)
        if (expression.type === '+') {
            return `plus(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '-') {
            return `minus(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '*') {
            return `mul(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '/') {
            return `dev(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '>') {
            return `greater(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '<') {
            return `less(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '==') {
            return `eq2(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === '!=') {
            return `notEq2(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }

        if (expression.type === 'block') {
            return `(${compileExpr(expression.value)})`
        }
        if (expression.type === 'return') {
            return `return ${compileExpr(expression.expr)};`
        }
        if (expression.type.type && expression.type.type === 'operator') {
            if (expression.right && !expression.left) {
                return `op_${OPERATOR_ALIASES[expression.type.name]}(${compileExpr(expression.right)})`
            }

            return `op_${OPERATOR_ALIASES[expression.type.name]}(${compileExpr(expression.left)}, ${compileExpr(expression.right)})`
        }
    }
}

function compileFuncCall(call) {

    if (!FUNCTIONS[call.func.name])
        throw 'Unknown function ' + call.func.name
    // if (call.func.name === 'print') {
    //     return `var_print(${call.args.length}, ${call.args.map(a => `${compileExpr(a)}`).join(', ')})`
    // }
    //
    // if (call.func.name === 'array_push') {
    //     return `var_array_push(&${compileExpr(call.args[0])}, ${compileExpr(call.args[1])})`
    // }
    //
    // if (call.func.name === 'readLine') {
    //     if (call.args > 0)
    //         throw 'errrrrrrr'
    //
    //
    //     return `readLine()`
    // }

    let func = FUNCTIONS[call.func.name]

    if (func.type === 'func')
        return `user_${call.func.name}(${call.args.map(a => `${compileExpr(a)}`).join(', ')})`
    else if (func.type === 'func_prototype') {
        if (func.arguments.length === 1 && func.arguments[0] === '...') {
            return `${func.namespace}_${call.func.name}(${call.args.length}, ${call.args.map(a => `${compileExpr(a)}`).join(', ')})`
        }

        return `${func.namespace}_${call.func.name}(${call.args.map(a => `${compileExpr(a)}`).join(', ')})`
    }

}
