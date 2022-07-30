const { DB } = require("./versatiledb/VersatileDB");

module.exports.database = new DB("./data/users.db", {
  schema: "./data/schema.json",
  validate: true,
  autoinsert: true,
}).read();

module.exports.getUser = async function (id, tag) {
  let user = await module.exports.database.findOne({ id });

  if (!user) {
    user = await module.exports.database.create("user", { id, tag });
  }

  return user;
};
