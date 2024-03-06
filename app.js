const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const http = require("http");
const User = require("../Backend/models/user")
const config = require("./config/dbconnection.json");
const userRouter = require("./routes/user");
const chatRoomRouter = require("./routes/chat");
const messageRouter = require("./routes/messages");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const app = express();


app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB
mongoose.connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your frontend URL
  }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/user', userRouter);
app.use('/chat', chatRoomRouter);
app.use('/messages', messageRouter);

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

passport.use(new GoogleStrategy({
  clientID: "895390000373-tboh2opauhrslulnr60d5p58v8qdhbhs.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3000/auth/google/callback"
},

async (accessToken, refreshToken, profile, done) => {
  try {
    // Recherchez l'utilisateur dans la base de données par son ID Google unique
    let user = await User.findOne({ googleId: profile.id });

    // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec les informations du profil Google
    if (!user) {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value
        // Vous pouvez ajouter d'autres champs d'utilisateur si nécessaire
      });
      await user.save();
    }
    
    // Renvoie l'utilisateur trouvé ou créé
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
app.post('/api/login/google', (req, res) => {
  const token = req.body.access_token;
  
  // Traitez le jeton dans le backend comme nécessaire
  console.log("Jetons d'authentification reçu:", token);
  
  // Vous pouvez également utiliser le jeton pour valider l'utilisateur et générer un jeton JWT
  // Puis renvoyez une réponse appropriée au frontend
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirigez l'utilisateur après une connexion réussie
    res.redirect('/');
  }
);


// Server setup
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));  //.env

module.exports = app;
