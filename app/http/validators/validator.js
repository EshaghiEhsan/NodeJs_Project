const autobind = require('auto-bind')
module.exports = class validator{
    constructor(){
        autobind(this)
    }
}