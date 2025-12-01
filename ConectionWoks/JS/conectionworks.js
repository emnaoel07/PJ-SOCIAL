 const APP = {
            currentTab: 'ai',
            profile: {
            name: 'Maria Silva',
            role: 'Desenvolvedora Full-stack Pleno',
            location: 'São Paulo, SP',
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL']
            },
            jobs: [
            {
                id: 1,
                title: 'Desenvolvedor Front-end Pleno',
                company: 'TechCorp Brasil',
                description: 'Desenvolvimento de interfaces modernas com React e TypeScript. Ambiente colaborativo e desafiador com foco em inovação.',
                skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'Git'],
                location: 'São Paulo, SP',
                distance: 3.2,
                level: 'pleno',
                score: 94
            },
            {
                id: 2,
                title: 'Desenvolvedor Back-end Node.js',
                company: 'FinTech Innovations',
                description: 'Desenvolvimento de APIs robustas e seguras para sistema financeiro de alta disponibilidade.',
                skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Microservices'],
                location: 'São Paulo, SP',
                distance: 5.8,
                level: 'pleno',
                score: 88
            },
            {
                id: 3,
                title: 'Desenvolvedor Mobile React Native',
                company: 'AppMakers',
                description: 'Desenvolvimento de aplicativos mobile multiplataforma para milhões de usuários.',
                skills: ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android'],
                location: 'São Paulo, SP',
                distance: 8.5,
                level: 'pleno',
                score: 82
            },
            {
                id: 4,
                title: 'Tech Lead Full-stack',
                company: 'Enterprise Solutions',
                description: 'Liderança de time de desenvolvimento e definição de arquitetura de soluções empresariais.',
                skills: ['JavaScript', 'Node.js', 'React', 'AWS', 'Leadership'],
                location: 'São Paulo, SP',
                distance: 12.3,
                level: 'senior',
                score: 75
            },
            {
                id: 5,
                title: 'DevOps Engineer',
                company: 'CloudFirst',
                description: 'Automação de infraestrutura e implementação de práticas DevOps em ambiente cloud-native.',
                skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Linux'],
                location: 'São Paulo, SP',
                distance: 15.7,
                level: 'pleno',
                score: 65
            }
            ]
        };

        function initApp() {
            loadProfile();
            renderContent();
            attachEventListeners();
        }

        function loadProfile() {
            const saved = localStorage.getItem('itaworks_profile');
            if (saved) {
            APP.profile = JSON.parse(saved);
            }
            updateProfileDisplay();
        }

        function updateProfileDisplay() {
            const initial = APP.profile.name.charAt(0).toUpperCase();
            document.getElementById('profileAvatar').textContent = initial;
            document.getElementById('profileBtn').textContent = initial;
            document.getElementById('profileName').textContent = APP.profile.name;
            document.getElementById('profileRole').textContent = APP.profile.role;
            document.getElementById('profileLocation').textContent = APP.profile.location;
            document.getElementById('profileSkills').innerHTML = APP.profile.skills.map(s => `<span class="tag">${s}</span>`).join('');
        }

        function attachEventListeners() {
            document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                APP.currentTab = btn.dataset.tab;
                renderContent();
            });
            });

            document.getElementById('editProfileBtn').addEventListener('click', openProfileModal);
            document.getElementById('profileBtn').addEventListener('click', openProfileModal);
            document.getElementById('closeProfileModal').addEventListener('click', closeModal);
            document.getElementById('closeJobModal').addEventListener('click', closeModal);
            document.getElementById('closeApplyModal').addEventListener('click', closeModal);

            // Redirect to cadastro.html when clicking "Sair"
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = '../../../Kaue/index.html';
            });

            document.querySelectorAll('.btn-terciary').forEach(btn => {
                btn.addEventListener('click', () => {
                    window.location.href = '../../../Kaue/index.html';
                });
            });
            }

            document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            APP.profile.name = document.getElementById('inputName').value;
            APP.profile.role = document.getElementById('inputRole').value;
            APP.profile.location = document.getElementById('inputLocation').value;
            APP.profile.skills = document.getElementById('inputSkills').value.split(',').map(s => s.trim());
            localStorage.setItem('itaworks_profile', JSON.stringify(APP.profile));
            updateProfileDisplay();
            closeModal();
            });

            document.getElementById('distanceFilter').addEventListener('input', (e) => {
            document.getElementById('distanceValue').textContent = e.target.value;
            });

            document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
            document.getElementById('searchInput').addEventListener('input', applyFilters);
        }

        function openProfileModal() {
            document.getElementById('inputName').value = APP.profile.name;
            document.getElementById('inputRole').value = APP.profile.role;
            document.getElementById('inputLocation').value = APP.profile.location;
            document.getElementById('inputSkills').value = APP.profile.skills.join(', ');
            document.getElementById('profileModal').classList.add('active');
        }

        function closeModal() {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        }

        function renderContent() {
            const feed = document.getElementById('feedContent');

            if (APP.currentTab === 'ai') {
            renderAIView(feed);
            } else if (APP.currentTab === 'jobs') {
            renderJobsView(feed);
            } else if (APP.currentTab === 'home') {
            renderJobsView(feed);
            } else if (APP.currentTab === 'network') {
            feed.innerHTML = '<div class="card"><h3>Minha Rede</h3><p>Funcionalidade em desenvolvimento.</p></div>';
            }
        }

        function renderAIView(feed) {
            const html = `
            <div class="ai-header">
                <h2>🚀 IA — Vagas Rápidas</h2>
                <p>Oportunidades personalizadas com base no seu perfil e localização</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                <div class="number">${APP.jobs.length}</div>
                <div class="label">Vagas Disponíveis</div>
                </div>
                <div class="stat-card">
                <div class="number">${APP.jobs.filter(j => j.score >= 80).length}</div>
                <div class="label">Alta Compatibilidade</div>
                </div>
            </div>
            ${APP.jobs.map(job => createJobCard(job, true)).join('')}
            `;
            feed.innerHTML = html;
            attachJobCardListeners();
        }

        function renderJobsView(feed) {
            const html = APP.jobs.map(job => createJobCard(job, false)).join('');
            feed.innerHTML = html;
            attachJobCardListeners();
        }

        function createJobCard(job, showMatch) {
            const commonSkills = job.skills.filter(s => APP.profile.skills.includes(s));

            return `
            <div class="card ${showMatch ? 'match-card' : ''} job-card" data-job-id="${job.id}">
                ${showMatch ? `<div class="match-score">${job.score}% compatível</div>` : ''}
                <h4>${job.title}</h4>
                <div class="company">${job.company}</div>
                <div class="description">${job.description}</div>
                <div class="meta">
                <span>📍 ${job.location}</span>
                <span>📏 ${job.distance} km</span>
                <span>📊 Nível ${job.level}</span>
                </div>
                ${showMatch ? `
                <div class="match-reasons">
                <strong>Por que essa vaga combina com você:</strong>
                <ul>
                    <li>${commonSkills.length} skills em comum: ${commonSkills.join(', ')}</li>
                    <li>Distância: ${job.distance} km de você</li>
                    <li>Nível ${job.level} compatível com seu perfil</li>
                </ul>
                </div>` : ''}
                <div class="tags">
                ${job.skills.map(skill => {
                    const highlight = APP.profile.skills.includes(skill) ? 'highlight' : '';
                    return `<span class="tag ${highlight}">${skill}</span>`;
                }).join('')}
                </div>
                <div class="actions">
                <button class="btn btn-secondary view-details-btn">Ver Detalhes</button>
                <button class="btn apply-btn" style="${showMatch ? 'background: var(--success-green);' : ''}">
                    ${showMatch ? '🚀 Candidatar Rápido' : 'Candidatar'}
                </button>
                </div>
            </div>
            `;
        }

        function attachJobCardListeners() {
            document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.job-card');
                const jobId = parseInt(card.dataset.jobId);
                showJobDetails(jobId);
            });
            });

            document.querySelectorAll('.apply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.job-card');
                const jobId = parseInt(card.dataset.jobId);
                showApplyModal(jobId);
            });
            });
        }

        function showJobDetails(jobId) {
            const job = APP.jobs.find(j => j.id === jobId);
            if (!job) return;

            const content = `
            <h3>${job.title}</h3>
            <p style="color: var(--text-light); margin-bottom: 16px;">${job.company}</p>
            <p style="margin-bottom: 16px;">${job.description}</p>
            <h4 style="margin-bottom: 8px;">Habilidades:</h4>
            <div class="tags" style="margin-bottom: 16px;">
                ${job.skills.map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
            <p><strong>Localização:</strong> ${job.location}</p>
            <p><strong>Distância:</strong> ${job.distance} km</p>
            <p style="margin-bottom: 16px;"><strong>Nível:</strong> ${job.level}</p>
            <button class="btn" onclick="showApplyModal(${job.id}); closeModal();">Candidatar-se</button>
            `;

            document.getElementById('jobDetailsContent').innerHTML = content;
            document.getElementById('jobModal').classList.add('active');
        }

        function showApplyModal(jobId) {
            const job = APP.jobs.find(j => j.id === jobId);
            if (!job) return;

            const content = `
            <p style="margin-bottom: 16px;">Você está se candidatando para <strong>${job.title}</strong> na empresa <strong>${job.company}</strong>.</p>
            <p style="margin-bottom: 16px;">Mensagem de candidatura:</p>
            <textarea style="width: 100%; min-height: 150px; padding: 8px; border: 1px solid var(--border-gray); border-radius: 4px; font-family: inherit; margin-bottom: 16px;">Olá ${job.company},

    Tenho interesse na vaga de ${job.title}. Possuo experiência em ${APP.profile.skills.filter(s => job.skills.includes(s)).join(', ')} e acredito que posso contribuir com o time.

    Atenciosamente,
    ${APP.profile.name}</textarea>
            <button class="btn" onclick="submitApplication(${job.id})">Enviar Candidatura</button>
            `;

            document.getElementById('applyContent').innerHTML = content;
            document.getElementById('applyModal').classList.add('active');
        }

        function submitApplication(jobId) {
            const job = APP.jobs.find(j => j.id === jobId);
            alert(`Candidatura enviada com sucesso para ${job.company}!`);
            closeModal();
        }

        function applyFilters() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            const skill = document.getElementById('skillFilter').value;
            const distance = parseInt(document.getElementById('distanceFilter').value);
            const sort = document.getElementById('sortFilter').value;

            let filtered = APP.jobs.filter(job => {
            const matchSearch = !search ||
                job.title.toLowerCase().includes(search) ||
                job.company.toLowerCase().includes(search) ||
                job.description.toLowerCase().includes(search);

            const matchSkill = !skill || job.skills.includes(skill);
            const matchDistance = job.distance <= distance;

            return matchSearch && matchSkill && matchDistance;
            });

            if (sort === 'distance') {
            filtered.sort((a, b) => a.distance - b.distance);
            } else if (sort === 'relevance') {
            filtered.sort((a, b) => b.score - a.score);
            }

            const feed = document.getElementById('feedContent');
            feed.innerHTML = filtered.map(job => createJobCard(job, APP.currentTab === 'ai')).join('');
            attachJobCardListeners();
        }

        window.showApplyModal = showApplyModal;
        window.submitApplication = submitApplication;
        window.closeModal = closeModal;

        document.addEventListener('DOMContentLoaded', initApp);