#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
if (!script) throw new Error('Inline game script not found');

const nodes = new Map();
const gradient = () => ({ addColorStop() {} });
const context = new Proxy({
  createLinearGradient: gradient,
  createRadialGradient: gradient,
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
    classList: {
      add: value => classes.add(value),
      remove: value => classes.delete(value),
      contains: value => classes.has(value),
    },
    addEventListener() {},
    setPointerCapture() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 108, height: 108 }),
    getContext: () => context,
    textContent: '',
    disabled: false,
    title: '',
  };
}

const document = {
  querySelector(selector) {
    if (!nodes.has(selector)) nodes.set(selector, makeNode(selector));
    return nodes.get(selector);
  },
  createElement(tag) {
    if (tag !== 'canvas') throw new Error(`Unexpected element: ${tag}`);
    return makeNode('canvas');
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
    const exists = fs.existsSync(path.join(root, value));
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
  if (play.title !== 'Professional art ready') throw new Error(play.title || 'Art asset missing');
  play.onclick();
  frame?.(16);
  frame?.(32);
  if (nodes.get('#stage').textContent !== 'Hatchling Gull') throw new Error('Initial stage mismatch');
  if (nodes.get('#xt').textContent !== '0 / 15') throw new Error('Evolution interval mismatch');
  if (!nodes.get('#overlay').classList.contains('hidden')) throw new Error('Play overlay stayed open');
  if (nodes.get('#hud').classList.contains('hidden')) throw new Error('HUD stayed hidden');
  if (/Young Gull|Falcon/.test(script)) throw new Error('Removed characters remain active');
  console.log('Gull Run smoke test passed: assets load, game starts, frames render, progression is 15 meals.');
});
