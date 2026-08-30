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
const logsRouter = require('./routes/Logs.Routes.js');

const server = express();
const PORT = process.env.PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET manquant dans le fichier .env');
}

server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24h
}));

server.use(express.static(__dirname + '/public'));

server.use('/auth', authRouter);
server.use('/students', studentRouter);
server.use('/teachers', teacherRouter);
server.use('/subjects', subjectRouter);
server.use('/grades', gradeRouter);
server.use('/absences', absenceRouter);
server.use('/stats', statsRouter);
server.use('/users', userRouter);
server.use('/logs', logsRouter);
server.use(notFoundHandler);
server.use(errorHandler);

// On démarre le serveur SEULEMENT une fois les tables confirmées prêtes
async function demarrer() {
    try {
        await initDatabase();
        server.listen(PORT, () => {
            console.log(`Server lance sur ${process.env.SERVER_URL}${PORT}`);
        });
    } catch (err) {
        console.error('❌ Impossible de demarrer : initialisation de la base echouee.', err);
        process.exit(1);
    }
}

demarrer();

module.exports = { server };