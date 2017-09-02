const frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exposes Joi for convenience

let header = (spec) => {
    spec.setup({
        request: {
            headers: { "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTk4NDdkNjJmNzljNWUxMmMyOTgzNWNkIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0IiwiX192IjoiaW5pdCIsImNyZWF0ZWRBdCI6ImluaXQiLCJ1cGRhdGVkQXQiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsImNyZWF0ZWRBdCI6dHJ1ZSwidXBkYXRlZEF0Ijp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmQiOiJwYXNzd29yZCIsInVzZXJuYW1lIjoiTmlja3kgQ2FybWluYSIsImNyZWF0ZWRBdCI6IjIwMTctMDgtMDRUMTM6NTc6NTQuNzMzWiIsInVwZGF0ZWRBdCI6IjIwMTctMDgtMDRUMTM6NTc6NTQuNzMzWiIsIl9pZCI6IjU5ODQ3ZDYyZjc5YzVlMTJjMjk4MzVjZCJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTAzNDkwNjIyfQ.knJzE8ZeHfh6Rows03kmQT0egvYNLdhDo-VwaxC_034" }
        }
    });
}

let firstProject;
let newProject = {
    title: "Test Project",
    owner: "599d808d1c4d434efdaf5e2d",
    users: ["599d808d1c4d434efdaf5e2d"]
};
let createdProject;

describe('Test cases for project routes', () => {
    it('should display a list of projects in the /projects route', (done) => {
        frisby
            .use(header)
            .get('http://localhost:8080/projects')
            .then((json) => {
                firstProject = json._body[0];
                expect(json._body.length).not.toBeLessThan(0);
            })
            .expect('jsonTypes', '*', {
                _id: Joi.string(),
                updatedAt: Joi.string(),
                createdAt: Joi.string(),
                title: Joi.string(),
                owner: Joi.object(),
                users: Joi.array()

            }).done(done);
    });
    it('should display a single project in the /projects/:id route', (done) => {
        frisby
            .use(header)
            .get('http://localhost:8080/projects/' + firstProject._id)
            .expect('json', firstProject)
            .done(done);
    });
    it('should be able to create a project using POST method in /projects route', (done) => {
        frisby
            .use(header)
            .post('http://localhost:8080/projects/', newProject, { json: true })
            .then((json) => {
                createdProject = json._body;
                expect(json._body.title).toBe(newProject.title);
            })
            .done(done);
    });
    it('should not allow duplicate project names ', (done) => {
        frisby
            .use(header)
            .post('http://localhost:8080/projects/', newProject, { json: true })
            .expect('json', { error: 'There was an error with your submitted data, Most probably project already exists' })
            .done(done);
    });
    it('Should be able to edit a project in the projects/:id route using PUT method', (done) => {
        frisby
            .use(header)
            .put('http://localhost:8080/projects/' + createdProject._id, { title: "Test project updated" }, { json: true })
            .expect('json', { success: true })
            .done(done);
    });
    it('Should be able to delete a project in the projects/:id route using DELETE method', (done) => {
        frisby
            .use(header)
            .del('http://localhost:8080/projects/' + createdProject._id)
            .expect('json', { success: true })
            .done(done);
    });
})