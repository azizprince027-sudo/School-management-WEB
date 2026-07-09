class Grade {
    // Le constructeur de la classe "Grade" est une fonction spéciale qui est appelée lors de la création d'une nouvelle instance de la classe. Il prend quatre paramètres : "id", "studentId", "subjectId" et "note". Ces paramètres sont utilisés pour initialiser les propriétés de l'objet "Grade". La propriété "id" représente l'identifiant unique de la note, "studentId" représente l'identifiant de l'étudiant auquel la note est associée, "subjectId" représente l'identifiant de la matière pour laquelle la note a été attribuée, et "note" représente la valeur de la note elle-même. De plus, le constructeur inclut une validation pour s'assurer que la note est comprise entre 0 et 20, ce qui est une exigence courante dans les systèmes éducatifs.
    constructor(id, studentId, subjectId, note) {
        if (note < 0 || note > 20) {
            throw new Error('La note doit etre comprise entre 0 et 20');
        }
        this.id = id;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.note = note;
    }
}
// La classe "Grade" représente une note attribuée à un étudiant pour une matière spécifique. Elle contient des propriétés pour stocker l'identifiant de la note, l'identifiant de l'étudiant, l'identifiant de la matière et la valeur de la note elle-même. Cette classe peut être utilisée pour créer des objets représentant les notes des étudiants, facilitant ainsi la gestion des évaluations dans l'application de gestion scolaire.
module.exports = Grade;