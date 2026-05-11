// deep learning.js

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = "Spectra Phase.png?v=" + Date.now();

  document.head.appendChild(link);
});

const proofState = {
    tc: { r: 0, g: 0, b: 0, a: 1 },
    th: { r: 0, g: 0, b: 0, a: 1 },
    jr: { r: 0, g: 0, b: 0, a: 1 }
};

const backgroundState = {
    tc: { r: 0, g: 0, b: 0 },
    th: { r: 0, g: 0, b: 0 },
    jr: { r: 0, g: 0, b: 0 }
};

const sliders = [
    { conId: 'r_con', dialId: 'r_dial', colorIndex: 0 },
    { conId: 'g_con', dialId: 'g_dial', colorIndex: 1 },
    { conId: 'b_con', dialId: 'b_dial', colorIndex: 2 },
    { conId: 'o_con', dialId: 'o_dial', colorIndex: 3 }
];

let colorValues = [0, 0, 0, 100];
let activeProof = null;
let activeBackground = null;
let controllingBack = false;

const allProofs = document.querySelectorAll('.proof');

allProofs.forEach(proof => {
    proof.addEventListener('click', () => {
        allProofs.forEach(p => p.classList.remove('selected'));

        proof.classList.add('selected');

        const isBack = proof.id.endsWith('_back');
        controllingBack = isBack;

        if (isBack) {
            activeBackground = proof.id.replace('_back', '');
            activeProof = null;
            const bg = backgroundState[activeBackground];
            colorValues = [bg.r, bg.g, bg.b, 100];
        } else {
            activeProof = proof;
            activeBackground = null;
            const state = proofState[activeProof.id];
            colorValues = [state.r, state.g, state.b, Math.round(state.a * 100)];
        }

        sliders.forEach(slider => updateSliderUI(slider, colorValues));
        if (!isBack) updateActiveProofBackground();
        else updateBackgroundDOM(activeBackground);
    });
});

function updateSliderUI(slider, values) {
    const con = document.getElementById(slider.conId);
    const dial = con.querySelector(`#${slider.dialId}`);
    const input = con.querySelector('input');
    const color = con.querySelector('.color');
    const drag = con.querySelector('.drag');

    const max = slider.conId === 'o_con' ? 100 : 255;
    const val = values[slider.colorIndex];

    dial.style.width = `${(val / max) * drag.clientWidth}px`;
    input.value = val;

    if (!controllingBack) updateColorCircle(color, slider.conId);
    else updateBackgroundColorCircle(color, slider.conId);
}

function attachSliderLogic(slider) {
    const con = document.getElementById(slider.conId);
    if (!con) return;

    const dial = con.querySelector(`#${slider.dialId}`);
    const input = con.querySelector('input');
    const color = con.querySelector('.color');
    const drag = con.querySelector('.drag');

    let dragging = false;

    drag.addEventListener('mousedown', e => {
        dragging = true;
        updateFromPointer(e);
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => dragging = false);
    document.addEventListener('mousemove', e => dragging && updateFromPointer(e));

    function updateFromPointer(e) {
        const rect = drag.getBoundingClientRect();
        let width = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        dial.style.width = `${width}px`;

        const max = slider.conId === 'o_con' ? 100 : 255;
        let val = Math.round((width / rect.width) * max);
        colorValues[slider.colorIndex] = val;
        input.value = val;

        if (controllingBack && activeBackground) {
            const key = ['r','g','b'][slider.colorIndex];
            backgroundState[activeBackground][key] = val;
            updateBackgroundDOM(activeBackground);
        } else if (activeProof) {
            const key = ['r','g','b','a'][slider.colorIndex];
            proofState[activeProof.id][key] = slider.colorIndex===3 ? val/100 : val;
            updateActiveProofBackground();
        }

        if (!controllingBack) updateColorCircle(color, slider.conId);
        else updateBackgroundColorCircle(color, slider.conId);
    }

    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
        const max = slider.conId === 'o_con' ? 100 : 255;
        let val = Math.max(0, Math.min(parseInt(input.value) || 0, max));
        dial.style.width = `${(val / max) * drag.clientWidth}px`;
        colorValues[slider.colorIndex] = val;
        input.value = val;

        if (controllingBack && activeBackground) {
            const key = ['r','g','b'][slider.colorIndex];
            backgroundState[activeBackground][key] = val;
            updateBackgroundDOM(activeBackground);
        } else if (activeProof) {
            const key = ['r','g','b','a'][slider.colorIndex];
            proofState[activeProof.id][key] = slider.colorIndex===3 ? val/100 : val;
            updateActiveProofBackground();
        }

        if (!controllingBack) updateColorCircle(color, slider.conId);
        else updateBackgroundColorCircle(color, slider.conId);
    });
}

