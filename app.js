(() => {
  const STORAGE_KEY = "workcert_gl_data_v2";

  const DEFAULTS = {
    empName: "MD MAHABUB ALMA",
    fatherName: "MD ASHRAB ALI",
    dob: "11 July 1993",
    empId: "A24410968",
    personalNo: "3710428792",
    empAddress: "Madhobpur, Barhatta, Kumarpara - 2400, Netrokona, Bangladesh",
    jobTitle: "General Labourer / General Worker",
    refNo: "GL-2026-0842",
    startDate: "[Start Date]",
    endDate: "[End Date]",
    issueDate: "November 25, 2026",
    siteLocation: "[Work Site / Project Location]",
    companyName: "[Employer / Company Name]",
    companyAddress: "[Employer Address]",
    companyContact: "[Employer Phone & Email]",
    signatoryName: "[Authorized Signatory Name]",
    signatoryTitle: "[Designation / Title]",
    duties: [
      "Performing general labouring, site preparation, cleaning, and material handling duties as assigned.",
      "Assisting skilled tradespeople (masons, carpenters, and technicians) with daily site operations.",
      "Loading, unloading, sorting, and transporting construction materials, tools, and equipment safely.",
      "Operating basic hand and power tools in accordance with workplace safety rules and instructions.",
      "Maintaining workplace cleanliness, PPE compliance, punctuality, and teamwork standards."
    ].join("\n")
  };

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
    copyFeedback: document.getElementById("copyFeedback")
  };

  function getInitials(name) {
    const words = (name || "WC").trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

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
    const cells = 21;
    const cellSize = Math.floor(size / cells);
    const offset = Math.floor((size - cells * cellSize) / 2);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#111827";

    // Draw standard 3 finder squares
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

    // Deterministic hash pattern for certificate ID
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
    els.certLogoText.textContent = d.companyName.startsWith("[") ? "GL" : getInitials(d.companyName);
    els.certCompanyName.textContent = d.companyName;
    els.certCompanyAddress.textContent = d.companyAddress;
    els.certCompanyContact.textContent = d.companyContact;
    els.certRefNo.textContent = d.refNo;
    els.certIssueDate.textContent = d.issueDate;

    // Certificate body
    els.certEmpName.textContent = d.empName;
    els.certFatherName.textContent = d.fatherName;
    els.certDob.textContent = d.dob;
    els.certEmpId.textContent = d.empId;
    els.certPersonalNo.textContent = d.personalNo;
    els.certEmpAddress.textContent = d.empAddress;
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

    const verifyUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(d.refNo)}`;
    drawVerificationMatrix(els.qrCanvas, verifyUrl);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }

  function runVerification(queryId) {
    const cleanQuery = (queryId || "").trim();
    const currentId = (fields.refNo.value || "").trim();

    if (!cleanQuery) {
      els.verifyResult.innerHTML = `
        <div class="verify-badge invalid">
          Please enter a Certificate ID to verify.
        </div>`;
      return;
    }

    if (cleanQuery.toLowerCase() === currentId.toLowerCase()) {
      els.verifyResult.innerHTML = `
        <div class="verify-badge valid">
          <strong>Verified Record Found (${currentId})</strong><br />
          Employee: ${escapeHtml(fields.empName.value)} &bull;
          Role: ${escapeHtml(fields.jobTitle.value)} &bull;
          Employer: ${escapeHtml(fields.companyName.value)} &bull;
          Period: ${escapeHtml(fields.startDate.value)} &ndash; ${escapeHtml(fields.endDate.value)}
        </div>`;
    } else {
      els.verifyResult.innerHTML = `
        <div class="verify-badge invalid">
          <strong>No matching record found</strong> for ID <code>${escapeHtml(cleanQuery)}</code>.
          Active certificate ID on this page is <code>${escapeHtml(currentId)}</code>.
        </div>`;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function init() {
    // Load saved data if available
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFormData({ ...DEFAULTS, ...JSON.parse(saved) });
      }
    } catch {
      setFormData(DEFAULTS);
    }

    render();

    // Live input listeners
    Object.values(fields).forEach((input) => {
      input.addEventListener("input", render);
    });

    // Print buttons
    document.getElementById("btnPrintTop").addEventListener("click", () => window.print());
    document.getElementById("btnPrintMain").addEventListener("click", () => window.print());

    // Edit scroll button
    document.getElementById("btnToggleEdit").addEventListener("click", () => {
      document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
      fields.empName.focus();
    });

    // Reset sample button
    document.getElementById("btnResetDemo").addEventListener("click", () => {
      setFormData(DEFAULTS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      render();
    });

    // Copy verification link
    document.getElementById("btnCopyLink").addEventListener("click", async () => {
      const id = encodeURIComponent(fields.refNo.value.trim());
      const url = `${window.location.origin}${window.location.pathname}?id=${id}#verify`;
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

    // Auto-verify if ?id= is present in URL
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    if (urlId) {
      els.verifyInput.value = urlId;
      runVerification(urlId);
    }
  }

  init();
})();
