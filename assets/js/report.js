// A4 one-page report SVG export helpers.
// This file uses app globals at click time and diagram SVG helpers from diagram.js.

const REPORT_FONT_URL = "assets/fonts/Pretendard-Regular.ttf";
let reportFontCssPromise = null;

async function exportPagePdf() {
  return exportReport("pdf");
}

async function exportReport(format = "pdf") {
  if (typeof latestResult !== "undefined" && latestResult?.feasible === false) {
    alert("구성 불가 상태에서는 보고서를 생성할 수 없습니다. 입력값을 조정해 구성 가능한 결과가 나온 뒤 다시 시도해 주세요.");
    return;
  }
  if (!currentResult) return;
  const button = outputs.exportPdf;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "저장 중...";

  try {
    const generatedAt = makeExportTimestamp();
    if (format === "svg") {
      const blob = await makeReportSvgBlob(generatedAt.display);
      downloadBlob(blob, exportFilename("leaf-spine-topology-report", "svg", generatedAt));
      return;
    }

    const canvas = await renderReportCanvas(generatedAt.display);
    const jpegBlob = await canvasToBlob(canvas, "image/jpeg", 0.94);
    const pdfBlob = await makePdfFromImageBlob(jpegBlob, canvas.width, canvas.height);
    downloadBlob(pdfBlob, exportFilename("leaf-spine-topology-report", "pdf", generatedAt));
  } catch (error) {
    console.error(error);
    alert("리포트 파일을 만드는 중 오류가 발생했습니다.");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function exportReportSvg() {
  return exportReport("svg");
}

async function makeReportSvgBlob(generatedAtText) {
  const fontCss = await getEmbeddedReportFontCss();
  const svgText = makeReportSvg(generatedAtText, fontCss);
  return new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
}

function getEmbeddedReportFontCss() {
  if (!reportFontCssPromise) {
    reportFontCssPromise = getReportFontDataUrls()
      .then((urls) => `
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.thin}") format("truetype");
          font-weight: 100;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.extraLight}") format("truetype");
          font-weight: 200;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.light}") format("truetype");
          font-weight: 300;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.regular}") format("truetype");
          font-weight: 400;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.medium}") format("truetype");
          font-weight: 500;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.semiBold}") format("truetype");
          font-weight: 600;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.bold}") format("truetype");
          font-weight: 700;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.extraBold}") format("truetype");
          font-weight: 800;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.black}") format("truetype");
          font-weight: 900;
          font-style: normal;
          font-display: block;
        }
      `);
  }
  return reportFontCssPromise;
}

async function getReportFontDataUrls() {
  if (window.LEAF_SPINE_FONT_DATA_URLS) {
    return window.LEAF_SPINE_FONT_DATA_URLS;
  }
  const [thin, extraLight, light, regular, medium, semiBold, bold, extraBold, black] = await Promise.all([
    fetchReportFontDataUrl("assets/fonts/Pretendard-Thin.ttf"),
    fetchReportFontDataUrl("assets/fonts/Pretendard-ExtraLight.ttf"),
    fetchReportFontDataUrl("assets/fonts/Pretendard-Light.ttf"),
    fetchReportFontDataUrl(REPORT_FONT_URL),
    fetchReportFontDataUrl("assets/fonts/Pretendard-Medium.ttf"),
    fetchReportFontDataUrl("assets/fonts/Pretendard-SemiBold.ttf"),
    fetchReportFontDataUrl("assets/fonts/Pretendard-Bold.ttf"),
    fetchReportFontDataUrl("assets/fonts/Pretendard-ExtraBold.ttf"),
    fetchReportFontDataUrl("assets/fonts/Pretendard-Black.ttf"),
  ]);
  return { thin, extraLight, light, regular, medium, semiBold, bold, extraBold, black };
}

async function fetchReportFontDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font load failed: ${response.status}`);
  return blobToDataUrl(await response.blob());
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
