/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
const { request, response } = require('express')
const express = require('express')
const app = express()
const csrf = require('tiny-csrf')
// const { Op } = require('sequelize');
const { User, Sport, Session } = require('./models')
const { check, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')
const session = require('express-session')
const LocalStrategy = require('passport-local')

const bcrypt = require('bcrypt')
const saltRounds = 10

const flash = require('connect-flash')

app.use(express.urlencoded({ extended: false }))
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(flash())
const user = require('./models/user')
// const sport = require('./models/sport')

app.use(bodyParser.json())
app.use(cookieParser('ssh!!!! some secret string'))
app.use(csrf('this_should_be_32_character_long', ['POST', 'PUT', 'DELETE']))

app.use(
  session({
    secret: 'this is my secret-258963147536214',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use((request, response, next) => {
  response.locals.messages = request.flash()
  next()
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      password: 'password'
    },
    (username, password, done) => {
      console.log(User)
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password)
          if (result) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Invalid Password' })
          }
        })
        .catch((eror) => {
          return done(null, false, { message: 'Invalid user credentials' })
        })
    }
  )
)

passport.serializeUser((user, done) => {
  console.log('Serializing user in session', user.id)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      done(error, null)
    })
})
function requirePublisher (request, response, next) {
  if (request.user && request.user.role === 'admin') {
    return next()
  } else {
    response.status(401).json({ message: 'Unauthorized user.' })
  }
}

app.get('/', (request, response) => {
  if (request.isAuthenticated()) {
    if (request.user.role == 'admin') {
      response.redirect('/admin')
    } else {
      response.redirect('/player')
    }
  } else {
    response.render('index', {
      failure: false,
      csrfToken: request.csrfToken()
    })
  }
})
app.post('/users', async (request, response) => {
  if (!request.body.firstname) {
    request.flash('error', 'First Name cannot be empty')
    return response.redirect('/signup')
  }
  if (!request.body.email) {
    request.flash('error', 'Email cannot be empty')
    return response.redirect('/signup')
  }

  if (!request.body.password) {
    request.flash('error', 'Password cannot be empty')
    return response.redirect('/signup')
  }
  if (!request.body.role) {
    request.flash('error', 'Role cannot be empty')
    return response.redirect('/signup')
  }
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds)
  console.log('users called..')
  console.log(hashedPwd)
  try {
    const user = await User.addUser({
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: hashedPwd,
      role: request.body.role
    })
    console.log(User)
    request.login(user, (err) => {
      if (err) {
        console.log(err)
        response.redirect('/')
      }
      response.redirect('/')
    })
  } catch (error) {
    console.log(error)
    request.flash('error', error.errors[0].message)
    response.redirect('/signup')
  }
})

app.get('/login', (request, response) => {
  if (request.isAuthenticated()) {
    if (request.user.role == 'admin') {
      response.redirect('/admin')
    } else {
      response.redirect('/player')
    }
  } else {
    response.render('login', {
      csrfToken: request.csrfToken()
    })
  }
})

app.get('/signout', (request, response, next) => {
  console.log('/signout is called')
  request.logout((err) => {
    if (err) {
      return next(err)
    }
    response.redirect('/')
  })
})

app.post(
  '/session',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  async (request, response) => {
    console.log('/session is called')

    if (request.user.role == 'admin') {
      response.redirect('/admin')
    }
    if (request.user.role == 'player') {
      response.redirect('/player')
    }
  }
)

app.get('/signup', (request, response) => {
  response.render('signup', {
    failure: false,
    csrfToken: request.csrfToken()
  })
})

app.get(
  '/admin',
  connectEnsureLogin.ensureLoggedIn(),
  requirePublisher,
  async (request, response) => {
    const loggedinUser = request.user
    console.log(loggedinUser)
    const allSports = await Sport.getSports(loggedinUser.id)
    const getUser = await User.addUser(loggedinUser)

    if (request.accepts('HTML')) {
      response.render('adminHome', {
        getUser: loggedinUser,
        allSports,
        csrfToken: request.csrfToken()
      })
    } else {
      response.json({
        getUser: loggedinUser,
        allSports
      })
    }
  }
)

app.get(
  '/player',
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedinUser = request.user
    console.log(loggedinUser)
    const allSports = await Sport.getSports(loggedinUser.id)
    const getUser = await User.addUser(loggedinUser.id)
    if (request.accepts('HTML')) {
      response.render('playerHome', {
        getUser: loggedinUser,
        allSports,
        csrfToken: request.csrfToken()
      })
    } else {
      response.json({
        getUser: loggedinUser,
        allSports
      })
    }
  }
)

app.get(
  '/createsport',
  connectEnsureLogin.ensureLoggedIn(),
  requirePublisher,
  async (request, response) => {
    response.render('AddSport', { csrfToken: request.csrfToken() })
  }
)

