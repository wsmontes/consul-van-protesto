import {
  validateComplaint,
  normalizeComplaint,
  filterComplaints,
  saveComplaint,
  loadComplaints,
  createProtocol,
} from './complaints.js';

const serviceLabels = {
  passaporte: 'Passaporte',
  'registro-civil': 'Registro civil',
  procuracao: 'Procuração',
  documentos: 'Documentos',
  visto: 'Visto / migração',
  outros: 'Outro',
};

const waitLabels = {
  'ate-1-semana': 'até 1 semana',
  '2-semanas': '2 semanas',
  '3-semanas': '3–4 semanas',
  '1-3-meses': '1–3 meses',
  '3-mais-meses': '+3 meses',
};

const form = document.querySelector('#complaint-form');
const list = document.querySelector('#complaints-list');
const emptyState = document.querySelector('#empty-state');
const formError = document.querySelector('#form-error');
const formSuccess = document.querySelector('#form-success');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
let currentFilter = 'todos';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderComplaints() {
  if (!list || !emptyState) return;
  const items = filterComplaints(loadComplaints(localStorage), currentFilter);
  list.innerHTML = items.map((item) => `
    <article class="complaint-card">
      <div class="complaint-card__meta">
        <span>${escapeHtml(serviceLabels[item.service] || 'Outro')}</span>
        <span>${escapeHtml(item.protocol)}</span>
      </div>
      <blockquote>“${escapeHtml(item.description)}”</blockquote>
      <div class="complaint-card__bottom">
        <span>${escapeHtml(item.displayName || 'Anônimo')}${item.waitTime ? ` · ${escapeHtml(waitLabels[item.waitTime] || item.waitTime)}` : ''}</span>
        <span class="local-badge">PRÉVIA LOCAL</span>
      </div>
    </article>
  `).join('');
  emptyState.hidden = items.length > 0;
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formError.hidden = true;
    formSuccess.hidden = true;

    const values = Object.fromEntries(new FormData(form).entries());
    values.consent = form.elements.consent.checked;
    const result = validateComplaint(values);

    if (!result.valid) {
      const labels = result.errors.map((field) => field === 'service' ? 'serviço' : 'descrição').join(' e ');
      formError.textContent = `Faltou preencher ${labels}. Desta vez, a pendência é real e está claramente indicada.`;
      formError.hidden = false;
      form.querySelector(`[name="${result.errors[0]}"]`)?.focus();
      return;
    }

    const complaint = normalizeComplaint(values, createProtocol());
    saveComplaint(complaint, localStorage);
    form.reset();
    formSuccess.innerHTML = `<strong>Relato registrado neste navegador.</strong> Protocolo ${escapeHtml(complaint.protocol)}. Nesta versão, nada foi enviado a um servidor nem publicado.`;
    formSuccess.hidden = false;
    currentFilter = 'todos';
    filterButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.filter === 'todos'));
    renderComplaints();
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter || 'todos';
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    renderComplaints();
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const counter = document.querySelector('#protocol-counter');
if (counter) {
  const seed = Math.floor(8000 + Math.random() * 900);
  counter.textContent = String(seed);
}

renderComplaints();
