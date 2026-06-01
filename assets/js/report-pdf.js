/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

// Minimal PDF writer for report image export.
async function makePdfFromImageBlob(imageBlob, imageWidth, imageHeight) {
  const imageBytes = new Uint8Array(await imageBlob.arrayBuffer());
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const imageRatio = imageWidth / imageHeight;
  const pageRatio = pageWidth / pageHeight;
  const drawWidth = imageRatio > pageRatio ? pageWidth : pageHeight * imageRatio;
  const drawHeight = imageRatio > pageRatio ? pageWidth / imageRatio : pageHeight;
  const drawX = (pageWidth - drawWidth) / 2;
  const drawY = pageHeight - drawHeight;
  const content = `q\n${trim(drawWidth)} 0 0 ${trim(drawHeight)} ${trim(drawX)} ${trim(drawY)} cm\n/Im0 Do\nQ`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${trim(pageWidth)} ${trim(pageHeight)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    {
      header: `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>`,
      bytes: imageBytes,
    },
    `<< /Length ${byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  return buildPdf(objects);
}

function buildPdf(objects) {
  const chunks = [];
  const offsets = [0];
  let position = 0;
  const appendText = (text) => {
    const bytes = new TextEncoder().encode(text);
    chunks.push(bytes);
    position += bytes.length;
  };
  const appendBytes = (bytes) => {
    chunks.push(bytes);
    position += bytes.length;
  };

  appendText("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  objects.forEach((object, index) => {
    offsets[index + 1] = position;
    appendText(`${index + 1} 0 obj\n`);
    if (typeof object === "string") {
      appendText(`${object}\n`);
    } else {
      appendText(`${object.header}\nstream\n`);
      appendBytes(object.bytes);
      appendText("\nendstream\n");
    }
    appendText("endobj\n");
  });

  const xrefOffset = position;
  appendText(`xref\n0 ${objects.length + 1}\n`);
  appendText("0000000000 65535 f \n");
  for (let index = 1; index <= objects.length; index += 1) {
    appendText(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }
  appendText(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(chunks, { type: "application/pdf" });
}

function byteLength(text) {
  return new TextEncoder().encode(text).length;
}
