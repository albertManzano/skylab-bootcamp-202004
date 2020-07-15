const fs = require("fs");
const path = require("path");
const { find } = require("../data/users");
require("../utils/polyfills/json");
require("../utils/polyfills/function");

module.exports = (userId, query, callback) => {
  String.validate.notVoid(userId);
  String.validate.notVoid(query);
  Function.validate(callback);

  find({ id: userId }, (error, [user]) => {
    if (error) return callback(error);

    if (!user) return callback(new Error(`user with ${userId} does not exist`));

    fs.readdir(
      path.join(__dirname, "..", "data", "contacts"),
      (error, files) => {
        if (error) return callback(error);

        let wasError = false;

        const contacts = [];
        if (!files.length) callback(null, contacts);
        let count = 0;

        files.forEach((file) => {
          const _path = path.join(__dirname, "..", "data", "contacts", file);
          if (!_path.includes(".gitignore")) {
            fs.readFile(_path, "utf8", (error, json) => {
              if (error) {
                if (!wasError) {
                  callback(error);

                  wasError = true;
                }
                return;
              }

              if (!wasError) {
                const contact = JSON.parse(json);

                //if (contact.user === userId) {
                  const values = Object.values(contact);
                  const matches = values.some((value) =>
                    value.toLowerCase().includes(query.toLowerCase())
                  );

                  if (matches) {
                    contact.id = file.substring(0, file.indexOf(".json"));

                    contacts.push(contact);
                  }
               // }

                if (++count === files.length - 1) callback(null, contacts);
              }
            });
          }
        });
      }
    );
  });
};
