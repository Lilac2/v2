import { dir } from 'console'
import * as fs from 'fs'
import * as path from 'path'
import { pathToFileURL, fileURLToPath } from 'url'
import InternalLogger from './internal_logger.js'
import format from './format.js'

const resolvePath = filePath => {
    if (path.isAbsolute(filePath)) {
        return filePath
    } else {
        return path.resolve(
            path.dirname(
                fileURLToPath(import.meta.url)
            )
            , filePath
        )
    }
}

class extensionLoader {
    constructor(ctx) {
        this.ctx = ctx
        this.logger = new InternalLogger('LOADER')
    }
    
    /* loads a single extension into the ctx object based off path */
    async load(extensionPath, _outOf) {
        extensionPath = resolvePath(extensionPath)

        if (fs.existsSync(extensionPath)) {
            await import(pathToFileURL(extensionPath))
                .then(module => {
                    const extension = module.default(this.ctx)

                    if (this.ctx.extensions[extension.name]) throw new Error(`Already has extension named "${extension.name}" loaded.`)

                    const checkPropertiesTypes = (toCheck, propertiesObject) => {
                        for (let property in propertiesObject) {
                            if (toCheck[property] && typeof toCheck[property] !== propertiesObject[property]) {
                                throw new Error(`Expected type "${propertiesObject[property]}" for property "${property}", got type "${typeof toCheck[property]}" instead.`)  
                            }
                        }
                    }

                    const checkPropertiesPresent = (toCheck, propertiesObject) => {
                        for (let property in propertiesObject) {
                            if (!toCheck[property]) {
                                throw new Error(`Could not find "${property}" property.`)
                            }
                        }
                    }

                    /* types expected for required and optional properties */
                    const requiredPropertiesTypes = {
                        name: 'string'
                    }

                    const optionalPropertiesTypes = {
                        displayName: 'string'
                        , description: 'string'
                        , commands: 'object'
                    }

                    checkPropertiesPresent(extension, requiredPropertiesTypes) // check if required properties are present 
                    checkPropertiesTypes(extension, requiredPropertiesTypes)   // check if required properties types are correct
                    checkPropertiesTypes(extension, optionalPropertiesTypes)   // check if optional properties types are correct

                    /* types expected for required and optional properties of commmand object */
                    const requiredCommandPropertiesTypes = {
                        name: 'string'
                    }

                    const optionalCommandPropertiesTypes = {
                        description: 'string'
                        , aliases: 'array'
                        , minArguments: 'number'
                        , maxArguments: 'number'
                        , arguments: 'object'
                        , callback: 'function'
                        , cooldown: 'number'
                    }
                    
                    extension.commands.forEach(command => {
                        checkPropertiesPresent(command, requiredCommandPropertiesTypes) // check if required properties are present
                        checkPropertiesTypes(command, requiredCommandPropertiesTypes)   // check if required properties types are correct
                        checkPropertiesTypes(command, optionalCommandPropertiesTypes)   // check if optional properties types are correct
                    })

                    /* set optional values to their default values here */
                    if (!extension.displayName) extension.displayName = extension.name

                    extension._locationPath = extensionPath
                    this.ctx.extensions[extension.name] = extension

                    this.logger.log(`${_outOf ? _outOf + ' ' : ''} Loaded "${extension.name}" extension from ${path.basename(extensionPath)}.`, 'ok')
                })
                .catch(error => {
                    // TODO - handle error
                    this.logger.log(`${error}\n\tExtension location: ${format(extensionPath, 'UNDERSCORE')}`, 'error')
                    throw error
                })
        } else {
            // TODO - handle error
            const error = new Error(`Could not find extension from path given: ${format(extensionPath, 'UNDERSCORE')}`)
            this.logger.log(error, 'error')
            throw error
        }
    }

    /* loads a dir of extensions into the ctx object based off path */
    async loadDir(dirPath) {
        dirPath = resolvePath(dirPath)

        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath)
                .filter(fileName => !fileName.startsWith('_'))

            this.logger.log(`Loading (${files.length}) extensions from directory: ${format(dirPath, 'UNDERSCORE')}`)

            for (let indexString in files) {
                const index = Number(indexString)
                const file = files[index]

                if (!file.startsWith('_')) await this.load(path.resolve(dirPath, file), `(${index + 1}/${files.length})`)
            }

            this.logger.log(`All ${files.length} extensions loaded from directory: ${format(dirPath, 'UNDERSCORE')}`, 'ok')
        } else {
            // TODO - handle error
            const error = new Error(`Could not find extension directory from path given: ${format(dirPath, 'UNDERSCORE')}`)
            this.logger.log(error, 'error')
            throw error
        }
    }
    
    unload(extensionName) {
        if (this.ctx.extensions[extensionName]) {
            delete this.ctx.extensions[extensionName]
            this.logger.log(`${extensionName} extension unloaded.`, 'ok')
        } else {
            // TODO - handle error
            const error = new Error(`Could not find extension named "${extensionName}".`)
            this.logger.log(error, 'error')
            throw error
        }
    }
    /* Reloads an extension into the ctx object, replacing the old extension path */
    async reload(extensionName) {
        if (this.ctx.extensions[extensionName]) {
            this.logger.log(`reloading "${extensionName}" extension`)
            const extensionPath = this.ctx.extensions[extensionName]._locationPath
            this.unload(extensionName)
            await this.load(extensionPath)
        } else {
            // TODO - handle error
            const error = new Error(`Could not find extension named "${extensionName}".`)
            this.logger.log(error, 'error')
            throw error
        }
    }
}

export default extensionLoader 