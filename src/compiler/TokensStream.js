export default class TokensStream {
    constructor(tokens) {
        this._tokens = tokens
        this._position = 0
        this._line = 0
    }

    next() {
        return this._tokens[this._position++]
    }

    peek() {
        return this._tokens[this._position]
    }

    eof() {
        return this.peek() === undefined
    }

    error() {
        console.log(this.peek())
        throw new SyntaxError('Unexpected token ' + this.peek())
    }

    errorPrev() {
        console.log(this._tokens[this._position - 1])
        throw new SyntaxError('Unexpected token ' + this._tokens[this._position - 1] )
    }
}