const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function includes(text, label) {
    assert.ok(html.includes(text), `Missing ${label}: ${text}`);
}

function excludes(text, label) {
    assert.ok(!html.includes(text), `Unexpected ${label}: ${text}`);
}

function createFakeElement() {
    return {
        classList: { add() {}, remove() {}, toggle() {} },
        style: { setProperty() {} },
        addEventListener() {},
        querySelectorAll() { return []; },
        querySelector() { return createFakeElement(); },
        getBoundingClientRect() { return { left: 0, top: 0, width: 1, height: 1 }; },
        set textContent(value) { this._textContent = value; },
        get textContent() { return this._textContent || ''; },
        set innerText(value) { this._innerText = value; },
        get innerText() { return this._innerText || ''; },
        set innerHTML(value) { this._innerHTML = value; },
        get innerHTML() { return this._innerHTML || ''; },
    };
}

function loadScript() {
    const fakeElement = createFakeElement();
    const context = {
        console,
        window: {
            matchMedia: () => ({ matches: true }),
            addEventListener() {},
            innerWidth: 1200,
            innerHeight: 800,
        },
        document: {
            documentElement: fakeElement,
            body: fakeElement,
            querySelector: () => fakeElement,
            querySelectorAll: () => [],
            getElementById: () => fakeElement,
        },
        requestAnimationFrame() {},
        Lenis: function Lenis() { this.raf = function raf() {}; },
        gsap: {
            registerPlugin() {},
            to() {},
            set() {},
            timeline: () => ({ to() { return this; } }),
            utils: { toArray: () => [] },
            fromTo() {},
        },
        ScrollTrigger: { create() {} },
    };
    context.window.window = context.window;
    context.window.document = context.document;
    vm.createContext(context);
    vm.runInContext(script, context);
    return context.window.LuongNgay;
}

includes('<a href="#how-it-works">Cách hoạt động</a>', 'clean how-it-works nav link');
includes('<a href="#for-workers">Dành cho công nhân</a>', 'clean for-workers nav link');
includes('<a href="#for-factories">Dành cho nhà máy</a>', 'clean for-factories nav link');
includes('<a href="#contact">Liên hệ</a>', 'clean contact nav link');
excludes('<a href="#ch-gtm">GTM</a>', 'pitch-deck GTM nav link');

includes('Tiện ích lương dành cho công nhân — do F88 phát triển', 'hero tagline');
includes('Phẩm giá tài chính cho 18 triệu người lao động thầm lặng của Việt Nam.', 'hero emotional subtitle');
includes('Đăng ký nhận thông báo sớm', 'worker CTA');
includes('Đăng ký cho nhà máy →', 'factory CTA');
includes('Được phát triển bởi:', 'trust bar label');

includes('30–50%/tháng', 'bad-credit interest figure');
excludes('<span id="bad-credit-counter">0</span>%', 'incorrect bad-credit zero percent stat');

includes('id="context-bridge"', 'context bridge section');
includes('id="market-research"', 'market research section');
includes('id="who-is-it-for"', 'persona section');
includes('id="contact"', 'closing contact section');
excludes('id="worker-email"', 'closing worker email form');
excludes('id="factory-name"', 'closing factory company form');
excludes('class="contact-grid stagger-item"', 'closing dual contact form grid');
includes('* Mục tiêu sau 6 tháng triển khai pilot. Nguồn: GajiGesa Indonesia 2022, McKinsey 2022.', 'impact disclaimer');

includes('Số ngày đã làm trong tháng', 'interactive salary slider label');
includes('Lương tháng: 7.000.000đ', 'fixed monthly salary label');
includes('Bạn nhận được:', 'net received label');

const api = loadScript();
assert.ok(api, 'Expected window.LuongNgay test API');
assert.deepEqual(JSON.parse(JSON.stringify(api.calculateEwa(18))), {
    daysWorked: 18,
    monthlySalary: 7000000,
    earnedWage: 4200000,
    maxEwa: 2100000,
    fee: 15000,
    netReceived: 2085000,
});
assert.equal(api.formatVnd(2100000), '2.100.000đ');

console.log('landing-page checks passed');
