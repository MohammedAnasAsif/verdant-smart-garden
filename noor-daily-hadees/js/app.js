(function () {
  "use strict";

  const DAY_MS = 86400000;
  const HADITH_COUNT = HADITHS.length;
  const STORE = {
    visits: "noor.visits",
    saved: "noor.saved",
    theme: "noor.theme",
    fontScale: "noor.fontScale"
  };

  const $ = (id) => document.getElementById(id);

  const els = {
    dateGregorian: $("dateGregorian"),
    dateHijri: $("dateHijri"),
    chipTheme: $("chipTheme"),
    chipGrade: $("chipGrade"),
    chipDay: $("chipDay"),
    arabicText: $("arabicText"),
    translationText: $("translationText"),
    referenceLine: $("referenceLine"),
    backstoryBody: $("backstoryBody"),
    historyBody: $("historyBody"),
    narratorName: $("narratorName"),
    narratorTitle: $("narratorTitle"),
    narratorBio: $("narratorBio"),
    narratorInitials: $("narratorInitials"),
    meaningBody: $("meaningBody"),
    stepsList: $("stepsList"),
    browseStrip: $("browseStrip"),
    prevBtn: $("prevBtn"),
    nextBtn: $("nextBtn"),
    todayBtn: $("todayBtn"),
    copyBtn: $("copyBtn"),
    saveBtn: $("saveBtn"),
    saveLabel: $("saveLabel"),
    streakCount: $("streakCount"),
    themeBtn: $("themeBtn"),
    bookmarksBtn: $("bookmarksBtn"),
    bookmarksDrawer: $("bookmarksDrawer"),
    drawerOverlay: $("drawerOverlay"),
    drawerCloseBtn: $("drawerCloseBtn"),
    savedList: $("savedList"),
    savedEmpty: $("savedEmpty"),
    toast: $("toast"),
    searchInput: $("searchInput"),
    searchResults: $("searchResults"),
    collectionsRow: $("collectionsRow"),
    listenBtn: $("listenBtn"),
    listenLabel: $("listenLabel"),
    shareBtn: $("shareBtn"),
    fontDownBtn: $("fontDownBtn"),
    fontUpBtn: $("fontUpBtn"),
    exportBtn: $("exportBtn"),
    importBtn: $("importBtn"),
    importFile: $("importFile")
  };

  let offset = 0;
  let toastTimer = null;
  let saved = loadStore(STORE.saved, []);
  let activeCollection = null;
  let speaking = false;

  function loadStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function saveStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* storage unavailable */
    }
  }

  function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function utcDayNumber(d) {
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
  }

  function viewDate() {
    const d = startOfToday();
    d.setDate(d.getDate() - offset);
    return d;
  }

  function dailyIndex(d) {
    const n = utcDayNumber(d);
    return ((n % HADITH_COUNT) + HADITH_COUNT) % HADITH_COUNT;
  }

  function currentDate() {
    return viewDate();
  }

  function goToHadees(i) {
    const todayNum = utcDayNumber(startOfToday());
    const diff = (dailyIndex(startOfToday()) - i + HADITH_COUNT) % HADITH_COUNT;
    offset = diff;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateHash(idx) {
    const target = "#hadees-" + HADITHS[idx].id;
    if (location.hash !== target) {
      history.replaceState(null, "", location.pathname + location.search + target);
    }
  }

  function applyHash() {
    const m = /^#hadees-(.+)$/.exec(location.hash);
    if (!m) return false;
    const i = HADITHS.findIndex((h) => h.id === m[1]);
    if (i === -1) return false;
    goToHadees(i);
    return true;
  }

  function formatDateParts(d) {
    els.dateGregorian.textContent = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(d);
    try {
      els.dateHijri.textContent =
        new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(d) + " AH";
    } catch (err) {
      els.dateHijri.textContent = "";
    }
  }

  function referenceHTML(h) {
    const main = `<strong>${h.source.collection}</strong> · No. ${h.source.number}`;
    const extra = h.source.alsoIn ? ` · also in ${h.source.alsoIn}` : "";
    const who = ` · Narrated by ${h.narrator.name}`;
    return main + extra + who;
  }

  function initialsOf(name) {
    const clean = name.replace(/\s*\(.*?\)\s*/g, "").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  }

  function render() {
    const d = currentDate();
    const idx = dailyIndex(d);
    const h = HADITHS[idx];

    formatDateParts(d);

    els.chipTheme.textContent = h.theme;
    els.chipGrade.textContent = h.source.grade.replace("Agreed upon (Sahih)", "Sahih — Agreed upon");
    els.chipGrade.dataset.grade = h.source.grade.toLowerCase();
    els.chipDay.textContent = `Hadees ${idx + 1} of ${HADITH_COUNT}`;

    els.arabicText.textContent = h.arabic;
    els.translationText.textContent = `\u201C${h.translation}\u201D`;
    els.referenceLine.innerHTML = referenceHTML(h);

    document.title = `${h.theme} — Noor Daily Hadees`;

    els.backstoryBody.textContent = h.backstory;
    els.historyBody.textContent = h.history;
    els.meaningBody.textContent = h.meaning;

    els.narratorName.textContent = h.narrator.name;
    els.narratorTitle.textContent = h.narrator.title;
    els.narratorBio.textContent = h.narrator.bio;
    els.narratorInitials.textContent = initialsOf(h.narrator.name);

    els.stepsList.innerHTML = "";
    h.steps.forEach((text) => {
      const li = document.createElement("li");
      li.className = "step-item";
      const span = document.createElement("span");
      span.className = "step-text";
      span.textContent = text;
      li.appendChild(span);
      els.stepsList.appendChild(li);
    });

    els.nextBtn.disabled = offset >= 0;
    els.todayBtn.classList.toggle("hidden", offset === 0);

    const isSaved = saved.includes(h.id);
    els.saveBtn.setAttribute("aria-pressed", String(isSaved));
    els.saveLabel.textContent = isSaved ? "Saved" : "Save";

    updateHash(idx);
    renderBrowseStrip(idx);
  }

  function renderBrowseStrip(activeIdx) {
    els.browseStrip.innerHTML = "";
    HADITHS.forEach((h, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "browse-chip";
      btn.setAttribute("aria-current", String(i === activeIdx));
      if (activeCollection && !activeCollection.ids.includes(h.id)) {
        btn.style.display = "none";
      }
      const label = document.createElement("span");
      label.textContent = h.theme;
      const num = document.createElement("small");
      num.textContent = `No. ${i + 1}`;
      btn.append(num, label);
      btn.addEventListener("click", () => goToHadees(i));
      els.browseStrip.appendChild(btn);
    });
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  async function copyCurrent() {
    const h = HADITHS[dailyIndex(currentDate())];
    const text = `${h.arabic}\n\n\u201C${h.translation}\u201D\n— ${h.narrator.name}\n${h.source.collection} ${h.source.number}${h.source.alsoIn ? " | " + h.source.alsoIn : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Hadees copied to clipboard");
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Hadees copied to clipboard");
    }
  }

  function toggleSave() {
    const id = HADITHS[dailyIndex(currentDate())].id;
    if (saved.includes(id)) {
      saved = saved.filter((x) => x !== id);
      showToast("Removed from saved");
    } else {
      saved.push(id);
      showToast("Saved for later reflection");
    }
    saveStore(STORE.saved, saved);
    render();
  }

  function renderSavedList() {
    els.savedList.innerHTML = "";
    els.savedEmpty.classList.toggle("hidden", saved.length > 0);
    saved.forEach((id) => {
      const h = HADITHS.find((x) => x.id === id);
      if (!h) return;
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "saved-item";
      const theme = document.createElement("div");
      theme.className = "saved-theme";
      theme.textContent = h.theme;
      const ref = document.createElement("div");
      ref.className = "saved-ref";
      ref.textContent = `${h.narrator.name} · ${h.source.collection} ${h.source.number}`;
      btn.append(theme, ref);
      btn.addEventListener("click", () => {
        closeDrawer();
        goToHadees(HADITHS.indexOf(h));
      });
      li.appendChild(btn);
      els.savedList.appendChild(li);
    });
  }

  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    renderSavedList();
    els.bookmarksDrawer.classList.remove("hidden");
    els.drawerOverlay.classList.remove("hidden");
    els.drawerCloseBtn.focus();
  }

  function closeDrawer() {
    if (els.bookmarksDrawer.classList.contains("hidden")) return;
    els.bookmarksDrawer.classList.add("hidden");
    els.drawerOverlay.classList.add("hidden");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  async function shareCurrent() {
    const h = HADITHS[dailyIndex(currentDate())];
    const url = location.origin + location.pathname + "#hadees-" + h.id;
    const text = `${h.arabic}\n\n\u201C${h.translation}\u201D\n— ${h.narrator.name} · ${h.source.collection} ${h.source.number}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Noor — Daily Hadees", text, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text + "\n" + url);
      showToast("Hadees and link copied");
    } catch (err) {
      showToast("Sharing is not available here");
    }
  }

  function currentArabicVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find((v) => /^ar([-_]|$)/i.test(v.lang)) || null;
  }

  function stopSpeaking() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    speaking = false;
    els.listenBtn.setAttribute("aria-pressed", "false");
    els.listenLabel.textContent = "Listen";
  }

  function toggleListen() {
    if (!("speechSynthesis" in window)) {
      showToast("Audio is not supported in this browser");
      return;
    }
    if (speaking) {
      stopSpeaking();
      return;
    }
    const h = HADITHS[dailyIndex(currentDate())];
    const utter = new SpeechSynthesisUtterance(h.arabic);
    const voice = currentArabicVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = "ar-SA";
    }
    utter.rate = 0.85;
    utter.onend = () => stopSpeaking();
    utter.onerror = () => {
      stopSpeaking();
      showToast("No Arabic voice available on this device");
    };
    speechSynthesis.speak(utter);
    speaking = true;
    els.listenBtn.setAttribute("aria-pressed", "true");
    els.listenLabel.textContent = "Stop";
    if (!voice) {
      showToast("No Arabic voice found — using default");
    }
  }

  function applyFontScale(scale) {
    document.documentElement.style.fontSize = Math.round(scale * 100) + "%";
  }

  function changeFontScale(delta) {
    let scale = loadStore(STORE.fontScale, 1);
    scale = Math.min(1.3, Math.max(0.9, Math.round((scale + delta) * 100) / 100));
    saveStore(STORE.fontScale, scale);
    applyFontScale(scale);
  }

  function initFontScale() {
    applyFontScale(loadStore(STORE.fontScale, 1));
  }

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    els.searchResults.innerHTML = "";
    if (q.length < 2) {
      els.searchResults.classList.add("hidden");
      return;
    }
    const matches = HADITHS.filter(
      (h) =>
        h.theme.toLowerCase().includes(q) ||
        h.narrator.name.toLowerCase().includes(q) ||
        h.source.collection.toLowerCase().includes(q) ||
        h.translation.toLowerCase().includes(q)
    ).slice(0, 8);
    els.searchResults.classList.remove("hidden");
    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "search-empty";
      li.textContent = "No matching hadees found.";
      els.searchResults.appendChild(li);
      return;
    }
    matches.forEach((h) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "search-result";
      const theme = document.createElement("div");
      theme.className = "sr-theme";
      theme.textContent = h.theme;
      const ref = document.createElement("div");
      ref.className = "sr-ref";
      ref.textContent = `${h.narrator.name} · ${h.source.collection} ${h.source.number}`;
      btn.append(theme, ref);
      btn.addEventListener("click", () => {
        els.searchResults.classList.add("hidden");
        els.searchInput.value = "";
        goToHadees(HADITHS.indexOf(h));
      });
      li.appendChild(btn);
      els.searchResults.appendChild(li);
    });
  }

  function renderCollections() {
    els.collectionsRow.innerHTML = "";
    COLLECTIONS.forEach((c) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "collection-chip";
      chip.setAttribute("aria-pressed", String(activeCollection === c));
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.setAttribute("aria-hidden", "true");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z");
      svg.appendChild(path);
      const label = document.createElement("span");
      label.textContent = c.name;
      chip.append(svg, label);
      chip.addEventListener("click", () => {
        activeCollection = activeCollection === c ? null : c;
        renderCollections();
        renderBrowseStrip(dailyIndex(currentDate()));
      });
      els.collectionsRow.appendChild(chip);
    });
  }

  function exportData() {
    const payload = {
      app: "noor-daily-hadees",
      version: 1,
      exportedAt: new Date().toISOString(),
      saved,
      visits: loadStore(STORE.visits, {})
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "noor-backup-" + dateKeyLocal(new Date()) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Backup downloaded");
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.app !== "noor-daily-hadees") throw new Error("wrong app");
        saved = Array.from(new Set([...saved, ...(Array.isArray(data.saved) ? data.saved.filter((id) => HADITHS.some((h) => h.id === id)) : [])]));
        saveStore(STORE.saved, saved);
        if (data.visits && typeof data.visits === "object") {
          const visits = Object.assign(loadStore(STORE.visits, {}), data.visits);
          saveStore(STORE.visits, visits);
          recordVisitAndStreak();
        }
        closeDrawer();
        render();
        showToast("Backup restored");
      } catch (err) {
        showToast("That file is not a valid Noor backup");
      }
    };
    reader.readAsText(file);
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  function recordVisitAndStreak() {
    const visits = loadStore(STORE.visits, {});
    visits[dateKeyLocal(new Date())] = true;
    Object.keys(visits).forEach((k) => {
      const kd = new Date(k);
      if (isNaN(kd) || Date.now() - kd.getTime() > 400 * DAY_MS) delete visits[k];
    });
    saveStore(STORE.visits, visits);

    let streak = 0;
    const probe = new Date();
    probe.setHours(0, 0, 0, 0);
    if (!visits[dateKeyLocal(probe)]) probe.setDate(probe.getDate() - 1);
    while (visits[dateKeyLocal(probe)]) {
      streak += 1;
      probe.setDate(probe.getDate() - 1);
    }
    els.streakCount.textContent = String(streak);
  }

  function dateKeyLocal(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function initTheme() {
    const stored = loadStore(STORE.theme, null);
    const preferred =
      stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(preferred);
  }

  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    els.themeBtn.setAttribute("aria-pressed", String(mode === "dark"));
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveStore(STORE.theme, next);
  }

  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll(".tab"));
    const panels = Array.from(document.querySelectorAll(".panel"));

    function activate(tab) {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((p) => {
        p.hidden = p.id !== tab.getAttribute("aria-controls");
      });
      tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        let target = null;
        if (e.key === "ArrowRight") target = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") target = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") target = tabs[0];
        if (e.key === "End") target = tabs[tabs.length - 1];
        if (target) {
          e.preventDefault();
          activate(target);
        }
      });
    });
  }

  els.prevBtn.addEventListener("click", () => {
    offset -= 1;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  els.nextBtn.addEventListener("click", () => {
    if (offset < 0) {
      offset += 1;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  els.todayBtn.addEventListener("click", () => {
    offset = 0;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  els.copyBtn.addEventListener("click", copyCurrent);
  els.saveBtn.addEventListener("click", toggleSave);
  els.themeBtn.addEventListener("click", toggleTheme);
  els.bookmarksBtn.addEventListener("click", openDrawer);
  els.drawerCloseBtn.addEventListener("click", closeDrawer);
  els.drawerOverlay.addEventListener("click", closeDrawer);
  els.shareBtn.addEventListener("click", shareCurrent);
  els.listenBtn.addEventListener("click", toggleListen);
  els.fontDownBtn.addEventListener("click", () => changeFontScale(-0.05));
  els.fontUpBtn.addEventListener("click", () => changeFontScale(0.05));
  els.exportBtn.addEventListener("click", exportData);
  els.importBtn.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", () => {
    if (els.importFile.files && els.importFile.files[0]) {
      importData(els.importFile.files[0]);
      els.importFile.value = "";
    }
  });

  els.searchInput.addEventListener("input", (e) => runSearch(e.target.value));
  els.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      els.searchResults.classList.add("hidden");
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      els.searchResults.classList.add("hidden");
    }
  });

  window.addEventListener("hashchange", () => applyHash());

  document.addEventListener("keydown", (e) => {
    if (els.bookmarksDrawer.classList.contains("hidden")) return;
    if (e.key === "Escape") {
      closeDrawer();
      return;
    }
    if (e.key === "Tab") {
      const focusables = els.bookmarksDrawer.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  initTheme();
  initFontScale();
  setupTabs();
  renderCollections();
  recordVisitAndStreak();
  render();
  if (!applyHash()) registerServiceWorker();
})();
