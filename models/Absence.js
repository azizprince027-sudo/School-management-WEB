class Absence {
        constructor(id, studentId, date, status) {
            this.id = id;
            this.studentId = studentId;
            this.date = date;
            this.status = status; // 'justifiee' ou 'non_justifiee'
        }
        
        justifier() {
            this.status = "justifiee";
        }
    }
    module.exports = Absence;