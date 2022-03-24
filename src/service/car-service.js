const BaseRepository = require("../repository/base");

class CarService {
  constructor({ cars }) {
    this.carsRepository = new BaseRepository({ file: cars });
  }

  test() {
    return this.carsRepository.find();
  }
}

module.exports = CarService;
