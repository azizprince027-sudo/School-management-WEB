let currentRole = 'admin';

    function selectRole(role){
    currentRole = role;
    document.querySelectorAll('.role-tabs button').forEach(b=>b.classList.toggle('active', b.dataset.role===role));
    document.querySelectorAll('.role-fields').forEach(f=>f.style.display='none');
    document.getElementById('fields-'+role).style.display='block';
    }

    function login(){
    document.getElementById('login-screen').style.display='none';
    const dash = document.getElementById('dashboard');
    dash.classList.add('show');

    document.querySelectorAll('[data-space]').forEach(s=> s.style.display='none');
    document.getElementById('nav-admin').style.display='none';
    document.getElementById('nav-prof').style.display='none';
    document.getElementById('nav-etudiant').style.display='none';

    const spaceMap = {admin:'admin', prof:'prof', etudiant:'etudiant'};
    const labelMap = {admin:'Administrateur', prof:'Professeur', etudiant:'Étudiant'};
    const nameMap  = {admin:'Admin', prof:'Mme Kouadio', etudiant:'KOFFI Aya'};

    document.querySelector('[data-space="'+spaceMap[currentRole]+'"]').style.display='block';
    document.getElementById('nav-'+spaceMap[currentRole]).style.display='block';
    document.getElementById('role-pill').textContent = currentRole;
    document.getElementById('who-role').textContent = labelMap[currentRole];
    document.getElementById('who-name').textContent = nameMap[currentRole];
    document.getElementById('avatar').textContent = nameMap[currentRole].charAt(0);
    }

    function showView(space, viewId, btn){
    document.querySelectorAll('[data-space="'+space+'"] .view').forEach(v=>v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    btn.parentElement.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
    }

    function logout(){
    document.getElementById('dashboard').classList.remove('show');
    document.getElementById('login-screen').style.display='grid';
    }