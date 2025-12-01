// -----------------------------
// SALVAR E PEGAR DADOS (LOCALSTORAGE)
// -----------------------------

const saveFormData = (accountType, stepData) => {
    const allData = JSON.parse(localStorage.getItem('cadastroData') || '{}');
    allData[accountType] = { ...allData[accountType], ...stepData };
    localStorage.setItem('cadastroData', JSON.stringify(allData));
};

const getFormData = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    return data;
};


// -----------------------------
//  CÓDIGO PRINCIPAL
// -----------------------------

document.addEventListener('DOMContentLoaded', () => {

    // Variáveis globais
    let currentAccountType = null;
    let currentStep = 0;
    const maxSteps = 4;

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



    // -----------------------------
    // VISIBILIDADE DOS PASSOS
    // -----------------------------
    const updateVisibility = () => {
        Object.values(steps).forEach(step => step?.classList.remove('active'));

        const key = currentStep === 0 ? '0' : `${currentAccountType}-${currentStep}`;
        steps[key]?.classList.add('active');

        backButton.style.display = currentStep > 0 ? 'block' : 'none';
    };


    // -----------------------------
    // NAVEGAÇÃO ENTRE PASSOS
    // (AGORA INCLUINDO O SALVAR DADOS)
    // -----------------------------
    const navigateToNextStep = () => {

        // Salva dados do passo ANTES de avançar
        if (currentStep > 0 && currentStep <= maxSteps) {
            const formId = `form${currentAccountType.charAt(0).toUpperCase() + currentAccountType.slice(1)}Passo${currentStep}`;
            const stepData = getFormData(formId);
            saveFormData(currentAccountType, stepData);
        }

        if (currentStep < maxSteps) {
            currentStep++;
            updateVisibility();
        } else if (currentStep === maxSteps) {
            // Último passo -> redirecionar
            window.location.href = 'itaworks.html';
        }
    };

    const navigateToPreviousStep = () => {
        if (currentStep > 0) {
            currentStep--;
        } else {
            currentStep = 0;
            currentAccountType = null;
        }
        updateVisibility();
    };

    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPreviousStep();
    });



    // -----------------------------
    // VALIDAÇÃO DE FORMULÁRIOS
    // -----------------------------
    const setupFormValidation = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const button = form.querySelector('button[type="submit"]');
        const requiredInputs = form.querySelectorAll('[required]');

        const checkFormValidity = () => {
            let allFilled = true;
            requiredInputs.forEach(input => {
                if (input.value.trim() === '') allFilled = false;
            });
            button.disabled = !allFilled;
        };

        requiredInputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('change', checkFormValidity);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            navigateToNextStep();
        });

        checkFormValidity();
    };



    // -----------------------------
    // PASSO 0 – SELEÇÃO DE TIPO DE CONTA
    // -----------------------------
    const selectionForm = document.getElementById('selectionForm');
    const radioInputs = selectionForm.querySelectorAll('input[name="accountType"]');
    const selectContinueButton = document.getElementById('selectContinueButton');

    const checkSelection = () => {
        const isSelected = [...radioInputs].some(i => i.checked);
        selectContinueButton.disabled = !isSelected;
    };

    radioInputs.forEach(input => input.addEventListener('change', checkSelection));

    selectionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedType = selectionForm.querySelector('input[name="accountType"]:checked').value;
        currentAccountType = selectedType;
        currentStep = 1;
        updateVisibility();
    });



    // -----------------------------
    // SELECTS DE DATA / ANO
    // -----------------------------
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
        const dia = document.getElementById(diaId);
        const mes = document.getElementById(mesId);

        if (dia) {
            for (let i = 1; i <= 31; i++) {
                const o = document.createElement('option');
                o.value = o.textContent = i.toString().padStart(2, '0');
                dia.appendChild(o);
            }
        }

        if (mes) {
            ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
                .forEach((nome, i) => {
                    const o = document.createElement('option');
                    o.value = (i + 1).toString().padStart(2, '0');
                    o.textContent = nome;
                    mes.appendChild(o);
                });
        }

        populateYearSelect(anoId, 1950);
    };

    populateDateSelects('dia', 'mes', 'ano');
    populateYearSelect('anoFundacao', 1900);



    // -----------------------------
    // APLICAR VALIDAÇÃO EM TODOS OS FORMS
    // -----------------------------
    const formIds = [
        'formCandidatoPasso1', 'formCandidatoPasso2', 'formCandidatoPasso3', 'formCandidatoPasso4',
        'formEmpresaPasso1', 'formEmpresaPasso2', 'formEmpresaPasso3', 'formEmpresaPasso4'
    ];

    formIds.forEach(id => setupFormValidation(id));


    // Inicia na tela 0
    updateVisibility();
});
