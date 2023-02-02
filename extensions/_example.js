export default ctx => {

    /*
        Execute any code you'd like to for when the module is loaded and initialied!
    */

    return {
        name: 'exampleModule'                                            // required: module name, used as key for modules object once loaded
        , displayName: 'Example Module'                                            
        , description: 'This is an example module to demonstrate syntax.' // optional: description for the module
        
        , commands: [                                                        
            { 
                name: 'ex_cmd'                                            // required: name for command 
                , description: 'Example command that doesnt do anything!' // optional: description for the command

                , aliases: ['excmd, exmd']                                // optional: aditional aliases for the command, extension loader will throw error if alias is shared between any commands
                , minArguments: 1                                         // optional: if not specified will be defaulted to 0
                , maxArguments: 2                                         // optional: if not specified command will accept an infinite amount of arguments
                , arguments: [                                            // optional: array that specifies the information about the arguments the command will receive
                    {
                        name: 'arg1'                                      // required: name of the argument that will be stored as a key in the arguments object in request
                        , displayName: 'Argument 1'                       // optional: name that is actually shown to the user when they use the help command
                    }                       
                ]
                , callback: request => {
                    /*
                    The request object contains info relating to the initiation of the command, such as who called it, arguments given, etc

                    {
                        message: ...             // discordjs message object that initiated the command 

                        , arguments: {           // arguments object containing data pertaining to arguments inputted, will be absent in a command that has no arguments
                            _array: []           // all arguments received stored in an array, if the command needs to process them itself
                            , arg1: value        // argument 1 stored by it's name defined in the names property of the command
                            , arg2: value        // same as above line, just for argument 2
                            , parameters: []     // any additional params received if a max arguments wasnt set
                        }
                    }
                    */

                    /* 
                    
                    Do command things here...

                    */
                }
            }
        ]
    }
}