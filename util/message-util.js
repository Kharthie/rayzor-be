const messages = require('../util/message');
const enUsmessages = require('./message-en-us');


module.exports = function message(languageCode) {
    languageCode = languageCode?languageCode.toLowerCase():languageCode;
    if(languageCode == "en-us") { 
        return  enUsmessages 
    }else{
        return messages;
    }
}