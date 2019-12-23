// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
chai.use(chaiHttp);

describe('EU-UsersLoginController Testing', function() {
  // Begin: EU-UsersLoginController app.post('/api/v1/ma/user/login') API Unit Test Code
  describe('/POST login', function() {
    it('User Login Authentication Validation - Positive Case 01: With User Account', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'enduser',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Positive Case 02: With Email', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'enduser@gmail.com',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Positive Case 03: With Phone Number', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: '9123456789',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
  
    it('User Login Authentication Validation - Negative Case 01: With Invalid password', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'ashok',
        password: 'invalid@password'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Negative Case 02: With Invalid userID', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'invalidUserName',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Negative Case 03: With Empty userID', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: '',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Negative Case 04: With Empty password', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'ashok',
        password: ''
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Negative Case 05: With Empty userID and password', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: '',
        password: ''
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Negative Case 06: With Blocked UserID', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'enduser2',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Login Authentication Validation - Negative Case 07: With Inactive UserID', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        userID: 'enduser3',
        password: 'Welcome123'
      };
      chai.request(app).post('/api/v1/ma/user/login').send(userCredentials).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Login Status: ', res.body.statusMessage);
        }
      });
    });
  });
  // End: EU-UsersLoginController app.post('/api/v1/ma/user/login') API Unit Test Code
});
