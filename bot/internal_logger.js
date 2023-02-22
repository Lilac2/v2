import { SEQUENCES, format } from './format.js'

let longestPrefixLength = 0

class InternalLogger {
    constructor(prefix) {
        this.prefix = prefix
        if (prefix.length > longestPrefixLength) longestPrefixLength = prefix.length
    }

    log(message, type='normal') {
        const colors = {
            normal: 'CYAN'
            , ok: 'GREEN'
            , warning: 'YELLOW'
            , error: 'RED'
        }

        let paddingToAdd = ''
        if (this.prefix.length < longestPrefixLength) paddingToAdd = ' '.repeat(longestPrefixLength - this.prefix.length)

        console.log(`${format(`[L2]`, 'MAGENTA', 'BRIGHT')}${format(`[${this.prefix}]`, colors[type]) + paddingToAdd} ${message}`)
    }
}

export default InternalLogger 