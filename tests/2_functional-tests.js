const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  let testId; // armazenará o _id da issue criada para os testes de update e delete

  suite('POST /api/issues/{project} => Create issue', function () {

    test('Create an issue with every field', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'status_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'open');
          assert.property(res.body, '_id');
          testId = res.body._id;
          done();
        });
    });

    test('Create an issue with only required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title Required',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'status_text');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          done();
        });
    });

    test('Create an issue with missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: ''
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });

  });

  suite('GET /api/issues/{project} => View issues', function () {

    test('View issues on a project', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test('View issues on a project with a filter', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ open: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => {
            assert.equal(issue.open, true);
          });
          done();
        });
    });

    test('View issues on a project with multiple filters', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ open: true, created_by: 'Functional Test - Every field' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => {
            assert.equal(issue.open, true);
            assert.equal(issue.created_by, 'Functional Test - Every field');
          });
          done();
        });
    });

  });

  suite('PUT /api/issues/{project} => Update issue', function () {

    test('Update one field on an issue', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId,
          issue_text: 'Updated text'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': testId });
          done();
        });
    });

    test('Update multiple fields on an issue', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId,
          issue_text: 'Updated text again',
          open: false
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': testId });
          done();
        });
    });

    test('Update an issue with missing _id', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_text: 'Trying update without id'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    test('Update an issue with no update fields sent', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': testId });
          done();
        });
    });

    test('Update an issue with an invalid _id', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'invalidid',
          issue_text: 'Updated text'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', '_id': 'invalidid' });
          done();
        });
    });

  });

  suite('DELETE /api/issues/{project} => Delete issue', function () {

    test('Delete an issue', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: testId
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', '_id': testId });
          done();
        });
    });

    test('Delete an issue with an invalid _id', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'invalidid'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not delete', '_id': 'invalidid' });
          done();
        });
    });

    test('Delete an issue with missing _id', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

  });

});
