import { messages } from './locales/ui.js?v=20260922-4';
import { installation, localizedPrompts } from './locales/prompts.js?v=20260922-4';

const requested = new URL(location.href).searchParams.get('lang')?.toLowerCase().split('-')[0];
export const language = ['zh', 'ja', 'en'].includes(requested) ? requested : 'zh';
export const t = (text) => messages[text]?.[language] ?? text;
export const installPrompt = installation[language];
export const prompts = localizedPrompts[language];

export function initLanguage() {
  document.documentElement.lang = { zh: 'zh-CN', ja: 'ja', en: 'en' }[language];
  document.title = t(document.title);
  if (language !== 'zh') {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }
    for (const node of nodes) {
      if (node.parentElement.closest('script, style, pre, .language-switch')) {
        continue;
      }
      const text = node.textContent.trim();
      if (text && messages[text]) {
        node.textContent = node.textContent.replace(text, t(text));
      }
    }
    for (const el of document.querySelectorAll('[alt], [title], [aria-label]')) {
      for (const attr of ['alt', 'title', 'aria-label']) {
        const value = el.getAttribute(attr);
        if (value) {
          el.setAttribute(attr, t(value));
        }
      }
    }
    document.getElementById('install-code-pre').textContent = installPrompt;
    const brand = document.querySelector('.brand');
    const wordmark = document.createElement('span');
    wordmark.className = 'localized-brand';
    const mark = document.createElement('img');
    mark.src = new URL('./assets/brand-mark.svg', import.meta.url).href;
    mark.alt = '';
    wordmark.append(mark, document.createTextNode('Feishu Base'));
    brand.replaceWith(wordmark);
  }
  const picker = document.getElementById('language-select');
  const menu = document.getElementById('language-menu');
  const wrapper = picker.parentElement;
  const items = [...menu.querySelectorAll('[data-language]')];
  picker.querySelector('.language-current').textContent = { zh: '中文', ja: '日本語', en: 'English' }[
    language
  ];
  picker.setAttribute(
    'aria-label',
    { zh: '切换语言', ja: '言語を切り替える', en: 'Change language' }[language],
  );
  for (const item of items) {
    const url = new URL(location.href);
    url.searchParams.set('lang', item.dataset.language);
    item.href = url.href;
    item.setAttribute('aria-checked', String(item.dataset.language === language));
    item.prepend(picker.querySelector('svg').cloneNode(true));
  }
  const close = (restoreFocus = false) => {
    menu.hidden = true;
    picker.setAttribute('aria-expanded', 'false');
    if (restoreFocus) picker.focus();
  };
  const open = (index = items.findIndex((item) => item.dataset.language === language)) => {
    menu.hidden = false;
    picker.setAttribute('aria-expanded', 'true');
    items[index].focus();
  };
  picker.addEventListener('click', () => (menu.hidden ? open() : close()));
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(event.key === 'ArrowUp' ? items.length - 1 : 0);
    }
  });
  menu.addEventListener('keydown', (event) => {
    const index = items.indexOf(document.activeElement);
    const next = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index + items.length - 1) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      items[next].focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') {
      close(true);
    } else if (event.key === ' ') {
      event.preventDefault();
      items[index]?.click();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!wrapper.contains(event.target)) close();
  });
  wrapper.addEventListener('focusout', (event) => {
    if (!wrapper.contains(event.relatedTarget)) close();
  });
}
