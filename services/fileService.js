const fs = require('fs')
const File = require('../models/File')
const config = require('config')

class FileService {
    createDir(file){
        const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`
        console.log(filePath)
        return new Promise(((resolve, reject) => {
            try{
                if (!fs.existsSync(filePath)){
                    fs.mkdirSync(filePath, { recursive: true })
                    return resolve({message: `File was created`})
                } else{
                    return reject({message: `File already exist`})
                }
            }catch(err) {
                console.log(err)
                return reject({message: 'File error'})
            }
        }))
    }
}

module.exports = new FileService()
