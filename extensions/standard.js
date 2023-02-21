export default ctx => {
    return {
        name: 'standard'
        , displayName: 'Standard'
        , description: 'The standard commands for Lilac2.'

        , commands: [
            {
                name: 'help'
                , description: 'Display a list of commands, or receive help on a specific command.'

                , minArguments: 0
                , maxArguments: 1

                , arguments: [
                    { name: 'extension'}
                ]

                , callback: request => {

                }
            }
        ]

        , test() {
            console.log(ctx.extensions)
        }
    }
}