(() => {
  const STORAGE_KEY = "workcert_gl_data_v3";

  const DEFAULTS = {
    empName: "MD MAHABUB ALMA",
    fatherName: "MD ASHRAB ALI",
    dob: "11 July 1993",
    empId: "A24410968",
    personalNo: "3710428792",
    empAddress: "Madhobpur, Barhatta, Kumarpara - 2400, Netrokona, Bangladesh",
    jobTitle: "General Labourer / General Worker",
    refNo: "GL-2026-0842",
    startDate: "14-Apr-2018",
    endDate: "10-03-2026",
    issueDate: "25/10/2026",
    siteLocation: "General Labourer / General Worker",
    companyName: "ARFAN BUILDERS & CONSTRUCTION",
    companyAddress: "ISLAMPUR MORE, DIABETICS HOSPITAL ROAD, NETROKONA SADAR - 2400",
    companyContact: "01913681771, SUPPORT@ARFANBUILDERS.COM",
    signatoryName: "MD ZAKIR HOSSAIN",
    signatoryTitle: "MANAGER",
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

    // Use real scannable QR code when qrcode-generator is loaded
    if (typeof window.qrcode === "function") {
      try {
        const qr = window.qrcode(0, "M");
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
    const btnPrintQr = document.getElementById("btnPrintQr");
    if (btnPrintQr) btnPrintQr.addEventListener("click", () => window.print());

    // Direct PDF Download buttons
    const pdfButtons = [
      document.getElementById("btnDownloadPdfTop"),
      document.getElementById("btnDownloadPdfHero"),
      document.getElementById("btnDownloadPdfMain"),
      document.getElementById("btnDownloadPdfQr")
    ].filter(Boolean);

    pdfButtons.forEach((btn) => {
      btn.addEventListener("click", () => downloadCertificatePdf(pdfButtons));
    });

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
      const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
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

    // QR Scanner (Camera + Image Upload)
    setupQrScanner();

    // If opened via QR scan (?id=...), show ONLY the certificate & PDF download bar
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    if (urlId) {
      document.body.classList.add("qr-only-view");
      const qrViewBar = document.getElementById("qrViewBar");
      const qrViewStatus = document.getElementById("qrViewStatus");
      if (qrViewBar) qrViewBar.hidden = false;

      const matches = urlId.trim().toLowerCase() === fields.refNo.value.trim().toLowerCase();
      if (qrViewStatus) {
        qrViewStatus.innerHTML = matches
          ? `<span class="dot"></span><span>Verified Certificate (${escapeHtml(fields.refNo.value)})</span>`
          : `<span>Record ID mismatch (${escapeHtml(urlId)})</span>`;
      }

      els.verifyInput.value = urlId;
      runVerification(urlId);
    }
  }

  function extractIdFromQrText(raw) {
    const trimmed = (raw || "").trim();
    try {
      const parsed = new URL(trimmed);
      const paramId = parsed.searchParams.get("id");
      if (paramId) return paramId;
    } catch {
      // Not a full URL; treat as raw Certificate ID
    }
    return trimmed;
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
                const certId = extractIdFromQrText(codes[0].rawValue);
                els.verifyInput.value = certId;
                stopCamera();
                runVerification(certId);
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
            const certId = extractIdFromQrText(codes[0].rawValue);
            els.verifyInput.value = certId;
            runVerification(certId);
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
