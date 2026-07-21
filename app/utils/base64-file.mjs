function base64ToBytes(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function findKnownFileSignature(bytes) {
  const signatures = [
    [0x25, 0x50, 0x44, 0x46], // PDF
    [0x50, 0x4b, 0x03, 0x04], // DOCX/XLSX/PPTX/ZIP
    [0x50, 0x4b, 0x05, 0x06],
    [0x50, 0x4b, 0x07, 0x08],
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], // DOC/XLS/PPT
  ];

  const searchLength = Math.min(bytes.length, 1024);

  for (let offset = 0; offset < searchLength; offset += 1) {
    const found = signatures.some((signature) =>
      signature.every((value, index) => bytes[offset + index] === value)
    );

    if (found) return offset;
  }

  return -1;
}

function normalizeBase64(value) {
  let normalized = value.trim().replace(/^['"]+|['"]+$/g, "").trim();

  if (normalized.includes(",")) {
    normalized = normalized.slice(normalized.indexOf(",") + 1);
  }

  return normalized.replace(/\s/g, "");
}

function isBase64(value) {
  return (
    value.length > 0 &&
    value.length % 4 === 0 &&
    /^[A-Za-z0-9+/]+={0,2}$/.test(value)
  );
}

export function decodeBase64File(data) {
  let encoded = normalizeBase64(data);
  let decoded = null;

  for (let pass = 0; pass < 3 && isBase64(encoded); pass += 1) {
    decoded = base64ToBytes(encoded);
    const signatureOffset = findKnownFileSignature(decoded);

    if (signatureOffset >= 0) {
      return signatureOffset === 0 ? decoded : decoded.slice(signatureOffset);
    }

    encoded = normalizeBase64(new TextDecoder().decode(decoded));
  }

  if (decoded) return decoded;

  throw new Error("Invalid base64 file data");
}
