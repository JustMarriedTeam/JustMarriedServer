import HttpStatus from "http-status";

module.exports = {
  get(req, res) {
    res.status(HttpStatus.OK).json({
      text: "Hi there!"
    });
  }
};
