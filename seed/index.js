const { faker } = require("@faker-js/faker");
const { join } = require("path");
const { writeFile } = require("fs/promises");

const { Car, CarCategory, Customer } = require("../src/entities");

const seedBaseFolder = join(__dirname, "../", "database");
const ITENS_AMOUNT = 3;
const cars = [];
const customers = [];

const carCategory = new CarCategory({
  id: faker.datatype.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
});

for (let index = 0; index < ITENS_AMOUNT; index++) {
  const car = new Car({
    id: faker.datatype.uuid(),
    name: faker.vehicle.vehicle(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear(),
  });

  const customer = new Customer({
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    age: faker.datatype.number({ min: 18, max: 50 })
  });

  carCategory.carIds.push(car.id);
  cars.push(car);
  customers.push(customer);
}

const write = (filename, data) =>
  writeFile(join(seedBaseFolder, filename), JSON.stringify(data));

(async () => {
  await write("cars.json", cars);
  await write("customers.json", customers);
  await write("carCategory.json", [carCategory]);
})();
