class InternalLogger {
    constructor(prefix) {
        this.prefix = prefix
    }

    log(message, type='normal') {
        const colors = {
            normal: '\x1b[36m'
            , warning: '\x1b[33m'
            , error: '\x1b[31m'
        }

        console.log(`\x1b[1m\x1b[35m[L2]${colors[type]}[${this.prefix}]\x1b[0m ${message}`)
    }
}

export default InternalLogger 