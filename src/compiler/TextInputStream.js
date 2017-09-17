export default class TextInputStream {
    constructor(text) {
        this._text = text
        this._position = 0
        this._line = 0
    }

    next() {
        let char = this._text[this._position++]

        if (char === '\n')
            this._line++

        return char
    }

    peek() {
        return this._text[this._position]
    }

    eof() {
        return this.peek() === undefined
    }

    error() {
        console.log(this.peek())
        throw new SyntaxError('Unexpected token ' + this.peek() + ' in code at position ' + this._position)
    }

    errorPrev() {
        console.log(this._text[this._position - 1])
        throw new SyntaxError('Unexpected token ' + this._text[this._position - 1] + ' in code at position ' + (this._position - 1))
    }
}