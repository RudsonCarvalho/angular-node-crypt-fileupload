const FileSystem = require("fs");
const CryptoJS = require("crypto-js");

const TEXT_SUCCESS = 'Encrypted!';
const BASE64 = 'base64';
const IV = '3De0DgMFCDFGNokdFOial';

class Security {

    constructor(filePath, password) {
        this.filePath = filePath;
        this.password = password;
    }

    encrypt() {
        try {
            var iv = IV;            
            var path = this.filePath;            
            var data = FileSystem.readFileSync(path);
            var bdata = data.toString(BASE64);
            var encrypted = CryptoJS.AES.encrypt(bdata, this.password, {iv: iv});
            var encData = Buffer.from(encrypted.toString(), BASE64);
            
            //salva uma nova imagem _enc (remover e salvar na original)
            var newPath = path.replace(".", "_enc.");

            FileSystem.writeFileSync(newPath, encData);
            return {
                message: TEXT_SUCCESS
            };
        } catch (exception) {
            throw new Error(exception.message);
        }
    }

    decrypt() {
        try {
            var iv = IV;
            var path = this.filePath;
            
            //pega imagem _enc (remover e salvar na original)
            //path = path.replace(".", "_enc.");

            var data = FileSystem.readFileSync(path);
            var bdata = data.toString(BASE64);
            var decrypted = CryptoJS.AES.decrypt(bdata, this.password, {iv: iv});
            var decData = Buffer.from(decrypted.toString(CryptoJS.enc.Utf8), BASE64);
            
            //salva uma nova imagem _dec (remover e salvar na original)
            var newPath = path.replace(".", "_dec.");
            FileSystem.writeFileSync(newPath, decData);

        } catch (exception) {
            throw new Error(exception.message);
        }
    }

}

exports.Security = Security;