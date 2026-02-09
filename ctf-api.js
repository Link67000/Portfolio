// ===================================
// CTF PLATFORMS API INTEGRATION
// ===================================

// CONFIGURATION - Vos identifiants
const CONFIG = {
    tryhackme: {
        username: 'Link67000',
    },
    hackthebox: {
        studentId: 'HTB-A0A9A3C1BA', // Votre Student ID HTB Academy
        userId: '1489700', // Votre user ID HTB Academy
    }
};

// ===================================
// TRYHACKME API (avec proxy CORS)
// ===================================

async function fetchTryHackMeData() {
    const username = CONFIG.tryhackme.username;
    
    if (username === 'VOTRE_USERNAME_THM') {
        displayTHMPlaceholder();
        return;
    }

    try {
        // Utilisation d'un proxy CORS pour contourner les restrictions
        // Plusieurs proxies disponibles en cas de panne
        const proxies = [
            `https://api.allorigins.win/raw?url=`,
            `https://corsproxy.io/?`,
            `https://api.codetabs.com/v1/proxy?quest=`
        ];
        
        // Nouvelle API endpoint de TryHackMe
        const apiUrl = `https://tryhackme.com/api/v2/public-stats?username=${username}`;
        
        let data = null;
        let lastError = null;
        
        // Essayer chaque proxy jusqu'à ce qu'un fonctionne
        for (const proxy of proxies) {
            try {
                const response = await fetch(proxy + encodeURIComponent(apiUrl));
                
                if (response.ok) {
                    const text = await response.text();
                    data = JSON.parse(text);
                    break; // Sortir de la boucle si succès
                }
            } catch (error) {
                lastError = error;
                console.log(`Proxy ${proxy} failed, trying next...`);
                continue;
            }
        }
        
        if (data) {
            displayTryHackMeStats(data);
            displayTryHackMeRooms(data);
        } else {
            throw lastError || new Error('Tous les proxies ont échoué');
        }
        
    } catch (error) {
        console.error('Erreur TryHackMe:', error);
        // Afficher des stats par défaut si l'API ne fonctionne pas
        displayTHMFallback();
    }
}

function displayTryHackMeStats(data) {
    // Afficher les stats principales depuis la nouvelle API
    document.getElementById('thm-rank').textContent = data.userRank || data.rank || '-';
    document.getElementById('thm-points').textContent = (data.points || 0).toLocaleString();
    document.getElementById('thm-rooms').textContent = data.completedRooms?.length || data.roomsCompleted || 0;
    
    // Compter les badges
    const badgesCount = data.badges?.length || 0;
    document.getElementById('thm-badges').textContent = badgesCount;
}

