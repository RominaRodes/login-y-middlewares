
const fs  =require('fs');
const path =require('path')
const txtfilepath = path.join(__dirname, '../logs/userLogs.txt')

function userLogs (req,res,next){
   fs.appendFile(txtfilepath, "el usuario ingreso en la ruta " + req.url, (err) => {
    if (err) throw err;
  })
    //console.log("el usuario ingreso en la ruta " + req.url)
    next()

}

module.exports = userLogs