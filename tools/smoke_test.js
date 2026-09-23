#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const shell = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const partPaths = Array.from({ length: 13 }, (_, index) => path.join(root, `game-v9-part${String(index).padStart(2, '0')}.txt`));
const baseHtml = partPaths.every(fs.existsSync)
  ? partPaths.map(file => fs.readFileSync(file, 'utf8')).join('')
  : shell;
const expansionPaths = ['worldtour-expansion.js', 'approved-scenes.js', 'stage-foods.js', 'performance-patch.js', 'developer-stage.js'];
const closingIife = '})();';
const injectionPoint = baseHtml.lastIndexOf(closingIife);
if (injectionPoint < 0) throw new Error('Game injection point not found');
const expansions = expansionPaths.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
const html = baseHtml.slice(0, injectionPoint) + expansions + '\n' + baseHtml.slice(injectionPoint);
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
if (!script) throw new Error('Inline game script not found');

const nodes = new Map();
const gradient = () => ({ addColorStop() {} });
const context = new Proxy({
  createLinearGradient: gradient,
  createRadialGradient: gradient,
  getImageData: () => ({ data: new Uint8ClampedArray(0) }),
  putImageData() {},
}, {
  get(target, key) {
    if (key in target) return target[key];
    if (typeof key === 'symbol') return target[key];
    return () => {};
  },
  set(target, key, value) {
    target[key] = value;
    return true;
  },
});

function makeNode(selector = '') {
  const classes = new Set(selector === '#hud' ? ['hidden'] : []);
  return {
    style: {},
    hidden: false,
    classList: {
      add: value => classes.add(value),
      remove: value => classes.delete(value),
      contains: value => classes.has(value),
    },
    addEventListener() {},
    appendChild() {},
    insertBefore() {},
    setAttribute() {},
    setPointerCapture() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 108, height: 108 }),
    getContext: () => context,
    textContent: '',
    disabled: false,
    title: '',
  };
}

const document = {
  addEventListener() {},
  querySelector(selector) {
    if (!nodes.has(selector)) nodes.set(selector, makeNode(selector));
    return nodes.get(selector);
  },
  getElementById(id) {
    return this.querySelector(`#${id}`);
  },
  createElement(tag) {
    return makeNode(tag);
  },
};

class MockImage {
  constructor() {
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
  }

  set src(value) {
    this._src = value;
    const cleanValue = value.split(/[?#]/, 1)[0].replace(/^\/+/, '');
    const exists = value.startsWith('data:') || fs.existsSync(path.join(root, cleanValue));
    this.complete = true;
    this.naturalWidth = exists ? 512 : 0;
    this.naturalHeight = exists ? 512 : 0;
    queueMicrotask(() => (exists ? this.onload?.() : this.onerror?.()));
  }

  get src() {
    return this._src;
  }
}

let frame;
const storage = new Map();
const sandbox = {
  console,
  document,
  Image: MockImage,
  WeakMap,
  Math,
  Promise,
  queueMicrotask,
  innerWidth: 390,
  innerHeight: 844,
  devicePixelRatio: 1,
  matchMedia: () => ({ matches: true }),
  location: { search: process.argv.includes('--dev') ? '?dev=1&stage=tokyo' : '' },
  URLSearchParams,
  addEventListener() {},
  requestAnimationFrame(callback) { frame = callback; },
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
  },
};

vm.createContext(sandbox);
vm.runInContext(script, sandbox, { filename: 'index.html' });

setImmediate(() => {
  const play = nodes.get('#play');
  if (play.disabled) throw new Error('Art preload did not finish');
  if (play.textContent !== 'PLAY') throw new Error(play.textContent || 'Art asset missing');
  play.onclick();
  frame?.(16);
  frame?.(32);
  if (nodes.get('#stage').textContent !== 'Gull') throw new Error('Initial stage mismatch');
  if (!/\d+ \/ 15/.test(nodes.get('#xpText').textContent)) throw new Error('Evolution interval mismatch');
  if (!nodes.get('#overlay').hidden) throw new Error('Play overlay stayed open');
  if (nodes.get('#hud').hidden) throw new Error('HUD stayed hidden');
  if (/Young Gull|Falcon/.test(script)) throw new Error('Removed characters remain active');
  if (process.argv.includes('--dev')) {
    if (sandbox.gullRunDev.currentStage() !== '9. TOKYO') throw new Error('Developer start at Tokyo failed');
    if (!nodes.get('.tip').textContent.includes('TOKYO')) throw new Error('HUD did not update after starting Tokyo');
    if (!sandbox.gullRunDev.jumpTo('ROME') || sandbox.gullRunDev.currentStage() !== '5. ROME') throw new Error('Developer jump to Rome failed');
    if (!nodes.get('.tip').textContent.includes('ROME')) throw new Error('HUD did not update after jumping to Rome');
    frame?.(48);
    if (!sandbox.gullRunDev.jumpTo(1) || sandbox.gullRunDev.currentStage() !== '1. COAST') throw new Error('Developer return to Coast failed');
    if (sandbox.gullRunDev.jumpTo('unknown')) throw new Error('Invalid developer stage accepted');
    if (nodes.get('#xpText').textContent !== '0 / 15') throw new Error('Developer jump did not reset evolution');
    console.log('Gull Run developer stage test passed: start at Tokyo, jump to Rome and Coast, reset evolution.');
    return;
  }
  if (sandbox.gullRunDev) throw new Error('Developer control leaked into the normal game');
  console.log('Gull Run smoke test passed: assets load, game starts, frames render, progression is 15 meals.');
});
