const frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exposes Joi for convenience
let firstUser;
let newUser = {
    username: "nawazish",
    password: "helloworld",
}
let createdUser;

describe('Test cases for user routes', () => {
    it('Should reach the API home page', (done) => {
        frisby.get('http://localhost:8080/')
            .expect('status', 200)
            .done(done);
    });
    it('Should return a list of available users in Json format in the /users route', (done) => {
        frisby.get('http://localhost:8080/users')
            .then((json) => {
                firstUser = json._body[0];
                expect(json._body.length).not.toBeLessThan(0);
            })
            .expect('jsonTypes', '*', {
                _id: Joi.string(),
                updatedAt: Joi.string(),
                createdAt: Joi.string(),
                username: Joi.string(),
                password: Joi.string()
            }).done(done);
    });
    it('Should return a single user in the users/:id route', (done) => {
        frisby.get('http://localhost:8080/users/' + firstUser._id)
            .expect('json', firstUser)
            .done(done);
    });
    it('Should be able to create new users in the users/ route using POST method', (done) => {
        frisby.post('http://localhost:8080/users/', newUser, { json: true })
            .then((json) => {
                createdUser = json._body;
                expect(json._body.username).toBe(newUser.username);
            })
            .done(done);
    });
    it('Should return an error if a duplicate user is being created', (done) => {
        frisby.post('http://localhost:8080/users/', newUser, { json: true })
            .expect('json', { error: 'There was an error with your submitted data, Most probably user already exists' })
            .done(done);
    });
    it('Should be able to authenticate a user and provide a token in return at the auth/ route using POST method', (done) => {
        frisby.post('http://localhost:8080/auth', newUser, { json: true })
            .then((json) => {
                let containsToken = json._body.hasOwnProperty('token');
                expect(containsToken).toBe(true);
            })
            .done(done);
    });
    it('Should be able to edit a user in the users/:id route using PUT method', (done) => {
        frisby.put('http://localhost:8080/users/' + createdUser._id, { username: "Nawazish Ali" }, { json: true })
            .expect('json', { success: true })
            .done(done);
    });
    it('Should be able to delete a user in the users/:id route using DELETE method', (done) => {
        frisby.del('http://localhost:8080/users/' + createdUser._id)
            .expect('json', { success: true })
            .done(done);
    });


});