sliders.forEach(slider => attachSliderLogic(slider));

function updateColorCircle(el, id) {
    if (id === 'r_con') el.style.background = `rgb(${colorValues[0]},0,0)`;
    if (id === 'g_con') el.style.background = `rgb(0,${colorValues[1]},0)`;
    if (id === 'b_con') el.style.background = `rgb(0,0,${colorValues[2]})`;
    if (id === 'o_con') el.style.background = `rgba(255,255,255,${colorValues[3]/100})`;
}

function updateBackgroundColorCircle(el, sliderId) {
    const idx = ['r','g','b'].indexOf(sliderId[0]);
    if(idx===0) el.style.background = `rgb(${colorValues[0]},0,0)`;
    if(idx===1) el.style.background = `rgb(0,${colorValues[1]},0)`;
    if(idx===2) el.style.background = `rgb(0,0,${colorValues[2]})`;
}

function updateActiveProofBackground() {
    if (!activeProof) return;
    const id = activeProof.id;
    activeProof.style.background = `rgba(${colorValues[0]},${colorValues[1]},${colorValues[2]},${colorValues[3]/100})`;
    proofState[id] = { r: colorValues[0], g: colorValues[1], b: colorValues[2], a: colorValues[3]/100 };

    if (id==='tc'||id==='th') updateJrStateAndBackground();
    syncGhosts();
}

function updateBackgroundDOM(id) {
    const el = document.getElementById(id+'_back');
    if (!el) return;
    const bg = backgroundState[id];
    el.style.background = `rgb(${bg.r},${bg.g},${bg.b})`;
}

function updateJrStateAndBackground() {
    const jr = document.getElementById('jr');
    const a = proofState.tc;
    const b = proofState.th;

    proofState.jr = {
        r: (a.r + b.r) >> 1,
        g: (a.g + b.g) >> 1,
        b: (a.b + b.b) >> 1,
        a: (a.a + b.a)/2
    };

    if (jr) jr.style.background = `rgba(${proofState.jr.r},${proofState.jr.g},${proofState.jr.b},${proofState.jr.a})`;
}

function syncGhosts() {
    const ghost_tc = document.getElementById('ghost_tc');
    const ghost_jr = document.getElementById('ghost_jr');
    const ghost_th = document.getElementById('ghost_th');

    if (!ghost_tc || !ghost_jr || !ghost_th) return;

    ghost_tc.style.backgroundColor = `rgba(${proofState.tc.r},${proofState.tc.g},${proofState.tc.b},${proofState.tc.a})`;
    ghost_jr.style.backgroundColor = `rgba(${proofState.jr.r},${proofState.jr.g},${proofState.jr.b},${proofState.jr.a})`;
    ghost_th.style.backgroundColor = `rgba(${proofState.th.r},${proofState.th.g},${proofState.th.b},${proofState.th.a})`;
}

const ghosts = document.querySelectorAll('.ghost');
let ghostStartTime = null;

function animateGhosts(ts) {
    if (!ghostStartTime) ghostStartTime = ts;

    const t = ((ts - ghostStartTime) % 2000) / 2000;
    const opacity = t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2;

    ghosts.forEach(g => g.style.opacity = opacity);
    requestAnimationFrame(animateGhosts);
}

requestAnimationFrame(animateGhosts);

const lightMap = [
    { proof: 'tc', shade: 'light_tc' },
    { proof: 'jr', shade: 'light_jr' },
    { proof: 'th', shade: 'light_th' }
];

const SURFACE_BG = { r: 96, g: 96, b: 97 };
let lightStart = null;

function observableColor(fg, bg = SURFACE_BG) {
    return [
        Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
        Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
        Math.round(fg.b * fg.a + bg.b * (1 - fg.a))
    ];
}

function mix(a, b, t) {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t)
    ];
}

