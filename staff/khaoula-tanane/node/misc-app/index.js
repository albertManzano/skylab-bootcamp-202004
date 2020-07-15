const express = require("express");
// const { App, Register, Login, Home, Landing, Cookies, Feedback, AddContact, AddStickies, ListContacts, SearchContacts } = require('./components')
const { registerUser, authenticateUser, retrieveUser, createSession, updateSession, retrieveSession, removeSession, addContact, listContacts, searchContacts, addStickies } = require('./logic')
const { cookieSession } = require('./utils/middlewares')
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const { find } = require("./data/users");

const app = express();
app.set('view engine', 'pug')
app.set('views', './components/')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static("public"));

app.get('/', cookieParser, cookieSession, (req, res) => {
  const { session: { cookiesAccepted, userId } } = req

  if (userId) return res.redirect('/home')

  res.render('Landing', {cookiesAccepted})
})

// app.get("/", (req, res) => res.send(App(Landing())));

app.get("/register", cookieSession, (req, res) => {
  const { session: { cookiesAccepted, userId } } = req
  if (userId) return res.redirect('/home')
  res.render('Register', {cookiesAccepted})
});

app.post("/register", (req, res) => {
  const { body } = req;

  registerUser(body, (error, id) => {
    if (error) throw error;
    const feedback = error.message
    return res.render('Register',{cookiesAccepted,feedback})
  });
});

app.get("/login", cookieSession, (req, res) => {
  const { cookies, session: { cookiesAccepted } } = req;
  if (cookies) {
    const {id} = cookies;
    if (id) return res.redirect("/home");
  }
  res.render('Login', {cookiesAccepted});
});

app.post("/login", cookieSession, (req, res) => {
  const {
    body: { email, password },
  } = req;

  authenticateUser(email, password, (error, id) => {
    const feedback = error.message
    if (error) return res.render('Login',{cookiesAccepted,feedback})
    const { session } = req;
    session.userId = id
    session.save(error => {
      if (error) throw error      
      res.cookie("id", id);
      res.redirect("/home");
  })
  });
});

app.get("/home", cookieSession, (req, res) => {
  const { cookies, session: { cookiesAccepted } } = req;

  if (!cookies) return res.redirect("/login");
  const {id} = cookies;
  if (!id) return res.redirect("/login");

  retrieveUser(id, (error, { name }) => {
    const feedback = error.message
    if (error) return res.render('Home', {cookiesAccepted,name,feedback})
    res.render('Home', {cookiesAccepted, name});
  });
});

app.get("/landing", (req, res) => {
  const { cookies } = req;
  if (cookies) {
    const {id} = cookies;
    if (id) return res.redirect("/home");
  }
  res.send(App(Landing()));
});

app.post("/logout", cookieSession, (req, res) => {
  const { session } = req;
  // res.clearCookie("id");
  session.destroy(error => {
    if (error) throw error
    res.redirect("/landing");
})
});

app.get("/contacts", (req, res) => {
    listContacts((error, contacts) => {
      if (error) throw error //TODO error handling
      res.send(App(ListContacts(contacts)));
    })
  })

app.get("/search", (req, res) => {
  const {
    query: { q: query },
} = req;
  if (!query) {
    res.send(App(SearchContacts()));
  } else {
  const { cookies } = req;
    if (!cookies) return res.redirect("/login");
    const {id} = cookies;
    if (!id) return res.redirect("/login");

    searchContacts(id, query, (error, contactResults) => {
      if (error) throw error;

      res.send(App(`${SearchContacts(query)}${ListContacts(contactResults)}`));
    });
  }
});
app.get("/add-contact", (req, res) => {
    res.render('AddContact');
  });
// app.get("/add-contact", (req, res) => {
//     res.send(App(AddContact()));
//   });
  
  app.post("/add-contact", (req, res) => {
    const { body, cookies } = req;
    if (cookies) {
    const {id} = cookies;
      if (!id) return res.redirect("/login");
      addContact(id, body, (error) => {
        if (error) throw error;
        res.redirect("/search");
      });
    }
    });

    app.get("/add-stickies", (req, res) => {
    // const { session: { cookiesAccepted } } = req;
        res.render('AddStickie');
      });
      
      app.post("/add-stickie", (req, res) => {
        const { body, cookies } = req;
        if (cookies) {
          const {id} = cookies;
          if (!id) return res.redirect("/login");
          addStickies(id, body, (error, stickieResult) => {
            if (error) throw error;
            res.redirect('/add-stickies')
          });
        }
        });
  app.post('/accept-cookies', cookieSession, (req, res) =>{
    const { session } = req;
    session.cookiesAccepted = true

    session.save(error => {
      if (error) throw error
      res.redirect(req.header('referer'))
    })
  })

  app.get('*', cookieSession, (req, res) => {
    const { session: { cookiesAccepted, userId } } = req

    if (userId) return res.redirect('/home')

    res.render('NotFound404', { cookiesAccepted })
})
  
app.listen(8080, () => console.log('Server running!'))

