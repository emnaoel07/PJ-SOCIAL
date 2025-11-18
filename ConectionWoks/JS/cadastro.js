document.addEventListener('DOMContentLoaded', () => {
    // Variáveis de controle de estado
    let currentAccountType = null;
    let currentStep = 0; // 0 é a tela de seleção
    const maxSteps = 4; // Máximo de passos de cadastro

    // Elementos do DOM
    const steps = {
        '0': document.getElementById('step-0'),
        'candidato-1': document.getElementById('step-candidato-1'),
        'candidato-2': document.getElementById('step-candidato-2'),
        'candidato-3': document.getElementById('step-candidato-3'),
        'candidato-4': document.getElementById('step-candidato-4'),
        'empresa-1': document.getElementById('step-empresa-1'),
        'empresa-2': document.getElementById('step-empresa-2'),
        'empresa-3': document.getElementById('step-empresa-3'),
        'empresa-4': document.getElementById('step-empresa-4'),
    };
    const backButton = document.getElementById('backButton');

    // --- 1. FUNÇÕES DE NAVEGAÇÃO ---

    const updateVisibility = () => {
        // Esconde todos os passos
        Object.values(steps).forEach(step => {
            if (step) step.classList.remove('active');
        });

        let key = currentStep === 0 ? '0' : `${currentAccountType}-${currentStep}`;
        
        // Exibe o passo atual
        if (steps[key]) {
            steps[key].classList.add('active');
        }

        // Controla a visibilidade do botão de voltar
        if (currentStep > 0) {
            backButton.style.display = 'block';
        } else {
            backButton.style.display = 'none';
        }
    };

    const navigateToNextStep = () => {
        if (currentStep < maxSteps) {
            currentStep++;
            updateVisibility();
        } else if (currentStep === maxSteps) {
            alert('Cadastro finalizado! Pronto para o próximo passo (página de sucesso).');
            // Redirecionamento final
        }
    };

    const navigateToPreviousStep = () => {
        if (currentStep > 0) {
            currentStep--;
        } else {
            // Se estiver no primeiro passo (1), volta para a seleção (0)
            currentStep = 0;
            currentAccountType = null;
        }
        updateVisibility();
    };
    
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPreviousStep();
    });

    // --- 2. FUNÇÃO DE VALIDAÇÃO GERAL (ENABLE/DISABLE BUTTON) ---

    const setupFormValidation = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const button = form.querySelector('button[type="submit"]');
        // Seleciona todos os campos que possuem o atributo 'required'
        const requiredInputs = form.querySelectorAll('[required]');

        const checkFormValidity = () => {
            let allFilled = true;
            requiredInputs.forEach(input => {
                // Checa se o campo está vazio. Para selects, checa se a opção de placeholder (value="") está selecionada.
                if (input.value.trim() === '') {
                    allFilled = false;
                }
            });

            // Habilita ou desabilita o botão
            button.disabled = !allFilled;
        };

        // Adicionar listeners para checar a validade em tempo real
        requiredInputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('change', checkFormValidity);
        });

        // Submissão do formulário: avança para o próximo passo
        form.addEventListener('submit', (event) => {
             event.preventDefault();
             navigateToNextStep();
        });
        
        // Checagem inicial
        checkFormValidity();
    };

    // --- 3. CONFIGURAÇÃO DA TELA DE SELEÇÃO (PASSO 0) ---

    const selectionForm = document.getElementById('selectionForm');
    const radioInputs = selectionForm.querySelectorAll('input[name="accountType"]');
    const selectContinueButton = document.getElementById('selectContinueButton');

    const checkSelection = () => {
        const isSelected = Array.from(radioInputs).some(input => input.checked);
        selectContinueButton.disabled = !isSelected;
    };

    radioInputs.forEach(input => {
        input.addEventListener('change', checkSelection);
    });

    selectionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedType = selectionForm.querySelector('input[name="accountType"]:checked').value;
        currentAccountType = selectedType; // Define o tipo de conta
        currentStep = 1; // Vai para o primeiro passo do cadastro
        updateVisibility();
        // console.log(`Tipo de conta selecionado: ${selectedType}`);
    });


    // --- 4. PREENCHIMENTO DE SELECTS DE DATA/ANO (OPCIONAL) ---

    const populateYearSelect = (selectId, startYear) => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            select.appendChild(option);
        }
    };
    
    const populateDateSelects = (diaId, mesId, anoId) => {
        const diaSelect = document.getElementById(diaId);
        const mesSelect = document.getElementById(mesId);
        
        // Popula Dias (1 a 31)
        if (diaSelect) {
            for (let i = 1; i <= 31; i++) {
                const option = document.createElement('option');
                option.value = i.toString().padStart(2, '0');
                option.textContent = i.toString().padStart(2, '0');
                diaSelect.appendChild(option);
            }
        }

        // Popula Meses
        if (mesSelect) {
            const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            meses.forEach((nome, index) => {
                const option = document.createElement('option');
                option.value = (index + 1).toString().padStart(2, '0');
                option.textContent = nome;
                mesSelect.appendChild(option);
            });
        }
        
        // Popula Anos (chamando a função específica)
        populateYearSelect(anoId, 1950);
    };

    // Aplica o preenchimento:
    populateDateSelects('dia', 'mes', 'ano'); // Candidato
    populateYearSelect('anoFundacao', 1900); // Empresa

    // --- 5. APLICAÇÃO DA VALIDAÇÃO EM TODOS OS FORMULÁRIOS ---

    const formIds = [
        'formCandidatoPasso1', 'formCandidatoPasso2', 'formCandidatoPasso3', 'formCandidatoPasso4',
        'formEmpresaPasso1', 'formEmpresaPasso2', 'formEmpresaPasso3', 'formEmpresaPasso4'
    ];

    formIds.forEach(id => setupFormValidation(id));
});