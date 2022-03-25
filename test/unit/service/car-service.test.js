const sinon = require("sinon");
const { join } = require("path");
const { expect } = require("chai");

const { CarService } = require("../../../src/service");
const mocks = {
  validCar: require("../../mocks/valid-car.json"),
  validCarCategory: require("../../mocks/valid-car-category.json"),
  validCustomer: require("../../mocks/valid-customer.json"),
};

const carsDatabase = join(__dirname, "../../../database", "cars.json");

describe("CarService Suite Test", () => {
  let carService;
  let sandbox = {};

  before(() => {
    carService = new CarService({ cars: carsDatabase });
  });

  beforeEach(() => (sandbox = sinon.createSandbox()));

  afterEach(() => sandbox.restore());

  it("should retrieve a random position from an array", () => {
    const list = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(list);

    expect(result).to.be.lte(list.length).and.be.gte(0);
  });

  it("should choose the first id from carIds in carCategory", async () => {
    const carCategory = mocks.validCarCategory;
    const carIndex = 0;

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIndex);

    const result = await carService.chooseRandomCar(carCategory);

    const expected = carCategory.carIds[carIndex];

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });

  it("given a carCategory it should return an available car", async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvailableCar(carCategory);

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(car);
  });

  it("'given a carCategory, customer and numberOfDays it should calculate final amount in real", async () => {
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvailableCar(carCategory);

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(car);    
  });
});