function displayTryHackMeRooms(data) {
    const roomsList = document.getElementById('thm-rooms-list');
    
    // Récupérer les rooms complétées
    const rooms = data.completedRooms || data.rooms || [];
    
    if (rooms.length === 0) {
        // Si pas de rooms dans l'API, afficher le profil
        roomsList.innerHTML = `
            <div class="module-card">
                <div class="module-card-image">🚪</div>
                <div class="module-card-title">Consultez mon profil TryHackMe</div>
                <div class="module-card-meta">
                    <span class="module-sections">Rooms complétées : ${data.roomsCompleted || 0}</span>
                </div>
            </div>
        `;
        return;
    }

    // Afficher les 20 premières rooms
    roomsList.innerHTML = rooms.slice(0, 20).map(room => {
        const roomName = room.name || room.title || 'Room';
        const difficulty = room.difficulty || '';
        
        return `
            <div class="module-card">
                <div class="module-card-image">🚪</div>
                <div class="module-card-title">${roomName}</div>
                <div class="module-card-meta">
                    ${difficulty ? `<span class="module-difficulty-badge" style="background-color: ${getDifficultyColorTHM(difficulty)}; color: #0a0a0a">${difficulty}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getDifficultyColorTHM(difficulty) {
    const colors = {
        'easy': 'rgba(34, 197, 94, 0.6)',
        'medium': 'rgba(234, 179, 8, 0.6)',
        'hard': 'rgba(239, 68, 68, 0.6)',
        'Easy': 'rgba(34, 197, 94, 0.6)',
        'Medium': 'rgba(234, 179, 8, 0.6)',
        'Hard': 'rgba(239, 68, 68, 0.6)'
    };
    return colors[difficulty] || 'rgba(156, 163, 175, 0.6)';
}

function displayTHMPlaceholder() {
    document.getElementById('thm-rank').textContent = 'N/A';
    document.getElementById('thm-points').textContent = 'N/A';
    document.getElementById('thm-rooms').textContent = 'N/A';
    document.getElementById('thm-badges').textContent = 'N/A';
    
    document.getElementById('thm-rooms-list').innerHTML = `
        <div class="error-message">
            ⚠️ Configurez votre username TryHackMe dans le fichier <code>ctf-api.js</code>
        </div>
    `;
}

function displayTHMFallback() {
    // Données de secours si l'API ne fonctionne pas
    document.getElementById('thm-rank').textContent = 'Voir profil';
    document.getElementById('thm-points').textContent = '-';
    document.getElementById('thm-rooms').textContent = '-';
    document.getElementById('thm-badges').textContent = '-';
    
    document.getElementById('thm-rooms-list').innerHTML = `
        <div class="module-card">
            <div class="module-card-image">🚪</div>
            <div class="module-card-title">L'API TryHackMe est temporairement indisponible</div>
            <div class="module-card-meta">
                <span class="module-sections">Consultez mon profil directement</span>
            </div>
        </div>
        <div class="module-card">
            <div class="module-card-image">ℹ️</div>
            <div class="module-card-title">Profil : Link67000</div>
            <div class="module-card-meta">
                <span class="module-sections">TryHackMe.com</span>
            </div>
        </div>
    `;
}

// ===================================
// HACKTHEBOX ACADEMY API
// ===================================

// Données extraites du transcript HTB Academy (01-02-2026)
const HTB_ACADEMY_DATA = {
    stats: {
        rank: 'Top 5%',
        pathsCompleted: 2,
        targetsCompromised: 205,
        modulesCompleted: 30,
        studentId: 'HTB-A0A9A3C1BA'
    },
    paths: [
        {
            name: 'Web Penetration Tester',
            modules: 20,
            difficulty: 'Medium',
            progress: 100
        },
        {
            name: 'Cracking into Hack the Box',
            modules: 3,
            difficulty: 'Easy',
            progress: 100
        }
    ],
    modules: [
        { name: 'Intro to Academy', sections: 8, difficulty: 'Fundamental', category: 'General', progress: 100 },
        { name: 'Hacking WordPress', sections: 16, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'Linux Fundamentals', sections: 30, difficulty: 'Fundamental', category: 'General', progress: 3.33 },
        { name: 'Network Enumeration with Nmap', sections: 12, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'File Transfers', sections: 10, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'SQL Injection Fundamentals', sections: 17, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Web Requests', sections: 8, difficulty: 'Fundamental', category: 'General', progress: 100 },
        { name: 'File Inclusion', sections: 11, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Introduction to Networking', sections: 21, difficulty: 'Fundamental', category: 'General', progress: 14.29 },
        { name: 'JavaScript Deobfuscation', sections: 11, difficulty: 'Easy', category: 'Defensive', progress: 100 },
        { name: 'Windows Fundamentals', sections: 14, difficulty: 'Fundamental', category: 'General', progress: 100 },
        { name: 'Attacking Web Applications with Ffuf', sections: 13, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'Login Brute Forcing', sections: 13, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'SQLMap Essentials', sections: 11, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'Introduction to Web Applications', sections: 17, difficulty: 'Fundamental', category: 'General', progress: 100 },
        { name: 'Getting Started', sections: 23, difficulty: 'Fundamental', category: 'Offensive', progress: 100 },
        { name: 'Broken Authentication', sections: 14, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Penetration Testing Process', sections: 15, difficulty: 'Fundamental', category: 'General', progress: 100 },
        { name: 'Cross-Site Scripting (XSS)', sections: 10, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'Vulnerability Assessment', sections: 17, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'Command Injections', sections: 12, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Using Web Proxies', sections: 15, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'Footprinting', sections: 21, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Shells & Payloads', sections: 17, difficulty: 'Medium', category: 'Offensive', progress: 47.06 },
        { name: 'Web Attacks', sections: 18, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Information Gathering - Web Edition', sections: 19, difficulty: 'Easy', category: 'Offensive', progress: 100 },
        { name: 'File Upload Attacks', sections: 11, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Server-side Attacks', sections: 19, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Session Security', sections: 14, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Web Service & API Attacks', sections: 13, difficulty: 'Medium', category: 'Offensive', progress: 100 },
        { name: 'Bug Bounty Hunting Process', sections: 6, difficulty: 'Easy', category: 'General', progress: 100 }
    ]
};

async function fetchHackTheBoxAcademyData() {
    const studentId = CONFIG.hackthebox.studentId;
    
    // Tentative de récupération via API (si disponible)
    // Note: HTB Academy n'a pas d'API publique documentée
    // On utilise les données du transcript
    
    try {
        // Si un jour HTB Academy expose une API publique, on pourra l'utiliser ici
        // const response = await fetch(`https://academy.hackthebox.com/api/student/${studentId}`);
        // Pour l'instant, on utilise les données locales
        
        displayHackTheBoxAcademyStats(HTB_ACADEMY_DATA);
        displayHackTheBoxAcademyModules(HTB_ACADEMY_DATA);
        
    } catch (error) {
        console.error('Erreur HTB Academy:', error);
        displayHackTheBoxAcademyStats(HTB_ACADEMY_DATA);
        displayHackTheBoxAcademyModules(HTB_ACADEMY_DATA);
    }
}

function displayHackTheBoxAcademyStats(data) {
    document.getElementById('htb-rank').textContent = data.stats.rank;
    document.getElementById('htb-points').textContent = data.stats.targetsCompromised;
    document.getElementById('htb-systems').textContent = `${data.stats.pathsCompleted} Paths`;
    document.getElementById('htb-modules').textContent = data.stats.modulesCompleted;
}

function displayHackTheBoxAcademyModules(data) {
    const modulesList = document.getElementById('htb-modules-list');
    
    // Filtrer uniquement les modules complétés à 100%
    const completedModules = data.modules.filter(m => m.progress === 100);
    
    if (completedModules.length === 0) {
        modulesList.innerHTML = '<div class="loading-message">Aucun module complété</div>';
        return;
    }

    modulesList.innerHTML = completedModules.map(module => `
        <div class="module-card">
            <div class="module-card-image">
                ${getModuleIcon(module.category)}
            </div>
            <div class="module-card-title">${module.name}</div>
            <div class="module-card-meta">
                <span class="module-difficulty-badge" style="background-color: ${getHTBDifficultyColor(module.difficulty)}; color: ${getDifficultyTextColor(module.difficulty)}">
                    ${module.difficulty}
                </span>
                <span class="module-sections">${module.sections} sections</span>
            </div>
        </div>
    `).join('');
}

function getModuleIcon(category) {
    const icons = {
        'Offensive': '⚔️',
        'Defensive': '🛡️',
        'General': '📚',
        'Web': '🌐'
    };
    return icons[category] || '📖';
}

function getDifficultyTextColor(difficulty) {
    const darkDifficulties = ['Easy', 'Fundamental'];
    return darkDifficulties.includes(difficulty) ? '#0a0a0a' : '#e4e4e7';
}

function getHTBDifficultyColor(difficulty) {
    const colors = {
        'Fundamental': 'rgba(59, 130, 246, 0.2)',
        'Easy': 'rgba(34, 197, 94, 0.2)',
        'Medium': 'rgba(234, 179, 8, 0.2)',
        'Hard': 'rgba(239, 68, 68, 0.2)',
        'Offensive': 'rgba(239, 68, 68, 0.2)',
        'Defensive': 'rgba(59, 130, 246, 0.2)',
        'General': 'rgba(156, 163, 175, 0.2)'
    };
    return colors[difficulty] || 'rgba(255, 255, 255, 0.05)';
}

function displayHackTheBoxData() {
    fetchHackTheBoxAcademyData();
}

function displayHTBPlaceholder() {
    // Plus nécessaire car on a les vraies données
}

// ===================================
// INITIALISATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Charger les données uniquement si on est sur la page CTF
    if (window.location.pathname.includes('CTF.html')) {
        fetchTryHackMeData();
        displayHackTheBoxData();
    }
});