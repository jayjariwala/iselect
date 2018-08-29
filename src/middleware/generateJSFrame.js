const fs = require('fs');

module.exports = function generateJSFrame(jsondata) {
    //save output into a file after converting it from json
    return new Promise((resolve, reject) => {
        const generateJS = "window.globalProvideData('frame','" + JSON.stringify(jsondata) + "')";
        fs.writeFile('./course-input/html5/data/js/frame.js', generateJS, (err, data) => {
            if (err) reject("Problem Generating frame.js file");
            resolve(true);
        });
    })

};