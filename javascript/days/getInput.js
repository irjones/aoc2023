const path = require("path");
const fs = require("fs");

module.exports = {
  read: function (relativeUrl) {
    return fs.readFileSync(path.resolve(relativeUrl)).toString();
  },
};
