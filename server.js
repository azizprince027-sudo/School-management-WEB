require('dotenv').config();
const express = require('express');
const session = require('express-session');

const { initDatabase } = require('./db/table.js');
const { notFoundHandler, errorHandler } = require('./middlewares/Errorhandle.middelewares.js');

const authRouter = require('./routes/Auth.routes.js');
const studentRouter = require('./routes/Student.Routes.js');
const teacherRouter = require('./routes/Teacher.Routes.js');
const subjectRouter = require('./routes/Subject.Routes.js');
const gradeRouter = require('./routes/Grade.Routes.js');
const absenceRouter = require('./routes/Absence.Routes.js');
const statsRouter = require('./routes/Stats.Routes.js');
const userRouter = require('./routes/User.Routes.js');

// Cree les tables si elles n'existent pas encore
initDatabase();

const server = express();
const PORT = process.env.PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Session : necessaire pour garder l'utilisateur connecte (admin/professeur/etudiant)

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET manquant dans le fichier .env');
}

server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24h
}));

// Fichiers statiques de l'interface graphique (HTML/CSS/JS du dossier public)
server.use(express.static(__dirname + '/public'));

// Routes de l'API
server.use('/auth', authRouter);
server.use('/students', studentRouter);
server.use('/teachers', teacherRouter);
server.use('/subjects', subjectRouter);
server.use('/grades', gradeRouter);
server.use('/absences', absenceRouter);
server.use('/stats', statsRouter);
server.use('/users', userRouter);

// 404 + gestion d'erreurs (toujours en dernier)
server.use(notFoundHandler);
server.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server lance sur ${process.env.SERVER_URL}${PORT}`);
});

module.exports = { server };