const frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exposes Joi for convenience

let header = (spec) => {
    spec.setup({
        request: {
            headers: { "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTk4NDdkNjJmNzljNWUxMmMyOTgzNWNkIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0IiwiX192IjoiaW5pdCIsImNyZWF0ZWRBdCI6ImluaXQiLCJ1cGRhdGVkQXQiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsImNyZWF0ZWRBdCI6dHJ1ZSwidXBkYXRlZEF0Ijp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmQiOiJwYXNzd29yZCIsInVzZXJuYW1lIjoiTmlja3kgQ2FybWluYSIsImNyZWF0ZWRBdCI6IjIwMTctMDgtMDRUMTM6NTc6NTQuNzMzWiIsInVwZGF0ZWRBdCI6IjIwMTctMDgtMDRUMTM6NTc6NTQuNzMzWiIsIl9pZCI6IjU5ODQ3ZDYyZjc5YzVlMTJjMjk4MzVjZCJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTAzNDkwNjIyfQ.knJzE8ZeHfh6Rows03kmQT0egvYNLdhDo-VwaxC_034" }
        }
    });
}

let firstIssue;
let newIssue = {
    title: "Test Issue",
    description: "Test issue description",
    project: "599d7d4deeaed74b7b9413f8",
    assignee: "599d808d1c4d434efdaf5e2d",
    creator: "599d808d1c4d434efdaf5e2d",
    state: "open"
};

let updateIssue = {
    title: "Test issue updated",
    description: "Test issue description",
    project: "599d7d4deeaed74b7b9413f8",
    assignee: "599d808d1c4d434efdaf5e2d",
    creator: "599d808d1c4d434efdaf5e2d",
    state: "open"
};
let createdIssue;

describe('Test cases for issue routes', () => {
    it('should display a list of issues in the /issues route', (done) => {
        frisby
            .use(header)
            .get('http://localhost:8080/issues')
            .then((json) => {
                firstIssue = json._body[0];
                expect(json._body.length).not.toBeLessThan(0);
            })
            .expect('jsonTypes', '*', {
                _id: Joi.string(),
                updatedAt: Joi.string(),
                createdAt: Joi.string(),
                title: Joi.string(),
                description: Joi.string(),
                project: Joi.object(),
                assignee: Joi.object(),
                creator: Joi.object(),
                state: Joi.string()

            }).done(done);
    });
    it('should display a single issue in the /issues/:id route', (done) => {
        frisby
            .use(header)
            .get('http://localhost:8080/issues/' + firstIssue._id)
            .expect('json', firstIssue)
            .done(done);
    });
    it('should be able to create a Issue using POST method in /issues route', (done) => {
        frisby
            .use(header)
            .post('http://localhost:8080/issues/', newIssue, { json: true })
            .then((json) => {
                createdIssue = json._body;
                expect(json._body.title).toBe(newIssue.title);
            })
            .done(done);
    });
    it('should not allow duplicate issue names ', (done) => {
        frisby
            .use(header)
            .post('http://localhost:8080/issues/', newIssue, { json: true })
            .expect('json', { error: 'There was an error with your submitted data, Most probably issue already exists' })
            .done(done);
    });
    it('Should be able to edit a Issue in the issues/:id route using PUT method', (done) => {
        frisby
            .use(header)
            .put('http://localhost:8080/issues/' + createdIssue._id, updateIssue, { json: true })
            .expect('json', { success: true })
            .done(done);
    });
    it('Should be able to delete a issue in the issues/:id route using DELETE method', (done) => {
        frisby
            .use(header)
            .del('http://localhost:8080/issues/' + createdIssue._id)
            .expect('json', { success: true })
            .done(done);
    });
})