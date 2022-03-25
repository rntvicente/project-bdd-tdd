const BaseRepository = require("../repository/base");
const Tax = require("../entities/tax");
const Transaction = require("../entities/transaction");

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });

    this.taxesBasedOfAge = Tax.TaxesBasedOnAge;

    this.currencyFormat = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  getRandomPositionFromArray(list) {
    return Math.floor(Math.random() * list.length);
  }

  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];

    return carId;
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;

    const { then: tax } = this.taxesBasedOfAge.find(
      ({ from, to }) => age >= from && age <= to
    );

    const finalPrice = price * tax * numberOfDays;
    const formattedPrice = this.currencyFormat.format(finalPrice);
    return formattedPrice;
  }

  async getAvailableCar(carCategory) {
    const carId = this.chooseRandomCar(carCategory);
    const car = this.carRepository.find(carId);

    return car;
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = this.calculateFinalPrice(customer, carCategory, numberOfDays);
    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dueDate = today.toLocaleDateString('pt-BR', options);

    const transaction = new Transaction({
      customer,
      car,
      amount: finalPrice,
      dueDate
    });

    return transaction;
  }
}

module.exports = CarService;
