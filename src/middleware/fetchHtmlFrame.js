const fs = require('fs');

module.exports = function (html5fetch) {
    fs.readFile(__dirname + '/../frames/frame.js', 'utf-8', (err, data) => {
        if (err) console.log(err);
        const startTrim = data.toString().indexOf('{');
        const endTrim = data.toString().lastIndexOf('}');
        const html5OriginalNav = JSON.parse(data.toString().substring(startTrim, endTrim + 1));
        console.log("html5 original nav::",
            html5OriginalNav);
        //got json array or what?
        html5fetch(html5OriginalNav);
    })
}