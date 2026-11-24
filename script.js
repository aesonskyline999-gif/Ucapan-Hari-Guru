/* ====== DATA (ubah di sini) ====== */
const NAMA = "Rasya";

const GURU = [
  { n: "Bu Dian", r: "Wali kelas", k: "Hangat", e: "🌸", c: "#ff9eb0",
    t: "Wali kelas yang sabar dan hangat, seperti ibu kedua di sekolah.",
    p: "Terima kasih, Bu Dian, sudah menerimaku dengan hangat dan mendampingiku sebagai wali kelas.\n\nIbu sabar waktu kami ribut, lembut waktu kami salah, dan selalu percaya kami bisa. Semua itu kuingat.\n\nSelamat Hari Guru, Bu. Sehat dan bahagia selalu ya 🌸" },
  { n: "Pak Rizki", r: "Guru asik dan seru", k: "Seru", e: "🎉", c: "#ffb347",
    t: "Kelas selalu hidup kalau Bapak masuk. Belajar jadi tidak pernah membosankan.",
    p: "Pak Rizki, belajar bareng Bapak itu tidak pernah bosan. Pelajaran yang berat jadi terasa ringan, dan kelas jadi tempat paling seru.\n\nTerima kasih sudah menerimaku dan jadi pengajar yang bikin semangat berangkat sekolah.\n\nSelamat Hari Guru, Pak! 🎉" },
  { n: "Pak Latif", r: "Guru tegas", k: "Tegas", e: "💪", c: "#5ec8ff",
    t: "Keras di luar, peduli di dalam. Ketegasan Bapak membuat kami berani tumbuh.",
    p: "Dulu aku kira Bapak galak. Sekarang aku paham, ketegasan Bapak adalah cara Bapak peduli supaya kami jadi lebih baik.\n\nTerima kasih sudah menerimaku dan mendidikku dengan disiplin, Pak Latif.\n\nSelamat Hari Guru 💪" },
  { n: "Pak Roy", r: "Guru serius", k: "Serius", e: "📘", c: "#7ee0b0",
    t: "Teliti, runtut, dan penuh tanggung jawab. Bapak mengajar sampai kami paham.",
    p: "Pak Roy, keseriusan Bapak membuat kami ikut serius belajar. Bapak mengajar sampai kami benar-benar paham, bukan sekadar selesai.\n\nTerima kasih sudah menerimaku dan sabar mendampingiku sebagai pengajar.\n\nSelamat Hari Guru, Pak 📘" },
  { n: "Pak Sanri", r: "Guru lucu", k: "Lucu", e: "😂", c: "#c9a2ff",
    t: "Ilmu masuk lewat tawa. Pelajaran sulit jadi gampang diingat.",
    p: "Pak Sanri, candaan Bapak bikin pelajaran susah jadi gampang diingat, dan bikin perut sakit karena ketawa 😂\n\nTerima kasih sudah menerimaku dengan hangat sebagai pengajar. Jangan berhenti melucu ya, Pak.\n\nSelamat Hari Guru!" }
];

/* ====== UTIL ====== */
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const M = window.Motion;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const adaGsap = !!(window.gsap && window.ScrollTrigger);
const pecah = (el, bungkus) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(bungkus).join(" ");
};

/* ====== RENDER ====== */
$("#guru").innerHTML = GURU.map((g, i) => `
  <article class="bab memuat" style="--c:${g.c}">
    <span class="kata" aria-hidden="true">${g.k}</span>
    <div class="isi">
      <div class="emo">${g.e}</div>
      <p class="peran">${g.r}</p>
      <h2>${g.n}</h2>
      <p class="tag">${g.t}</p>
      <button class="btn" data-i="${i}">💌 Pesan personal</button>
    </div>
  </article>`).join("");
$("#chips").innerHTML = GURU.map((g, i) =>
  `<button class="chip" data-i="${i}" style="--c:${g.c}">${g.e} ${g.n}</button>`).join("");
$(".ttd").textContent = "— " + NAMA;
pecah($("#judul"), w => `<span class="k"><span>${w}</span></span>`);
pecah($("#cerita"), w => `<span>${w}</span>`);

/* ====== LENIS (gulir halus) + GSAP ====== */
let lenis;
if (adaGsap) {
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
}

