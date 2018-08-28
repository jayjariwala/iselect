const fs = require('fs');
parseString = require('xml2js').parseString;
xml2js = require('xml2js');

module.exports = function generateXML(jsondata) {
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(jsondata);
  fs.writeFile('edited-test.xml', xml, function (err, data) {
    if (err) console.log(err);
    console.log("successfully written our update xml to file");
  })
};