function ease(t) {
    return 0.5 - Math.cos(Math.PI * t) / 2;
}

function animateShades(ts) {
    if (!lightStart) lightStart = ts;

    const totalDuration = 8000;
    const elapsed = (ts - lightStart) % totalDuration;

    const phaseDuration = 2000;
    const phase = Math.floor(elapsed / phaseDuration);
    const localT = (elapsed % phaseDuration) / phaseDuration;
    const t = ease(localT);

    lightMap.forEach(({ proof, shade }) => {
        const dst = document.getElementById(shade);
        if (!dst) return;

        const state = proofState[proof];
        if (!state) return;

        const baseColor = observableColor(state);

        let fromColor, toColor;
        switch (phase) {
            case 0:
                fromColor = baseColor;
                toColor = [0, 0, 0];
                break;
            case 1:
                fromColor = [0, 0, 0];
                toColor = baseColor;
                break;
            case 2:
                fromColor = baseColor;
                toColor = [255, 255, 255];
                break;
            case 3:
                fromColor = [255, 255, 255];
                toColor = baseColor;
                break;
        }

        const currentColor = mix(fromColor, toColor, t);
        dst.style.backgroundColor = `rgb(${currentColor[0]},${currentColor[1]},${currentColor[2]})`;
    });

    requestAnimationFrame(animateShades);
}

requestAnimationFrame(animateShades);




document.addEventListener('DOMContentLoaded', () => {
    const radialMap = [
        { proof: 'tc', canvas: 'circ_tc' },
        { proof: 'jr', canvas: 'circ_jr' },
        { proof: 'th', canvas: 'circ_th' }
    ];

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [
            Math.round(255 * f(0)),
            Math.round(255 * f(8)),
            Math.round(255 * f(4))
        ];
    }

    function drawRadial(canvas, centerRGB) {
        const style = getComputedStyle(canvas);
        const size = Math.max(
            parseInt(style.width),
            parseInt(style.height),
            1
        );

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);

        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2;

        const image = ctx.createImageData(size, size);
        const data = image.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > radius) continue;

                const t = dist / radius;
                const angle = Math.atan2(dy, dx);
                const hue = (angle * 180 / Math.PI + 360) % 360;
                const [tr, tg, tb] = hslToRgb(hue, 100, 50);

                const r = lerp(centerRGB[0], tr, t);
                const g = lerp(centerRGB[1], tg, t);
                const b = lerp(centerRGB[2], tb, t);

                const i = (y * size + x) * 4;
                data[i]     = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = 255;
            }
        }

        ctx.putImageData(image, 0, 0);
    }

    function update() {
        radialMap.forEach(({ proof, canvas }) => {
            const src = document.getElementById(proof);
            const cvs = document.getElementById(canvas);
            if (!src || !cvs) return;

            const bg = getComputedStyle(src).backgroundColor;
            const m = bg.match(/\d+/g);
            if (!m) return;

            drawRadial(cvs, [+m[0], +m[1], +m[2]]);
        });

        requestAnimationFrame(update);
    }

    update();
});

(function () {
    const jr = document.getElementById('jr');
    const report = document.getElementById('report');
    let cachedValues = null;

    function parseRGBA(el) {
        const m = getComputedStyle(el).backgroundColor
            .replace(/\s/g, '')
            .match(/rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)/);
        if (!m) return null;
        return [
            +m[1],
            +m[2],
            +m[3],
            m[4] !== undefined ? Math.round(+m[4] * 100) : 100
        ];
    }

    function syncControls() {
        sliders.forEach(slider => {
            const con = document.getElementById(slider.conId);
            const dial = con.querySelector('#' + slider.dialId);
            const input = con.querySelector('input');
            const color = con.querySelector('.color');
            const drag = con.querySelector('.drag');

            const val = colorValues[slider.colorIndex];
            const max = slider.conId === 'o_con' ? 100 : 255;

            dial.style.width = `${(val / max) * drag.clientWidth}px`;
            input.value = val;

            updateColorCircle(color, slider.conId);
        });
    }

    // ----- JR HOVER (preview only) -----
    if (jr) {
        jr.addEventListener('mouseenter', () => {
            if (activeProof && activeProof.id === 'jr') return;

            cachedValues = colorValues.slice();
            const rgba = parseRGBA(jr);
            if (!rgba) return;

            colorValues = [...rgba];
            syncControls();
        });

        jr.addEventListener('mouseleave', () => {
            if (!cachedValues) return;

            colorValues = [...cachedValues];
            cachedValues = null;
            syncControls();
        });

        // Optional: allow selecting JR without altering system behavior
        jr.addEventListener('click', () => {
            allProofs.forEach(p => p.classList.remove('selected'));
            jr.classList.add('selected');

            activeProof = jr;
            activeBackground = null;
            controllingBack = false;
        });
    }

    // ----- REPORT ACTIVATION (no flip switch) -----
    function activateReportIfNeeded() {
        if (!activeProof || !report) return;
        if (activeProof.id !== 'tc' && activeProof.id !== 'th') return;

        report.id = 'report_active';
    }

    // Hook into update WITHOUT overriding logic
    const originalUpdate = window.updateActiveProofBackground;
    window.updateActiveProofBackground = function () {
        if (originalUpdate) originalUpdate();
        activateReportIfNeeded();
    };
})();


