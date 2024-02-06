// worker.js
import faker from 'faker';

self.onmessage = function(event) {
    if (event.data === 'start') {
      generateUsers();
    }
  };
  
  function generateUsers() {
    const users = [];
  
    for (let i = 0; i < 50000; i++) {
      let id = i + 1;
      let name = faker.person.firstName();
      let email = faker.internet.email();
      let joinedOn = faker.date.recent();
      let commentCount = faker.random.number({ min: 0, max: 100 });
      let user = {
        id,
        name,
        email,
        joinedOn,
        commentCount
      };
      users.push(user);
    }
  
    self.postMessage(users);
  }
  