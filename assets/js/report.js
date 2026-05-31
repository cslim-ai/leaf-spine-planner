// A4 one-page report SVG export helpers.
// This file uses app globals at click time and diagram SVG helpers from diagram.js.

const REPORT_FONT_BASE_PATH = "assets/fonts/Pretendard-1.3.9/web/static/woff2-subset";
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
          src: url("${urls.regular}") format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.medium}") format("woff2");
          font-weight: 500;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.semiBold}") format("woff2");
          font-weight: 600;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.bold}") format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.extraBold}") format("woff2");
          font-weight: 800;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "Pretendard";
          src: url("${urls.black}") format("woff2");
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
  const [regular, medium, semiBold, bold, extraBold, black] = await Promise.all([
    fetchReportFontDataUrl(`${REPORT_FONT_BASE_PATH}/Pretendard-Regular.subset.woff2`),
    fetchReportFontDataUrl(`${REPORT_FONT_BASE_PATH}/Pretendard-Medium.subset.woff2`),
    fetchReportFontDataUrl(`${REPORT_FONT_BASE_PATH}/Pretendard-SemiBold.subset.woff2`),
    fetchReportFontDataUrl(`${REPORT_FONT_BASE_PATH}/Pretendard-Bold.subset.woff2`),
    fetchReportFontDataUrl(`${REPORT_FONT_BASE_PATH}/Pretendard-ExtraBold.subset.woff2`),
    fetchReportFontDataUrl(`${REPORT_FONT_BASE_PATH}/Pretendard-Black.subset.woff2`),
  ]);
  return { regular, medium, semiBold, bold, extraBold, black };
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