// ================= FILE / REPORT SYSTEM =================

document.body.addEventListener('click', (e) => {
    if (e.target.id !== 'report_active') return;

    document.querySelectorAll('#file').forEach(f => f.remove());

    const file = document.createElement("div");
    file.id = "file";

    const fileBack = document.createElement("div");
    fileBack.id = "file_back";
	
	fileBack.addEventListener("click", ()=> {
		file.style.display = "none";
	});

    const fileCon = document.createElement("div");
    fileCon.id = "file_content";
	
	const exitFile = document.createElement("p");
	exitFile.id = "exit_file";
	exitFile.textContent = "X";
	
	exitFile.addEventListener("click", ()=> {
		file.style.display = "none";
	});

    const fileNav = document.createElement("div");
    fileNav.id = "file_nav";

    const makeNav = (proofId, navId) => {
        const nav = document.createElement("p");
        nav.className = "f_nav";
        nav.id = navId;

        const proof = document.getElementById(proofId);
        if (proof) nav.style.background = getComputedStyle(proof).background;
        return nav;
    };

    fileNav.append(
        makeNav('tc', 'tc_nav'),
        makeNav('jr', 'jr_nav'),
        makeNav('th', 'th_nav')
    );

    fileCon.append(fileNav, exitFile);
    file.append(fileBack, fileCon);
    document.body.appendChild(file);

    const SURFACE_BG = { r: 96, g: 96, b: 97 };

    function observableColor(fg, bg = SURFACE_BG) {
        return {
            r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
            g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
            b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a))
        };
    }

    function rgbToHex({ r, g, b }) {
        return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
    }

    function mixRGB(a, b, t) {
        return {
            r: Math.round(a.r + (b.r - a.r) * t),
            g: Math.round(a.g + (b.g - a.g) * t),
            b: Math.round(a.b + (b.b - a.b) * t)
        };
    }

