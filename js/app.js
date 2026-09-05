import {
  validateComplaint,
  normalizeComplaint,
  filterComplaints,
  createProtocol,
  formatComplaintDescription,
} from './complaints.js';
import { createComplaintApi } from './supabase.js';

const SUPABASE_URL = 'https://acjgeiavokkgodhhamak.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_dokMtF0DO0gDX1Pbvhy-3Q_SvbjokxM';
const complaintApi = createComplaintApi({ url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY });

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

const fieldLabels = {
  service: 'serviço',
  description: 'descrição',
  email: 'e-mail',
};

const form = document.querySelector('#complaint-form');
const list = document.querySelector('#complaints-list');
const emptyState = document.querySelector('#empty-state');
const formError = document.querySelector('#form-error');
const formSuccess = document.querySelector('#form-success');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
let currentFilter = 'todos';
let complaints = [];

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
  const items = filterComplaints(complaints, currentFilter);
  list.innerHTML = items.map((item) => {
    const content = formatComplaintDescription(item.description);
    const title = content.title ? `<h3 class="complaint-card__title">${content.title}</h3>` : '';
    const paragraphs = content.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');

    return `
      <article class="complaint-card">
        <div class="complaint-card__meta">
          <span>${escapeHtml(serviceLabels[item.service] || 'Outro')}</span>
          <span>${escapeHtml(item.protocol)}</span>
        </div>
        <div class="complaint-card__content">
          ${title}
          ${paragraphs}
        </div>
        <div class="complaint-card__bottom">
          <span>${escapeHtml(item.displayName || 'Anônimo')}${item.waitTime ? ` · ${escapeHtml(waitLabels[item.waitTime] || item.waitTime)}` : ''}</span>
          <span class="local-badge">PUBLICADO</span>
        </div>
      </article>
    `;
  }).join('');
  emptyState.hidden = items.length > 0;
}

async function refreshComplaints() {
  try {
    complaints = await complaintApi.listApproved();
    renderComplaints();
  } catch (error) {
    console.error(error);
    complaints = [];
    renderComplaints();
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.hidden = true;
    formSuccess.hidden = true;

    const values = Object.fromEntries(new FormData(form).entries());
    values.consent = form.elements.consent.checked;
    const result = validateComplaint(values);

    if (!result.valid) {
      const labels = result.errors.map((field) => fieldLabels[field] || field).join(' e ');
      formError.textContent = `Revise ${labels}. Desta vez, a pendência é real e está claramente indicada.`;
      formError.hidden = false;
      form.querySelector(`[name="${result.errors[0]}"]`)?.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const complaint = normalizeComplaint(values, createProtocol());
      await complaintApi.submit(complaint);
      form.reset();
      formSuccess.innerHTML = `<strong>Relato registrado para moderação.</strong> Protocolo ${escapeHtml(complaint.protocol)}. Ele só aparece publicamente depois de ser aprovado.`;
      formSuccess.hidden = false;
      currentFilter = 'todos';
      filterButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.filter === 'todos'));
    } catch (error) {
      console.error(error);
      formError.textContent = 'Não foi possível registrar o relato agora. Tente novamente em instantes.';
      formError.hidden = false;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
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

refreshComplaints();
