const fs = require('fs');

const electron = require('electron');
const ipc = electron.ipcRenderer;

function generateList(links) {
  return links.map((link,headingNum) => {
    return `<ul><li id="${headingNum}" >${link.$.displaytext} <ul>
      ${link.links[0].slidelink.map((slidelink,sideLinkNum) => {
        return `<li id="${headingNum}.${sideLinkNum}">${slidelink.$.displaytext}</li>`
      }).join('')}
      </ul>
      </li>
    </ul>`;
  }).join('')
}

function generateXML(originalJSON, selectedNav) {
  let originalNav = originalJSON.bwFrame.nav_data[0].outline[0].links[0].slidelink;
  console.log("orignal Nav::", originalJSON);
  let obj = { }; 
  let manipuledNav = [];
  selectedNav.selected.forEach((each) => {
    if(each.includes('.'))
    {
      let heading = each.substring(-1,each.indexOf('.'));
      let subtopic = each.substring(each.indexOf('.') + 1, each.length);
      if(!Object.keys(obj).includes(heading)) {
        obj[heading] = [];
        obj[heading].push(subtopic);
      } else {
        obj[heading].push(subtopic);
      }
    }
  })

  originalNav.map((heading, headingIndex) => {
    let manipulatedObj = {"$": {}, "links": [{'slidelink': []}]};
    if(Object.keys(obj).includes(headingIndex.toString())) {
      manipulatedObj.$ = heading.$;
      heading.links[0].slidelink.map((slideLink,slideLinkIndex) => {
        if(obj[headingIndex].includes(slideLinkIndex.toString())) {
          manipulatedObj.links[0].slidelink.push(slideLink);
        }
      })
      manipuledNav.push(manipulatedObj);
    } 
  })
  
  return manipuledNav;
}

ipc.send('load_tree_data');

ipc.on('jsondata', (event , json) => {
  let originalJSON = json;
  let links = json.bwFrame.nav_data[0].outline[0].links[0].slidelink;
  let navigation = generateList(links);
  $('#jstree').html(navigation);

  $('#jstree').jstree({
    "core" : {
      "themes" : {
        "variant" : "large"
      }
    },
    "checkbox" : {
      "keep_selected_style" : false
    },
    "plugins" : [ "wholerow", "checkbox" ]
  });

  $('#jstree').on("changed.jstree", function (e, selectedNav) {
    console.log(" Event called::");
    const manipulatedNav = generateXML(originalJSON, selectedNav);
    let newNavBar = JSON.parse(JSON.stringify(originalJSON));
    newNavBar.bwFrame.nav_data[0].outline[0].links[0].slidelink = manipulatedNav;
    ipc.send('generateXML', newNavBar);
  });

})


