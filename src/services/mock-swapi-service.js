export default class MockSwapiService {
  _people = [
    {
      id: 1,
      name: 'id:1 [TEST DATA]',
      image: `https://placeimg.com/400/500/people`,
      gender: 'male',
      birthYear: 'long ago',
      eyeColor: 'dark brown',
    },
    {
      id: 2,
      name: 'id:2 [TEST DATA]',
      image: `https://placeimg.com/400/500/people`,
      gender: 'male',
      birthYear: 'long ago',
      eyeColor: 'blue brown',
    },
    {
      id: 3,
      name: 'id:3 [TEST DATA]',
      image: `https://placeimg.com/400/500/people`,
      gender: 'male',
      birthYear: 'long ago',
      eyeColor: 'red brown',
    },
    {
      id: 4,
      name: 'id:4 [TEST DATA]',
      image: `https://placeimg.com/400/500/people`,
      gender: 'male',
      birthYear: 'long ago',
      eyeColor: 'green brown',
    },
    {
      id: 5,
      name: 'id:5 [TEST DATA]',
      image: `https://placeimg.com/400/500/people`,
      gender: 'male',
      birthYear: 'long ago',
      eyeColor: 'yellow brown',
    },
  ];

  _planets = [
    {
      id: 1,
      name: 'id:1 [TEST DATA]',
      image: `https://placeimg.com/400/400/nature`,
      population: '1.530.000.000',
      rotationPeriod: '10 hours 56 seconds',
      diameter: '12.742 km',
    },
    {
      id: 2,
      name: 'id:2 [TEST DATA]',
      population: 'not known',
      image: `https://placeimg.com/400/400/nature`,
      rotationPeriod: '111 days',
      diameter: '2.104 km',
    },
    {
      id: 3,
      name: 'id:3 [TEST DATA]',
      image: `https://placeimg.com/400/400/nature`,
      population: '2.530.000.000',
      rotationPeriod: '23 hours 56 seconds',
      diameter: '3.742 km',
    },
    {
      id: 4,
      name: 'id:4 [TEST DATA]',
      population: 'not known',
      image: `https://placeimg.com/400/400/nature`,
      rotationPeriod: '385 days',
      diameter: '4.104 km',
    },
    {
      id: 5,
      name: 'id:5 [TEST DATA]',
      image: `https://placeimg.com/400/400/nature`,
      population: '7.530.000.000',
      rotationPeriod: '23 hours 56 seconds',
      diameter: '1.742 km',
    },
  ];

  _starships = [
    {
      id: 1,
      name: 'id:1 [TEST DATA]',
      image: `https://placeimg.com/400/400/tech`,
      model: 'NCC-1701-C',
      manufacturer: 'Northrop Grumman Shipbuilding',
      costInCredits: 'not known',
      length: 'approx 300 meters',
      crew: 1000,
      passengers: 10,
      cargoCapacity: 600,
    },
    {
      id: 2,
      name: 'id:2 [TEST DATA]',
      image: `https://placeimg.com/400/400/tech`,
      model: 'NCC-1701-C',
      manufacturer: 'Northrop Grumman Shipbuilding',
      costInCredits: 'not known',
      length: 'approx 300 meters',
      crew: 2000,
      passengers: 20,
      cargoCapacity: 700,
    },
    {
      id: 3,
      name: 'id:3 [TEST DATA]',
      image: `https://placeimg.com/400/400/tech`,
      model: 'NCC-1701-C',
      manufacturer: 'Northrop Grumman Shipbuilding',
      costInCredits: 'not known',
      length: 'approx 300 meters',
      crew: 3000,
      passengers: 30,
      cargoCapacity: 800,
    },
    {
      id: 4,
      name: 'id:4 [TEST DATA]',
      image: `https://placeimg.com/400/400/tech`,
      model: 'NCC-1701-C',
      manufacturer: 'Northrop Grumman Shipbuilding',
      costInCredits: 'not known',
      length: 'approx 300 meters',
      crew: 4000,
      passengers: 40,
      cargoCapacity: 900,
    },
    {
      id: 5,
      name: 'id:5 [TEST DATA]',
      image: `https://placeimg.com/400/400/tech`,
      model: 'NCC-1701-C',
      manufacturer: 'Northrop Grumman Shipbuilding',
      costInCredits: 'not known',
      length: 'approx 300 meters',
      crew: 5000,
      passengers: 50,
      cargoCapacity: 100,
    },
  ];

  getAllPeople = async () => {
    return this._people;
  };

  getPerson = async (id) => {
    const [person] = this._people.filter((item) => item.id === id);
    return person;
  };

  getAllPlanets = async () => {
    return this._planets;
  };

  getPlanet = async (id) => {
    const [planet] = this._planets.filter((item) => item.id === id);
    return planet;
  };

  getAllStarships = async () => {
    return this._starships;
  };

  getStarship = async (id) => {
    const [starship] = this._starships.filter((item) => item.id === id);
    return starship;
  };

  cancelResource = () => {
    console.log('cancelResource');
  };
}
