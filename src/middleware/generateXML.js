const fs = require('fs');
parseString = require('xml2js').parseString;
xml2js = require('xml2js');

module.exports = function generateXML(jsondata) {
  return new Promise((resolve, reject) => {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(jsondata);
    fs.writeFile('./course-input/story_content/frame.xml', xml, function (err, data) {
      if (err) reject("Problem Generting frame.xml file");
      resolve(true);
    })
  })
};