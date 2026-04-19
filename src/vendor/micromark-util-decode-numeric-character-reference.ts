const c1Replacements = new Map<number, number>([
  [0x80, 0x20ac],
  [0x82, 0x201a],
  [0x83, 0x0192],
  [0x84, 0x201e],
  [0x85, 0x2026],
  [0x86, 0x2020],
  [0x87, 0x2021],
  [0x88, 0x02c6],
  [0x89, 0x2030],
  [0x8a, 0x0160],
  [0x8b, 0x2039],
  [0x8c, 0x0152],
  [0x8e, 0x017d],
  [0x91, 0x2018],
  [0x92, 0x2019],
  [0x93, 0x201c],
  [0x94, 0x201d],
  [0x95, 0x2022],
  [0x96, 0x2013],
  [0x97, 0x2014],
  [0x98, 0x02dc],
  [0x99, 0x2122],
  [0x9a, 0x0161],
  [0x9b, 0x203a],
  [0x9c, 0x0153],
  [0x9e, 0x017e],
  [0x9f, 0x0178],
]);

function isDisallowedControl(codePoint: number) {
  if (
    codePoint === 0x09 ||
    codePoint === 0x0a ||
    codePoint === 0x0c ||
    codePoint === 0x0d
  ) {
    return false;
  }

  return (
    (codePoint >= 0x00 && codePoint <= 0x1f) ||
    (codePoint >= 0x7f && codePoint <= 0x9f)
  );
}

function isNonCharacter(codePoint: number) {
  if (codePoint >= 0xfdd0 && codePoint <= 0xfdef) {
    return true;
  }

  return (codePoint & 0xfffe) === 0xfffe;
}

export function decodeNumericCharacterReference(value: string, base: number) {
  const codePoint = Number.parseInt(value, base);

  if (!Number.isFinite(codePoint) || Number.isNaN(codePoint)) {
    return "\n";
  }

  const normalizedCodePoint = c1Replacements.get(codePoint) ?? codePoint;

  if (
    normalizedCodePoint <= 0 ||
    normalizedCodePoint > 0x10ffff ||
    (normalizedCodePoint >= 0xd800 && normalizedCodePoint <= 0xdfff) ||
    isNonCharacter(normalizedCodePoint)
  ) {
    return "\ufffd";
  }

  if (isDisallowedControl(normalizedCodePoint)) {
    return "\ufffd";
  }

  return String.fromCodePoint(normalizedCodePoint);
}
