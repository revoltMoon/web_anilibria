  describe('checkCartoonNotInDB', function () {
 	it('only if index == -1 cartoon not in DB', function () {
    chai.expect(checkCartoonNotInDB(-1)).to.equal(true);
  });
   	it('only if index == -1 cartoon not in DB', function () {
    chai.expect(checkCartoonNotInDB(10)).to.equal(false);
  });
    it('only if index == -1 cartoon not in DB', function () {
    chai.expect(checkCartoonNotInDB(115)).to.equal(false);
  });
   	it('only if index == -1 cartoon not in DB', function () {
    chai.expect(checkCartoonNotInDB(-1)).to.equal(true);
  });
   	it('only if index == -1 cartoon not in DB', function () {
    chai.expect(checkCartoonNotInDB(123012301)).to.equal(false);
  });
 });
 
  describe('favCartoonIdNotZero', function () {
 	it('should return true if cartoon id not zero', function () {
    chai.expect(favCartoonIdNotZero(0)).to.equal(false);
  });
   	it('should return true if cartoon id not zero', function () {
    chai.expect(favCartoonIdNotZero(10)).to.equal(true);
  });
    it('should return true if cartoon id not zero', function () {
    chai.expect(favCartoonIdNotZero(115)).to.equal(true);
  });
   	it('should return true if cartoon id not zero', function () {
    chai.expect(favCartoonIdNotZero(0)).to.equal(false);
  });
   	it('should return true if cartoon id not zero', function () {
    chai.expect(favCartoonIdNotZero(100320)).to.equal(true);
  });
 });
 
  describe('receiveCartoons', function () {
        this.timeout(4000);
it('we receive all cartoons from db', function(done) {
        receiveCartoons()
           .then(function(result) {
            chai.expect(result).to.have.own.property(100);
            chai.expect(result).to.have.own.property(101);
            chai.expect(result).to.have.own.property(102);
            chai.expect(result).to.have.own.property(103);
            chai.expect(result).to.have.own.property(104);
            chai.expect(result).to.have.own.property(105);
            chai.expect(result).to.have.own.property(106);
            chai.expect(result).to.have.own.property(107);
            chai.expect(result).to.have.own.property(108);
            chai.expect(result).to.have.own.property(109);
            chai.expect(result).to.have.own.property(110);
            done();
     });
});

it('result is object', function(done) {
        receiveCartoons()
           .then(function(result) { 
             chai.expect(result).to.be.an('object');
            done();
     });
});

it('Name of cartoon with 105 id is Overlord', function(done) {
        receiveCartoons()
           .then(function(result) {
            chai.expect(result[105]["cartoonName"]).to.equal("Overlord");
            done();
     });
});

it('Cartoon contains cartoonName, cartoonImgUrl, cartoonDescription, cartoonID keys', function(done) {
        receiveCartoons()
           .then(function(result) {
            chai.expect(result[103]).to.include.keys('cartoonName', 'cartoonImgUrl', 'cartoonDescription','cartoonID');
            done();
     });
});

it('Name of cartoon with 106 id is Darling in the FranXX', function(done) {
        receiveCartoons()
           .then(function(result) {
            chai.expect(result[106]["cartoonName"]).to.equal("Darling in the FranXX");
            done();
     });
});
});
  
  describe('getUserCartoons', function () {
    this.timeout(4000);
    
    it('we receive fav cartoons of user kub921', function(done) {
        getUserCartoons("kub921")
           .then(function(result) {
                chai.expect(result).to.have.ordered.members([0, 110, 109,102,106,103,100,107]);
                done();
            });
    });

    it ('sneg"s fav cartoons including 105,106,103 id', function(done) {
      getUserCartoons("sneg")
            .then(function(result) {
                chai.expect(result).to.include.members([105,106,103]);
                done();
            });
    });
    
    it('fav cartoons of user fdfd include id 0', function(done) {
        getUserCartoons("fdfd")
           .then(function(result) {
                chai.assert.include(result,0);
                done();
            });
    });
    
    it('result is an array', function(done) {
        getUserCartoons("fdfd")
           .then(function(result) {
                chai.expect(result).to.be.an('array');
                done();
           });
    });
    
    it('creates new user in DB', function(done) {
        getUserCartoons("fdfds1233443")
           .then(function(result) {
                chai.assert.include(result,0);
                done();
            });
    });
});