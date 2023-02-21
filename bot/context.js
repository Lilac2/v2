import * as path from 'path'
import { fileURLToPath } from 'url'

export default {
    rootDir: path.resolve(fileURLToPath(import.meta.url), '../../')
    , extensions: { }
}