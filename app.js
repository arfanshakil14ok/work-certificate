(() => {
  const STORAGE_KEY = "workcert_gl_data_v7";
  const USERS_KEY = "workcert_users_v1";
  const SESSION_KEY = "workcert_session_v1";
  const SAVED_CERTS_KEY = "workcert_saved_certs_v1";

  const COMMON_AGRO = {
    jobTitle: "Farm Worker (Agricultural & Livestock)",
    issueDate: "25/10/2026",
    siteLocation: "Crop Production, Poultry & Dairy Farm Unit",
    companyName: "ARFAN AGRO & LIVESTOCK FARM",
    companyAddress: "ISLAMPUR MORE, DIABETICS HOSPITAL ROAD, NETROKONA SADAR - 2400",
    companyContact: "Phone: 01913681771 \u2022 Email: info@arfanagro.com",
    signatoryName: "MD ZAKIR HOSSAIN",
    signatoryTitle: "MANAGER",
    duties: [
      "Performing daily farm labouring, land preparation, planting, weeding, irrigation, and crop care duties.",
      "Feeding, watering, and caring for livestock/poultry, and cleaning farm sheds, barns, and enclosures.",
      "Harvesting, sorting, packing, loading, and transporting agricultural produce, feed, and farm supplies safely.",
      "Operating and maintaining basic farm hand tools, sprayers, and equipment in accordance with safety rules.",
      "Maintaining farm hygiene, biosecurity, PPE compliance, punctuality, and teamwork standards."
    ].join("\n")
  };

  const RECORDS = {
    "AG-2026-0843": {
      ...COMMON_AGRO,
      empName: "MD SABBIR HASAN",
      fatherName: "MD MASTUFA MIA",
      dob: "02 November 2003",
      empId: "A19229486",
      personalNo: "5131622671",
      empAddress: "TERTOPA BAGHBER, KALMAKANDA, CHOITA - 2430, NETROKONA, Bangladesh",
      refNo: "AG-2026-0843",
      startDate: "10-Jan-2022",
      endDate: "10-03-2026"
    }
  };

  const DEFAULTS = RECORDS["AG-2026-0843"];

  const fields = {
    empName: document.getElementById("inputEmpName"),
    fatherName: document.getElementById("inputFatherName"),
    dob: document.getElementById("inputDob"),
    empId: document.getElementById("inputEmpId"),
    personalNo: document.getElementById("inputPersonalNo"),
    empAddress: document.getElementById("inputEmpAddress"),
    jobTitle: document.getElementById("inputJobTitle"),
    refNo: document.getElementById("inputRefNo"),
    startDate: document.getElementById("inputStartDate"),
    endDate: document.getElementById("inputEndDate"),
    issueDate: document.getElementById("inputIssueDate"),
    siteLocation: document.getElementById("inputSiteLocation"),
    companyName: document.getElementById("inputCompanyName"),
    companyAddress: document.getElementById("inputCompanyAddress"),
    companyContact: document.getElementById("inputCompanyContact"),
    signatoryName: document.getElementById("inputSignatoryName"),
    signatoryTitle: document.getElementById("inputSignatoryTitle"),
    duties: document.getElementById("inputDuties")
  };

  const els = {
    heroRole: document.getElementById("heroRole"),
    heroCertId: document.getElementById("heroCertId"),
    heroEmpName: document.getElementById("heroEmpName"),
    heroPassport: document.getElementById("heroPassport"),
    heroAccountNote: document.getElementById("heroAccountNote"),
    certLogoText: document.getElementById("certLogoText"),
    certCompanyName: document.getElementById("certCompanyName"),
    certCompanyAddress: document.getElementById("certCompanyAddress"),
    certCompanyContact: document.getElementById("certCompanyContact"),
    certRefNo: document.getElementById("certRefNo"),
    certIssueDate: document.getElementById("certIssueDate"),
    certEmpName: document.getElementById("certEmpName"),
    certFatherName: document.getElementById("certFatherName"),
    certDob: document.getElementById("certDob"),
    certEmpId: document.getElementById("certEmpId"),
    certPersonalNo: document.getElementById("certPersonalNo"),
    certEmpAddress: document.getElementById("certEmpAddress"),
    stripEmpName: document.getElementById("stripEmpName"),
    stripPassport: document.getElementById("stripPassport"),
    stripRole: document.getElementById("stripRole"),
    stripTenure: document.getElementById("stripTenure"),
    certBodyCompany: document.getElementById("certBodyCompany"),
    certJobTitle: document.getElementById("certJobTitle"),
    certSiteLocation: document.getElementById("certSiteLocation"),
    certStartDate: document.getElementById("certStartDate"),
    certEndDate: document.getElementById("certEndDate"),
    certDutiesList: document.getElementById("certDutiesList"),
    certEmpNameInline: document.getElementById("certEmpNameInline"),
    certSignatoryName: document.getElementById("certSignatoryName"),
    certSignatoryTitle: document.getElementById("certSignatoryTitle"),
    certSignatoryCompany: document.getElementById("certSignatoryCompany"),
    certQrId: document.getElementById("certQrId"),
    qrCanvas: document.getElementById("qrCanvas"),
    verifyForm: document.getElementById("verifyForm"),
    verifyInput: document.getElementById("verifyInput"),
    verifyResult: document.getElementById("verifyResult"),
    copyFeedback: document.getElementById("copyFeedback"),
    // Auth & Workspace elements
    authGuestActions: document.getElementById("authGuestActions"),
    authUserActions: document.getElementById("authUserActions"),
    headerUserAvatar: document.getElementById("headerUserAvatar"),
    headerUserName: document.getElementById("headerUserName"),
    customizerAuthGate: document.getElementById("customizerAuthGate"),
    customizerWorkspace: document.getElementById("customizerWorkspace"),
    savedCertSelect: document.getElementById("savedCertSelect"),
    saveFeedback: document.getElementById("saveFeedback"),
    authModal: document.getElementById("authModal"),
    authModalNotice: document.getElementById("authModalNotice"),
    tabSignIn: document.getElementById("tabSignIn"),
    tabSignUp: document.getElementById("tabSignUp"),
    signInForm: document.getElementById("signInForm"),
    signUpForm: document.getElementById("signUpForm"),
    signInEmail: document.getElementById("signInEmail"),
    signInPassword: document.getElementById("signInPassword"),
    signInError: document.getElementById("signInError"),
    signUpName: document.getElementById("signUpName"),
    signUpCompany: document.getElementById("signUpCompany"),
    signUpEmail: document.getElementById("signUpEmail"),
    signUpPassword: document.getElementById("signUpPassword"),
    signUpError: document.getElementById("signUpError")
  };

  let pendingAuthAction = null;

  /* ---------- Storage & Auth Helpers ---------- */

  function readJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }

  function hashPassword(password) {
    // Lightweight deterministic hash for client-side demo auth
    let hash = 2166136261;
    const salted = `workcert::${password}`;
    for (let i = 0; i < salted.length; i++) {
      hash ^= salted.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function getUsers() {
    const users = readJsonStorage(USERS_KEY, {});
    if (!users["admin@arfanagro.com"]) {
      users["admin@arfanagro.com"] = {
        name: "Md Zakir Hossain",
        company: "ARFAN AGRO & LIVESTOCK FARM",
        email: "admin@arfanagro.com",
        passwordHash: hashPassword("demo1234")
      };
      writeJsonStorage(USERS_KEY, users);
    }
    return users;
  }

  function getCurrentUser() {
    const session = readJsonStorage(SESSION_KEY, null);
    if (!session || !session.email) return null;
    const users = getUsers();
    return users[session.email.toLowerCase()] || null;
  }

  function setSession(email) {
    writeJsonStorage(SESSION_KEY, { email: email.toLowerCase(), signedInAt: Date.now() });
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
  }

  function getSavedCertificates() {
    return readJsonStorage(SAVED_CERTS_KEY, {});
  }

  function getAllKnownRecords() {
    return { ...RECORDS, ...getSavedCertificates() };
  }

  const COMPACT_KEY_MAP = {
    empName: "n",
    fatherName: "f",
    dob: "b",
    empId: "p",
    personalNo: "pn",
    empAddress: "a",
    jobTitle: "j",
    refNo: "r",
    startDate: "sd",
    endDate: "ed",
    issueDate: "id",
    siteLocation: "sl",
    companyName: "cn",
    companyAddress: "ca",
    companyContact: "cc",
    signatoryName: "sn",
    signatoryTitle: "st",
    duties: "du"
  };

  function encodeCertPayload(d) {
    try {
      const compact = {};
      for (const [fullKey, shortKey] of Object.entries(COMPACT_KEY_MAP)) {
        if (typeof d[fullKey] === "string" && d[fullKey].length > 0) {
          compact[shortKey] = d[fullKey];
        }
      }
      const json = JSON.stringify(compact);
      const bytes = new TextEncoder().encode(json);
      let bin = "";
      for (let i = 0; i < bytes.length; i++) {
        bin += String.fromCharCode(bytes[i]);
      }
      return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch {
      return "";
    }
  }

  function decodeCertPayload(token) {
    if (!token) return null;
    try {
      const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const bin = atob(padded);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      const json = new TextDecoder().decode(bytes);
      const compact = JSON.parse(json);
      if (!compact || typeof compact !== "object") return null;

      const restored = { ...DEFAULTS };
      for (const [fullKey, shortKey] of Object.entries(COMPACT_KEY_MAP)) {
        if (typeof compact[shortKey] === "string") {
          restored[fullKey] = compact[shortKey];
        }
      }
      return restored;
    } catch {
      return null;
    }
  }

  function buildVerificationUrl(d) {
    const id = (d.refNo || "").trim();
    const base = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(id)}`;
    const isBuiltIn = Object.values(RECORDS).some(
      (r) => r.refNo.toLowerCase() === id.toLowerCase() && JSON.stringify(r) === JSON.stringify(d)
    );
    if (isBuiltIn) return base;
    const payload = encodeCertPayload(d);
    return payload ? `${base}&d=${payload}` : base;
  }

  function getInitials(name) {
    const words = (name || "WC").trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /* ---------- Auth UI & Modal ---------- */

  function switchAuthTab(mode) {
    const isSignIn = mode === "signin";
    els.tabSignIn.classList.toggle("active", isSignIn);
    els.tabSignUp.classList.toggle("active", !isSignIn);
    els.tabSignIn.setAttribute("aria-selected", String(isSignIn));
    els.tabSignUp.setAttribute("aria-selected", String(!isSignIn));
    els.signInForm.hidden = !isSignIn;
    els.signUpForm.hidden = isSignIn;
    els.signInError.textContent = "";
    els.signUpError.textContent = "";
  }

  function openAuthModal(mode = "signin", notice = "", onAuthenticated = null) {
    pendingAuthAction = typeof onAuthenticated === "function" ? onAuthenticated : null;
    switchAuthTab(mode);

    if (notice) {
      els.authModalNotice.textContent = notice;
      els.authModalNotice.hidden = false;
    } else {
      els.authModalNotice.textContent = "";
      els.authModalNotice.hidden = true;
    }

    els.authModal.hidden = false;
    setTimeout(() => {
      if (mode === "signin") {
        els.signInEmail.focus();
      } else {
        els.signUpName.focus();
      }
    }, 30);
  }

  function closeAuthModal() {
    els.authModal.hidden = true;
    els.signInError.textContent = "";
    els.signUpError.textContent = "";
  }

  function requireAuth(action, notice = "Please sign in or create an account to create and customize certificates.") {
    const user = getCurrentUser();
    if (user) {
      action(user);
      return true;
    }
    openAuthModal("signin", notice, action);
    return false;
  }

  function populateSavedCertSelect(user) {
    if (!els.savedCertSelect) return;
    const saved = getSavedCertificates();
    const userCerts = Object.values(saved).filter(
      (c) => !c.ownerEmail || c.ownerEmail.toLowerCase() === user.email.toLowerCase()
    );

    const currentVal = els.savedCertSelect.value;
    els.savedCertSelect.innerHTML = "";

    const sampleOpt = document.createElement("option");
    sampleOpt.value = "AG-2026-0843";
    sampleOpt.textContent = `Sample: AG-2026-0843 (${DEFAULTS.empName})`;
    els.savedCertSelect.appendChild(sampleOpt);

    userCerts.forEach((cert) => {
      const opt = document.createElement("option");
      opt.value = cert.refNo;
      opt.textContent = `${cert.refNo} — ${cert.empName || "Untitled"}`;
      els.savedCertSelect.appendChild(opt);
    });

    if (currentVal && [...els.savedCertSelect.options].some((o) => o.value === currentVal)) {
      els.savedCertSelect.value = currentVal;
    }
  }

  function syncAuthUI() {
    const user = getCurrentUser();
    const isAuthed = Boolean(user);

    els.authGuestActions.hidden = isAuthed;
    els.authUserActions.hidden = !isAuthed;
    els.customizerAuthGate.hidden = isAuthed;
    els.customizerWorkspace.hidden = !isAuthed;

    if (isAuthed) {
      els.headerUserName.textContent = user.name;
      els.headerUserAvatar.textContent = getInitials(user.name);
      if (els.heroAccountNote) {
        els.heroAccountNote.classList.add("authenticated");
        els.heroAccountNote.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>Signed in as <strong>${escapeHtml(user.name)}</strong> &bull; Certificate creation unlocked</span>`;
      }
      populateSavedCertSelect(user);
    } else {
      if (els.heroAccountNote) {
        els.heroAccountNote.classList.remove("authenticated");
        els.heroAccountNote.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Sign in required to create or edit certificates.</span>`;
      }
    }
  }

  /* ---------- Certificate Form & Rendering ---------- */

  function getCurrentData() {
    const data = {};
    for (const [key, input] of Object.entries(fields)) {
      data[key] = input.value;
    }
    return data;
  }

  function setFormData(data) {
    for (const [key, input] of Object.entries(fields)) {
      if (typeof data[key] === "string") {
        input.value = data[key];
      }
    }
  }

  function drawVerificationMatrix(canvas, text) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;

    if (typeof window.qrcode === "function") {
      try {
        const eccLevel = text.length > 220 ? "L" : "M";
        const qr = window.qrcode(0, eccLevel);
        qr.addData(text);
        qr.make();
        const count = qr.getModuleCount();
        const cellSize = Math.floor(size / count);
        const offset = Math.floor((size - count * cellSize) / 2);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#111827";

        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
            }
          }
        }
        return;
      } catch {
        // Fall back to deterministic matrix below
      }
    }

    const cells = 21;
    const cellSize = Math.floor(size / cells);
    const offset = Math.floor((size - cells * cellSize) / 2);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#111827";

    const drawFinder = (r0, c0) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isBorder || isCenter) {
            ctx.fillRect(offset + (c0 + c) * cellSize, offset + (r0 + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, cells - 7);
    drawFinder(cells - 7, 0);

    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= cells - 8;
        const inBottomLeft = r >= cells - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        hash ^= (r * 31 + c * 17);
        hash = Math.imul(hash, 16777619);
        if ((hash >>> 0) % 2 === 0) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  function render() {
    const d = getCurrentData();

    // Hero card
    els.heroRole.textContent = d.jobTitle || DEFAULTS.jobTitle;
    els.heroCertId.textContent = d.refNo || DEFAULTS.refNo;
    els.heroEmpName.textContent = d.empName || DEFAULTS.empName;
    els.heroPassport.textContent = d.empId || DEFAULTS.empId;

    // Certificate header
    els.certLogoText.textContent = d.companyName.startsWith("[") ? "WC" : getInitials(d.companyName);
    els.certCompanyName.textContent = d.companyName;
    els.certCompanyAddress.textContent = d.companyAddress;
    els.certCompanyContact.textContent = d.companyContact;
    els.certRefNo.textContent = d.refNo;
    els.certIssueDate.textContent = d.issueDate;

    // Certificate body & summary strip
    els.certEmpName.textContent = d.empName;
    els.certFatherName.textContent = d.fatherName;
    els.certDob.textContent = d.dob;
    els.certEmpId.textContent = d.empId;
    els.certPersonalNo.textContent = d.personalNo;
    els.certEmpAddress.textContent = d.empAddress;
    if (els.stripEmpName) els.stripEmpName.textContent = d.empName;
    if (els.stripPassport) els.stripPassport.textContent = d.empId;
    if (els.stripRole) els.stripRole.textContent = d.jobTitle.split("(")[0].trim();
    if (els.stripTenure) els.stripTenure.textContent = `${d.startDate} \u2013 ${d.endDate}`;
    els.certBodyCompany.textContent = d.companyName;
    els.certJobTitle.textContent = d.jobTitle;
    els.certSiteLocation.textContent = d.siteLocation;
    els.certStartDate.textContent = d.startDate;
    els.certEndDate.textContent = d.endDate;
    els.certEmpNameInline.textContent = d.empName;

    // Duties list
    const lines = d.duties
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    els.certDutiesList.innerHTML = "";
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      els.certDutiesList.appendChild(li);
    });

    // Footer
    els.certSignatoryName.textContent = d.signatoryName;
    els.certSignatoryTitle.textContent = d.signatoryTitle;
    els.certSignatoryCompany.textContent = d.companyName;
    els.certQrId.textContent = d.refNo;

    const verifyUrl = buildVerificationUrl(d);
    drawVerificationMatrix(els.qrCanvas, verifyUrl);

    if (getCurrentUser()) {
      writeJsonStorage(STORAGE_KEY, d);
    }
  }

  function createNewCertificate() {
    const user = getCurrentUser();
    if (!user) return;

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    setFormData({
      ...DEFAULTS,
      empName: "",
      fatherName: "",
      dob: "",
      empId: "",
      personalNo: "",
      empAddress: "",
      refNo: `WC-${yyyy}-${randomNum}`,
      issueDate: `${dd}/${mm}/${yyyy}`,
      companyName: user.company || DEFAULTS.companyName,
      signatoryName: user.name ? user.name.toUpperCase() : DEFAULTS.signatoryName
    });

    render();
    document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => fields.empName.focus(), 250);
    els.saveFeedback.textContent = "New certificate draft created. Fill in employee details and click Save Certificate.";
  }

  function saveCurrentCertificate() {
    const user = getCurrentUser();
    if (!user) {
      openAuthModal("signin", "Sign in to save certificates to your account.");
      return;
    }

    const d = getCurrentData();
    const refNo = (d.refNo || "").trim();
    if (!refNo || !d.empName.trim()) {
      els.saveFeedback.style.color = "var(--danger)";
      els.saveFeedback.textContent = "Please enter both Employee Full Name and Certificate ID before saving.";
      return;
    }

    const saved = getSavedCertificates();
    saved[refNo] = {
      ...d,
      refNo,
      ownerEmail: user.email,
      savedAt: new Date().toISOString()
    };
    writeJsonStorage(SAVED_CERTS_KEY, saved);

    populateSavedCertSelect(user);
    if (els.savedCertSelect) {
      els.savedCertSelect.value = refNo;
    }

    els.saveFeedback.style.color = "var(--success)";
    els.saveFeedback.textContent = `Certificate ${refNo} saved to your account and enabled for online verification.`;
    setTimeout(() => {
      els.saveFeedback.textContent = "";
    }, 4500);
  }

  /* ---------- Verification ---------- */

  function runVerification(queryId, qrRecord = null) {
    const cleanQuery = (queryId || "").trim();
    const currentId = (fields.refNo.value || "").trim();
    const allRecords = getAllKnownRecords();

    if (!cleanQuery) {
      els.verifyResult.innerHTML = `
        <div class="verify-badge invalid">
          Please enter a Certificate ID to verify.
        </div>`;
      return;
    }

    const matchedRecord =
      Object.values(allRecords).find(
        (r) => r.refNo.toLowerCase() === cleanQuery.toLowerCase()
      ) ||
      (qrRecord && qrRecord.refNo && qrRecord.refNo.toLowerCase() === cleanQuery.toLowerCase()
        ? qrRecord
        : null);

    if (matchedRecord) {
      setFormData(matchedRecord);
      render();
      if (els.savedCertSelect && [...els.savedCertSelect.options].some((o) => o.value === matchedRecord.refNo)) {
        els.savedCertSelect.value = matchedRecord.refNo;
      }
      els.verifyResult.innerHTML = `
        <div class="verify-badge valid">
          <strong>Verified Record Found (${escapeHtml(matchedRecord.refNo)})</strong><br />
          Employee: ${escapeHtml(matchedRecord.empName)} &bull;
          Role: ${escapeHtml(matchedRecord.jobTitle)} &bull;
          Employer: ${escapeHtml(matchedRecord.companyName)} &bull;
          Period: ${escapeHtml(matchedRecord.startDate)} &ndash; ${escapeHtml(matchedRecord.endDate)}
        </div>`;
    } else if (getCurrentUser() && cleanQuery.toLowerCase() === currentId.toLowerCase()) {
      els.verifyResult.innerHTML = `
        <div class="verify-badge valid">
          <strong>Active Draft Record (${escapeHtml(currentId)})</strong><br />
          Employee: ${escapeHtml(fields.empName.value)} &bull;
          Role: ${escapeHtml(fields.jobTitle.value)} &bull;
          Employer: ${escapeHtml(fields.companyName.value)} &bull;
          Period: ${escapeHtml(fields.startDate.value)} &ndash; ${escapeHtml(fields.endDate.value)}
        </div>`;
    } else {
      els.verifyResult.innerHTML = `
        <div class="verify-badge invalid">
          <strong>No matching record found</strong> for ID <code>${escapeHtml(cleanQuery)}</code>.
          Sample verified ID is <code>AG-2026-0843</code>.
        </div>`;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Init & Event Listeners ---------- */

  function init() {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    const urlData = params.get("d");
    const allRecords = getAllKnownRecords();

    const decodedFromUrl = urlData ? decodeCertPayload(urlData) : null;
    const urlRecord = urlId
      ? Object.values(allRecords).find((r) => r.refNo.toLowerCase() === urlId.trim().toLowerCase()) ||
        (decodedFromUrl && decodedFromUrl.refNo && decodedFromUrl.refNo.toLowerCase() === urlId.trim().toLowerCase()
          ? decodedFromUrl
          : null)
      : null;

    if (urlRecord) {
      setFormData(urlRecord);
    } else if (getCurrentUser()) {
      const savedDraft = readJsonStorage(STORAGE_KEY, null);
      if (savedDraft) {
        setFormData({ ...DEFAULTS, ...savedDraft });
      } else {
        setFormData(DEFAULTS);
      }
    } else {
      setFormData(DEFAULTS);
    }

    syncAuthUI();
    render();

    // Auth Modal Controls
    document.getElementById("btnOpenSignIn").addEventListener("click", () => openAuthModal("signin"));
    document.getElementById("btnOpenSignUp").addEventListener("click", () => openAuthModal("signup"));
    document.getElementById("btnGateSignIn").addEventListener("click", () => {
      openAuthModal("signin", "Sign in to unlock certificate creation and customization.", () => {
        document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
      });
    });
    document.getElementById("btnGateSignUp").addEventListener("click", () => {
      openAuthModal("signup", "Create a free account to issue and customize certificates.", () => {
        document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
      });
    });
    document.getElementById("btnCloseAuthModal").addEventListener("click", closeAuthModal);
    els.authModal.addEventListener("click", (e) => {
      if (e.target === els.authModal) closeAuthModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els.authModal.hidden) closeAuthModal();
    });

    els.tabSignIn.addEventListener("click", () => switchAuthTab("signin"));
    els.tabSignUp.addEventListener("click", () => switchAuthTab("signup"));

    // Sign In Submit
    els.signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = els.signInEmail.value.trim().toLowerCase();
      const password = els.signInPassword.value;
      const users = getUsers();
      const user = users[email];

      if (!user || user.passwordHash !== hashPassword(password)) {
        els.signInError.textContent = "Invalid email or password. Try the demo account or create a new account.";
        return;
      }

      setSession(email);
      syncAuthUI();
      closeAuthModal();
      els.signInForm.reset();

      if (pendingAuthAction) {
        const cb = pendingAuthAction;
        pendingAuthAction = null;
        cb(user);
      }
    });

    // Demo Login
    document.getElementById("btnDemoLogin").addEventListener("click", () => {
      const users = getUsers();
      const demoUser = users["admin@arfanagro.com"];
      setSession(demoUser.email);
      syncAuthUI();
      closeAuthModal();

      if (pendingAuthAction) {
        const cb = pendingAuthAction;
        pendingAuthAction = null;
        cb(demoUser);
      }
    });

    // Sign Up Submit
    els.signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = els.signUpName.value.trim();
      const company = els.signUpCompany.value.trim();
      const email = els.signUpEmail.value.trim().toLowerCase();
      const password = els.signUpPassword.value;

      if (!name || !email || password.length < 6) {
        els.signUpError.textContent = "Please fill in your name, valid email, and a password of at least 6 characters.";
        return;
      }

      const users = getUsers();
      if (users[email]) {
        els.signUpError.textContent = "An account with this email already exists. Please sign in instead.";
        return;
      }

      users[email] = {
        name,
        company,
        email,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
      };
      writeJsonStorage(USERS_KEY, users);
      setSession(email);
      syncAuthUI();
      closeAuthModal();
      els.signUpForm.reset();

      if (pendingAuthAction) {
        const cb = pendingAuthAction;
        pendingAuthAction = null;
        cb(users[email]);
      }
    });

    // Sign Out
    document.getElementById("btnSignOut").addEventListener("click", () => {
      clearSession();
      setFormData(DEFAULTS);
      render();
      syncAuthUI();
    });

    // Gated Create / Edit triggers
    document.getElementById("btnHeroCreateCert").addEventListener("click", () => {
      requireAuth(() => {
        document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => fields.empName.focus(), 250);
      }, "Sign in or create an account to create a new certificate.");
    });

    document.getElementById("btnToggleEdit").addEventListener("click", () => {
      requireAuth(() => {
        document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => fields.empName.focus(), 250);
      }, "You must sign in or create an account before customizing or creating certificates.");
    });

    document.getElementById("btnNewCertHeader").addEventListener("click", () => {
      requireAuth(createNewCertificate);
    });

    document.getElementById("btnNewCert").addEventListener("click", () => {
      requireAuth(createNewCertificate);
    });

    document.getElementById("btnSaveCert").addEventListener("click", saveCurrentCertificate);

    if (els.savedCertSelect) {
      els.savedCertSelect.addEventListener("change", () => {
        const all = getAllKnownRecords();
        const rec = all[els.savedCertSelect.value];
        if (rec) {
          setFormData(rec);
          render();
        }
      });
    }

    // Live input listeners (only active inside unlocked workspace)
    Object.values(fields).forEach((input) => {
      input.addEventListener("input", () => {
        if (!getCurrentUser()) return;
        render();
      });
    });

    // Print buttons
    document.getElementById("btnPrintMain").addEventListener("click", () => window.print());
    const btnPrintQr = document.getElementById("btnPrintQr");
    if (btnPrintQr) btnPrintQr.addEventListener("click", () => window.print());

    // Direct PDF Download buttons
    const pdfButtons = [
      document.getElementById("btnDownloadPdfHero"),
      document.getElementById("btnDownloadPdfMain"),
      document.getElementById("btnDownloadPdfQr")
    ].filter(Boolean);

    pdfButtons.forEach((btn) => {
      btn.addEventListener("click", () => downloadCertificatePdf(pdfButtons));
    });

    // Reset sample button
    document.getElementById("btnResetDemo").addEventListener("click", () => {
      if (!getCurrentUser()) return;
      setFormData(DEFAULTS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      if (els.savedCertSelect) els.savedCertSelect.value = "AG-2026-0843";
      els.saveFeedback.textContent = "";
      render();
    });

    // Copy verification link
    document.getElementById("btnCopyLink").addEventListener("click", async () => {
      const url = buildVerificationUrl(getCurrentData());
      try {
        await navigator.clipboard.writeText(url);
        els.copyFeedback.textContent = "Verification link copied to clipboard!";
      } catch {
        els.copyFeedback.textContent = `Share link: ${url}`;
      }
      setTimeout(() => {
        els.copyFeedback.textContent = "";
      }, 3500);
    });

    // Verify form submit
    els.verifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runVerification(els.verifyInput.value);
    });

    setupQrScanner();

    // If opened via QR scan (?id=...), show ONLY the certificate & PDF download bar
    if (urlId) {
      document.body.classList.add("qr-only-view");
      const qrViewBar = document.getElementById("qrViewBar");
      const qrViewStatus = document.getElementById("qrViewStatus");
      if (qrViewBar) qrViewBar.hidden = false;

      const matches = Boolean(urlRecord);
      if (qrViewStatus) {
        qrViewStatus.innerHTML = matches
          ? `<span class="dot"></span><span>Verified Certificate (${escapeHtml(urlRecord.refNo)})</span>`
          : `<span>Record ID not found (${escapeHtml(urlId)})</span>`;
      }

      els.verifyInput.value = urlId;
      runVerification(urlId, urlRecord);
    }
  }

  function extractQrPayload(raw) {
    const trimmed = (raw || "").trim();
    try {
      const parsed = new URL(trimmed);
      const paramId = parsed.searchParams.get("id");
      const paramData = parsed.searchParams.get("d");
      const record = paramData ? decodeCertPayload(paramData) : null;
      if (paramId) return { id: paramId, record };
    } catch {
      // Not a full URL; treat as raw Certificate ID
    }
    return { id: trimmed, record: null };
  }

  function setupQrScanner() {
    const btnScan = document.getElementById("btnScanQr");
    const btnStop = document.getElementById("btnStopScan");
    const fileInput = document.getElementById("qrFileInput");
    const box = document.getElementById("qrScannerBox");
    const video = document.getElementById("qrVideo");
    const statusEl = document.getElementById("qrScannerStatus");
    let stream = null;
    let scanTimer = null;

    function stopCamera() {
      if (scanTimer) {
        clearInterval(scanTimer);
        scanTimer = null;
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
      video.srcObject = null;
      box.hidden = true;
    }

    if (btnStop) {
      btnStop.addEventListener("click", stopCamera);
    }

    if (btnScan) {
      btnScan.addEventListener("click", async () => {
        if (!("BarcodeDetector" in window)) {
          els.verifyResult.innerHTML = `
            <div class="verify-badge invalid">
              In-browser camera QR scanning requires Chrome, Edge, or Android. You can still scan the certificate QR code directly with your phone camera, or enter the Certificate ID above.
            </div>`;
          return;
        }
        try {
          const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          video.srcObject = stream;
          await video.play();
          box.hidden = false;
          statusEl.textContent = "Point camera at the certificate QR code...";

          scanTimer = setInterval(async () => {
            if (video.readyState < 2) return;
            try {
              const codes = await detector.detect(video);
              if (codes.length > 0 && codes[0].rawValue) {
                const { id: certId, record: qrRecord } = extractQrPayload(codes[0].rawValue);
                els.verifyInput.value = certId;
                stopCamera();
                runVerification(certId, qrRecord);
              }
            } catch {
              // Continue scanning frames
            }
          }, 300);
        } catch {
          stopCamera();
          els.verifyResult.innerHTML = `
            <div class="verify-badge invalid">
              Could not access camera. Please allow camera permission or upload a QR image instead.
            </div>`;
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!("BarcodeDetector" in window)) {
          els.verifyResult.innerHTML = `
            <div class="verify-badge invalid">
              Image QR decoding requires Chrome, Edge, or Android. You can scan the QR code with your phone camera or enter the ID manually.
            </div>`;
          fileInput.value = "";
          return;
        }
        try {
          const bitmap = await createImageBitmap(file);
          const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          const codes = await detector.detect(bitmap);
          if (codes.length > 0 && codes[0].rawValue) {
            const { id: certId, record: qrRecord } = extractQrPayload(codes[0].rawValue);
            els.verifyInput.value = certId;
            runVerification(certId, qrRecord);
          } else {
            els.verifyResult.innerHTML = `
              <div class="verify-badge invalid">
                No QR code detected in the selected image.
              </div>`;
          }
        } catch {
          els.verifyResult.innerHTML = `
            <div class="verify-badge invalid">
              Unable to read QR code from the selected image.
            </div>`;
        }
        fileInput.value = "";
      });
    }
  }

  async function downloadCertificatePdf(buttons) {
    const sheet = document.getElementById("certificateSheet");
    if (!sheet) return;

    if (typeof window.html2pdf !== "function") {
      window.print();
      return;
    }

    const originalLabels = buttons.map((b) => b.textContent);
    buttons.forEach((b) => {
      b.disabled = true;
      b.textContent = "Generating PDF...";
    });

    const empName = (fields.empName.value || "Certificate")
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    const filename = `${empName}_Work_Experience_Certificate.pdf`;

    sheet.classList.add("pdf-exporting");

    try {
      await window.html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .from(sheet)
        .save();
    } catch {
      window.print();
    } finally {
      sheet.classList.remove("pdf-exporting");
      buttons.forEach((b, idx) => {
        b.disabled = false;
        b.textContent = originalLabels[idx];
      });
    }
  }

  init();
})();