function animasi() {
  // satu momen pembuka: judul naik kata demi kata
  gsap.from("#judul .k span", { yPercent: 115, rotate: 5, duration: 1.1, stagger: 0.14, ease: "power4.out" });
  gsap.from(".tgl,.sub,#mulai", { autoAlpha: 0, duration: 0.8, stagger: 0.15, delay: 0.8 });

  // progres gulir
  gsap.to("#bar", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.3, start: 0, end: "max" } });

  // teks cerita menyala mengikuti gulir
  gsap.fromTo("#cerita span", { opacity: 0.15 }, {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: ".story", start: "top 75%", end: "bottom 70%", scrub: true }
  });

  // tiap bab: skeleton berganti isi, kata besar bergeser pelan
  $$(".bab").forEach(b => {
    ScrollTrigger.create({
      trigger: b, start: "top 65%", once: true,
      onEnter: () => setTimeout(() => b.classList.remove("memuat"), 700)
    });
    gsap.fromTo($(".kata", b), { yPercent: 30 }, {
      yPercent: -30, ease: "none", scrollTrigger: { trigger: b, scrub: true }
    });
  });
  ScrollTrigger.refresh();
}

function masuk() {
  if (adaGsap) {
    gsap.to("#loader", { autoAlpha: 0, duration: 0.6, onComplete: () => $("#loader").remove() });
    lenis && lenis.start();
    animasi();
  } else {
    $("#loader").remove();
    $$(".memuat").forEach(e => e.classList.remove("memuat"));
  }
}
addEventListener("load", () => setTimeout(masuk, 1500));

/* ====== MOTION: penutup muncul saat terlihat ====== */
if (M) {
  const t = $$(".penutup h2,.penutup p,.chips");
  t.forEach(e => (e.style.opacity = 0));
  M.inView(".penutup", () => {
    M.animate(t, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: M.stagger(0.15) });
  });
}

/* ====== PESAN PERSONAL (Motion) ====== */
const modal = $("#modal"), kertas = $(".kertas");
let ketik;

function buka(i) {
  const g = GURU[i];
  modal.style.setProperty("--c", g.c);
  $("#m-untuk").textContent = `Untuk ${g.n} ${g.e}`;
  $("#m-dari").textContent = "— " + NAMA;
  $("#m-isi").textContent = "";
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  lenis && lenis.stop();
  ketik && ketik.stop();
  if (M) {
    M.animate(kertas, { opacity: [0, 1], y: [60, 0], scale: [0.92, 1] }, { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] });
    ketik = M.animate(0, g.p.length, {
      duration: Math.min(g.p.length * 0.025, 5), ease: "linear",
      onUpdate: v => ($("#m-isi").textContent = g.p.slice(0, Math.round(v)))
    });
  } else {
    $("#m-isi").textContent = g.p;
  }
  $("#tutup").focus();
}

function tutup() {
  ketik && ketik.stop();
  const selesai = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    lenis && lenis.start();
  };
  M ? M.animate(kertas, { opacity: 0, y: 40 }, { duration: 0.25 }).finished.then(selesai) : selesai();
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-i]");
  if (b) buka(+b.dataset.i);
});
$("#tutup").onclick = tutup;
modal.addEventListener("click", e => { if (e.target === modal) tutup(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) tutup(); });

/* ====== LAGU: Untuk-guruku.mp3 ====== */
const lagu = $("#lagu"), fab = $("#musik");
let sintesis = null, jalan = false;

const ui = () => {
  fab.classList.toggle("on", jalan);
  fab.textContent = jalan ? "⏸" : "🎵";
  fab.setAttribute("aria-label", jalan ? "Jeda lagu" : "Putar lagu");
};

// cadangan: kalau file mp3 belum ada, mainkan melodi lembut buatan browser
function nada() {
  const C = sintesis.ctx, n = [261.6, 329.6, 392, 523.3, 392, 329.6, 293.7, 349.2, 440, 523.3, 440, 349.2];
  let i = 0;
  sintesis.t = setInterval(() => {
    const o = C.createOscillator(), g = C.createGain(), now = C.currentTime;
    o.type = "triangle";
    o.frequency.value = n[i++ % n.length];
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    o.connect(g); g.connect(C.destination);
    o.start(now); o.stop(now + 1.3);
  }, 480);
}

function putar() {
  if (jalan) return;
  const p = lagu.play();
  const cadangan = () => {
    sintesis = sintesis || { ctx: new (window.AudioContext || window.webkitAudioContext)() };
    sintesis.ctx.resume();
    clearInterval(sintesis.t);
    nada();
    jalan = true; ui();
  };
  p ? p.then(() => { jalan = true; ui(); }).catch(cadangan) : cadangan();
}

function jeda() {
  lagu.pause();
  sintesis && clearInterval(sintesis.t);
  jalan = false; ui();
}

fab.onclick = () => (jalan ? jeda() : putar());
$("#mulai").onclick = () => {
  putar();
  const s = $(".story");
  lenis ? lenis.scrollTo(s) : s.scrollIntoView({ behavior: "smooth" });
};