app.post(
  '/createsport',
  connectEnsureLogin.ensureLoggedIn(),
  requirePublisher,
  async (request, response) => {
    if (!request.body.sport_name) {
      request.flash('error', 'Sport name cannot be empty')
      return response.redirect('/createsport')
    }
    try {
      const sport = await Sport.addSports({
        sport_name: request.body.sport_name,
        userId: request.user.id
      })
      console.log(sport.sport_name)
      console.log(sport)
      const url = `/sportPage/${sport.id}`
      response.redirect(url)
    } catch (error) {
      console.log(error)
      request.flash('error', error.errors[0].message)
      response.redirect('/createsport')
    }
  }
)
app.get(
  '/sportPage/:id',
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(request.params.id)
    const current_sport = await Sport.getSportById(request.params.id)
    console.log(current_sport.sport_name)
    const sessionDetails = await Session.getSessions(request.user.id)
    const userid = request.user.id
    const getUser = await User.addUser(request.user)
    response.render('sportPage', {
      current_sport,
      sessionDetails,
      userid,
      getUser: request.user,
      csrfToken: request.csrfToken()
    })
  }
)
app.get(
  '/sportsession/:sport_name',
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const sportDetails = await User.getAllUsers()
    const current_sport_name = request.params.sport_name
    response.render('createSession', {
      sportDetails,
      current_sport_name,
      csrfToken: request.csrfToken()
    })
  }
)
app.post(
  '/sportsession',
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const s_name = await Sport.getSportByName(request.body.name)
    const url = `/sportsession/${request.body.name}`
    if (!request.body.time) {
      request.flash('error', 'Please provide a valid date and time')
      return response.redirect(url)
    }
    if (!request.body.venue) {
      request.flash('error', 'Please provide a valid venue')
      return response.redirect(url)
    }
    if (!request.body.players || typeof request.body.players !== 'string') {
      request.flash('error', 'Invalid format for players list')
      return response.redirect(url)
    }
    if (!request.body.playerCount) {
      request.flash(
        'error',
        'Please enter the number of extra players required'
      )
      return response.redirect(url)
    }

    try {
      const session = await Session.addSession({
        time: request.body.time,
        venue: request.body.venue,
        players: request.body.players.split(','),
        playerCount: request.body.playerCount,
        status: true,
        userId: request.user.id,
        sportId: s_name.id
      })

      const url2 = `/sportPage/${s_name.id}`
      console.log(session)
      response.redirect(url2)
    } catch (error) {
      console.log(error)
      request.flash('error', error.message)
      response.redirect(url)
    }
  }
)

app.get('/sessionPage/:id', async (request, response) => {
  const sessionId = request.params.id
  console.log(sessionId)
  const sessionDetails = await Session.getSessionById(sessionId)
  const sportId = sessionDetails.sportId
  const current_sport = await Sport.getSportById(sportId)
  const userid = request.user.id
  const user = request.user

  response.render('showSessionPage', {
    current_sport,
    sessionDetails,
    userid,
    sessionId,
    user,
    getUser: request.user,
    csrfToken: request.csrfToken()
  })
})

app.post('/join-session', async (req, res) => {
  const { sessionId } = req.body
  const user = req.user
  console.log('inside join-session......')
  try {
    const session = await Session.findByPk(sessionId)
    if (!session) {
      return res.status(404).send('Session not found')
    }
    if (!session.players.includes(user.firstname)) {
      console.log('hello.....')
      console.log(user.firstname)
      console.log(session)
      session.players.push(user.firstname)
      session.playerCount--
      session.changed('players', true)

      await session.save()
    }
    return res.redirect(`/sessionPage/${session.sportId}`)
  } catch (error) {
    console.error('Error joining session:', error)
    return res.status(500).send('Internal Server Error')
  }
})

app.post('/leave-session', async (req, res) => {
  const { sessionId } = req.body
  const user = req.user
  console.log('inside leave-session......')
  try {
    const session = await Session.findByPk(sessionId)
    if (!session) {
      return res.status(404).send('Session not found')
    }
    const index = session.players.indexOf(user.firstname)
    if (index > -1) {
      session.players.splice(index, 1)
      session.playerCount++
      session.changed('players', true)
      await session.save()
    }
    return res.redirect(`/sessionPage/${session.sportId}`)
  } catch (error) {
    console.error('Error leaving session:', error)
    return res.status(500).send('Internal Server Error')
  }
})
app.post(
  '/delete-session',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const { sessionId, cancellationReason } = req.body
    const userId = req.user.id
    try {
      const session = await Session.findByPk(sessionId)
      if (!session) {
        return res.status(404).send('Session not found')
      }
      if (session.userId !== userId) {
        return res
          .status(403)
          .send('You are not authorized to delete this session')
      }
      session.cancellationReason = cancellationReason
      await session.destroy()
      return res.redirect(`/sportPage/${session.sportId}`)
    } catch (error) {
      console.error('Error deleting session:', error)
      return res.status(500).send('Internal Server Error')
    }
  }
)
app.get(
  '/viewReports',
  connectEnsureLogin.ensureLoggedIn(),
  requirePublisher,
  async (req, res) => {
    const sessionDetails = await Session.getSessions(req.user.id)
    const getUser = await User.getUser(request.user)
    const sport = await Sport.getSports(request.params)
    const sportName = req.params.sport_name
    console.log('this is sport....', sport.sport_name)
    res.render('viewReports', {
      sessionDetails,
      getUser,
      sport,
      sportName,
      sportID: sport.id,
      csrfToken: req.csrfToken()
    })
  }
)

app.get(
  '/change-password',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    res.render('resetPassword', {
      csrfToken: req.csrfToken()
    })
  }
)

app.post(
  '/change-password',
  connectEnsureLogin.ensureLoggedIn(),
  [
    check('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    check('newPassword').notEmpty().withMessage('New password is required'),
    check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm new password is required'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match')
      }
      return true
    })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('change-password', {
        csrfToken: req.csrfToken(),
        errors: errors.array()
      })
      return
    }
    try {
      const user = req.user
      const isMatch = await user.comparePassword(req.body.currentPassword)

      if (!isMatch) {
        res.render('change-password', {
          csrfToken: req.csrfToken(),
          error: 'Current password is incorrect'
        })
        return
      }
      user.password = req.body.newPassword
      await user.save()
      res.redirect('/')
    } catch (error) {
      console.error(error)
      res.render('error', { error })
    }
  }
)

module.exports = app
