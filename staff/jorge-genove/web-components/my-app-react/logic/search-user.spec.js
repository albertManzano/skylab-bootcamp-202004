describe.only('searchUser', () => {
  let name, surname, email, password,tokenValue

  beforeEach(() => {
      name = names.random()
      surname = surnames.random()
      email = `${name.toLowerCase().split(' ').join('')}${surname.toLowerCase().split(' ').join('').concat('-').concat(Math.random())}@mail.com`
      password = passwords.random()
  })
    describe('when  user already exists', () => {
      beforeEach(done =>{debugger
        call(
          "POST",
          "https://skylabcoders.herokuapp.com/api/v2/users/",
          `{"name": "${name}" , "surname": "${surname}", "username" : "${email}","password": "${password}"}`,
          { "Content-type": "application/json" },
          (error, status, body) => {
            if (error) return done(new Error(error));
            if (status !== 201) return done(new Error("unexpectet status"));
    
            call(
              "POST",
              "https://skylabcoders.herokuapp.com/api/v2/users/auth",
              `{"username" : "${email}", "password": "${password}"}`,
              { "Content-type": "application/json" },
              (error, status, body) => {
                if (error) return done(new Error(error));
                if (status !== 200) return done(new Error("Unexpectet status"));
                
                const { token } = JSON.parse(body);
                tokenValue = token;
                debugger
                done();
              }
            );
          }
        );
      });
      it("it should succed in name search", (done) => {debugger
        debugger
        searchUsers("daniel", tokenValue, () => {
        
            expect(users).to.exist;
            expect(users.length).to.be.greaterThan(0);
            done();
          }
        );
      });
    
    
    })
    

 /*  afterEach((done) => {
    call(
      "POST",
      "https://skylabcoders.herokuapp.com/api/v2/users/auth",
      `{ "username": "${email}", "password": "${password}" }`,
      { "Content-type": "application/json" },
      (error, status, body) => {
        if (error) return done(error);
        if (status !== 200)
          return done(new Error(`unexpected status ${status}`));

        const { token } = JSON.parse(body);

        call(
          "DELETE",
          "https://skylabcoders.herokuapp.com/api/v2/users",
          `{ "password": "${password}" }`,
          {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          (error, status, body) => {
            if (error) return done(new Error(error.message));
            if (status !== 204)
              return done(new Error(`undexpected status ${status}`));

            done();
          }
        );
      }
    );
  }); */
});
