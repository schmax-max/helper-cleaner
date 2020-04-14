require("./config/connection");

const { commander } = require("./svc");
const { body } = require("./tests/data");

commander(body).then((res) => {
  console.log({ res });
});
