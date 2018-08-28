const fs = require('fs');;

module.exports = function generateJSFrame(jsondata) {
    //save output into a file after converting it from json
    const generateJS = "window.globalProvideData('frame','" + JSON.stringify(jsondata) + "')";
    fs.writeFile('updated-frame.js', generateJS, (err, data) => {
        if (err) throw err;
        console.log("Successfully writter our update to JS file");
    });
};