function makeFadeReport(proofId, label, steps = 100) {
    const sec = document.createElement("div");
    sec.className = "f_sec";
    sec.id = `report_${proofId}`;
    sec.dataset.report = proofId;

    const state = proofState[proofId];
    if (!state) return sec;

    sec.innerHTML = `
        <h3>${label}</h3>
        <p>RGB: ${state.r}, ${state.g}, ${state.b}</p>
        <p>Initial Opacity: ${Math.round(state.a * 100)}%</p>
        <h4>Alpha Fade (→ Transparent)</h4>
        <table><tbody class="fade_alpha"></tbody></table>

        <h4>Transition → Black</h4>
        <table><tbody class="fade_black"></tbody></table>

        <h4>Transition → White</h4>
        <table><tbody class="fade_white"></tbody></table>
    `;

    const alphaBody = sec.querySelector(".fade_alpha");
    const blackBody = sec.querySelector(".fade_black");
    const whiteBody = sec.querySelector(".fade_white");

    // -------------------------
    // Alpha Fade (existing logic)
    // -------------------------
    for (let i = 0; i <= steps; i++) {
        const t = 1 - i / steps;
        const alpha = state.a * t;

        const vis = {
            r: Math.round(state.r * alpha + 96 * (1 - alpha)),
            g: Math.round(state.g * alpha + 96 * (1 - alpha)),
            b: Math.round(state.b * alpha + 97 * (1 - alpha))
        };

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="width:40px;text-align:center;">${Math.round(t * 100)}%</td>
            <td>
                <span style="display:inline-block;width:16px;height:16px;
                    background:rgba(${state.r},${state.g},${state.b},${alpha});
                    border:2px solid #252525;border-radius:50%;margin:0 12px;"></span>
            </td>
            <td style="font-family:monospace;">
                rgb(${vis.r}, ${vis.g}, ${vis.b})
            </td>
        `;
        alphaBody.appendChild(tr);
    }

    // -------------------------
    // Black Transition
    // -------------------------
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const col = {
            r: Math.round(state.r * (1 - t)),
            g: Math.round(state.g * (1 - t)),
            b: Math.round(state.b * (1 - t))
        };

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="width:40px;text-align:center;">${Math.round(t * 100)}%</td>
            <td>
                <span style="display:inline-block;width:16px;height:16px;
                    background:rgb(${col.r},${col.g},${col.b});
                    border:2px solid #252525;border-radius:50%;margin:0 12px;"></span>
            </td>
            <td style="font-family:monospace;">
                rgb(${col.r}, ${col.g}, ${col.b})
            </td>
        `;
        blackBody.appendChild(tr);
    }

    // -------------------------
    // White Transition
    // -------------------------
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const col = {
            r: Math.round(state.r + (255 - state.r) * t),
            g: Math.round(state.g + (255 - state.g) * t),
            b: Math.round(state.b + (255 - state.b) * t)
        };

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="width:40px;text-align:center;">${Math.round(t * 100)}%</td>
            <td>
                <span style="display:inline-block;width:16px;height:16px;
                    background:rgb(${col.r},${col.g},${col.b});
                    border:2px solid #252525;border-radius:50%;margin:0 12px;"></span>
            </td>
            <td style="font-family:monospace;">
                rgb(${col.r}, ${col.g}, ${col.b})
            </td>
        `;
        whiteBody.appendChild(tr);
    }

    // -------------------------
    // TC/TH → JR Transition (unchanged)
    // -------------------------
    if (proofId === "tc" || proofId === "th") {
        const from = [
            Math.round(state.r),
            Math.round(state.g),
            Math.round(state.b)
        ];
        const to = [
            Math.round(proofState.jr.r),
            Math.round(proofState.jr.g),
            Math.round(proofState.jr.b)
        ];

        const trans = document.createElement("div");
        trans.innerHTML = `
            <h4>${proofId.toUpperCase()} → JR Transition</h4>
            <table><tbody></tbody></table>
        `;

        const body = trans.querySelector("tbody");

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;

            const col = [
                Math.round(from[0] + (to[0] - from[0]) * t),
                Math.round(from[1] + (to[1] - from[1]) * t),
                Math.round(from[2] + (to[2] - from[2]) * t)
            ];

            body.innerHTML += `
                <tr>
                    <td style="width:40px;text-align:center;">${Math.round(t * 100)}%</td>
                    <td>
                        <span style="display:inline-block;width:16px;height:16px;
                            background:rgb(${col[0]},${col[1]},${col[2]});
                            border-radius:50%;border:2px solid #252525;margin:0 12px;"></span>
                    </td>
                    <td style="font-family:monospace;">
                        rgb(${col[0]}, ${col[1]}, ${col[2]})
                    </td>
                </tr>
            `;
        }

        sec.appendChild(trans);
    }

    return sec;
}

    ["tc", "jr", "th"].forEach((key, i) => {
        const sec = makeFadeReport(key, key.toUpperCase());
        sec.style.display = i === 0 ? "block" : "none";
        fileCon.appendChild(sec);
    });

    fileNav.addEventListener("click", (e) => {
        const nav = e.target.closest(".f_nav");
        if (!nav) return;

        const key = nav.id.replace("_nav", "");
        const target = `report_${key}`;

        document.querySelectorAll(".f_sec").forEach(sec => {
            sec.style.display = sec.id === target ? 'block' : 'none';
        });

        document.querySelectorAll(".f_nav").forEach(n => {
            n.classList.toggle("active", n === nav);
        });
    });

    document.getElementById("tc_nav")?.classList.add("active");
});