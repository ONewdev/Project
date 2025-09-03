// ===== helper =====
function belowMin(parsed, type) {
  if (!parsed) return true;
  switch (type) {
    case 'หน้าต่างบานเลื่อน2':
      return parsed.widthCm < 40 || parsed.heightCm < 40;
    case 'หน้าต่างบานเลื่อน4':
      return parsed.widthCm < 60 || parsed.heightCm < 40;
    case 'ประตูบานเลื่อน2':
      return parsed.widthCm < 60 || parsed.heightCm < 200;
    case 'ประตูบานเลื่อน4':
      return parsed.widthCm < 120 || parsed.heightCm < 200;
    case 'ประตูสวิง':
      return parsed.widthCm < 60 || parsed.heightCm < 200;
    case 'ประตูมุ้ง':
      return parsed.widthCm < 60 || parsed.heightCm < 200;
    case 'ประตูรางแขวน':
      return parsed.widthCm < 120 || parsed.heightCm < 200;
    case 'บานเฟี้ยม':
      return parsed.widthCm < 120 || parsed.heightCm < 200;
    case 'บานตาย':
      return parsed.widthCm < 40 || parsed.heightCm < 40;
    case 'ชาวเวอร์':
      return parsed.widthCm < 60 || parsed.heightCm < 180;
    case 'ตู้เฟอร์นิเจอร์':
      return parsed.widthCm < 30; // สมมติใช้ width เป็นความยาว
    default:
      return false;
  }
}

// ===== calculators =====
export function calcWindow2({ parsed, quantity = 1, hasScreen = false, color = '' }) {
  const isStandard = parsed.widthCm <= 180 && parsed.heightCm <= 120;
  let price = isStandard ? 3000 : 4000;
  if (hasScreen) price += 500;
  const isBlack = color.trim() === 'ดำ' || color.toLowerCase() === 'black';
  if (isBlack) price += 300;
  return price * quantity;
}

export function calcWindow4({ parsed, quantity = 1, hasScreen = false, color = '' }) {
  const isStandard = parsed.widthCm <= 240 && parsed.heightCm <= 120;
  let price = isStandard ? 4000 : 4500;
  if (hasScreen) price += 500;
  const isBlack = color.trim() === 'ดำ' || color.toLowerCase() === 'black';
  if (isBlack) price += 300;
  return price * quantity;
}

export function calcDoorSlide2({ parsed, quantity = 1 }) {
  return 1800 * parsed.widthM * parsed.heightM * quantity;
}
export function calcDoorSlide4({ parsed, quantity = 1 }) {
  return 3600 * parsed.widthM * parsed.heightM * quantity;
}

export function calcSwing({ parsed, quantity = 1, swingType = 'บานเดี่ยว' }) {
  if (swingType === 'บานคู่') return 14000 * quantity;
  if (parsed.widthM <= 1.2 && parsed.heightM <= 2) return 7000 * quantity;
  return 0; // เกินมาตรฐาน ให้หลังบ้านเสนอราคา
}

export function calcHanging({ parsed, quantity = 1, mode = 'มาตรฐาน', fixedLeftM2 = 0, fixedRightM2 = 0 }) {
  if (mode === 'มาตรฐาน') {
    if (!parsed) return 0;
    const ok = Math.abs(parsed.widthM - 1.2) < 0.001 && Math.abs(parsed.heightM - 2) < 0.001;
    return ok ? 4500 * quantity : 0;
  }
  if (mode === 'มีบานตาย') {
    return (4500 + fixedLeftM2 * 1000) * quantity;
  }
  if (mode === 'แบ่ง4') {
    return (9000 + (fixedLeftM2 + fixedRightM2) * 1000) * quantity;
  }
  return 0;
}

export function calcFolding({ parsed, quantity = 1 }) {
  return 8000 * parsed.areaM2 * quantity;
}
export function calcFixedPanel({ parsed, quantity = 1 }) {
  return 1500 * parsed.areaM2 * quantity;
}
export function calcAwning({ parsed, quantity = 1 }) {
  if (parsed.widthCm <= 50 && parsed.heightCm <= 40) return 2500 * quantity;
  if (parsed.widthCm <= 60 && parsed.heightCm <= 110) return 3000 * quantity;
  const areaCm2 = parsed.widthCm * parsed.heightCm;
  return Math.max(3000, Math.round(areaCm2 * 0.45)) * quantity;
}
export function calcMosquitoDoor({ quantity = 1, roundFrame = false }) {
  return (roundFrame ? 1200 : 800) * quantity;
}
export function calcShower({ quantity = 1, isTempered = false }) {
  return (isTempered ? 3000 : 2000) * quantity;
}
export function calcCabinet({ quantity = 1, lengthInch, lengthCm }) {
  let inches = 0;
  if (lengthInch && lengthInch > 0) inches = lengthInch;
  else if (lengthCm && lengthCm > 0) inches = lengthCm / 2.54;
  return Math.max(0, Math.round(inches * 50)) * quantity;
}

// ===== router =====
export function calculatePrice(input) {
  const quantity = Math.max(1, input.quantity || 1);
  const parsed = input.parsed;

  if (belowMin(parsed, input.type)) return 0;

  switch (input.type) {
    case 'หน้าต่างบานเลื่อน2':
      return calcWindow2({ parsed, quantity, hasScreen: input.hasScreen, color: input.color });
    case 'หน้าต่างบานเลื่อน4':
      return calcWindow4({ parsed, quantity, hasScreen: input.hasScreen, color: input.color });
    case 'ประตูบานเลื่อน2':
      return calcDoorSlide2({ parsed, quantity });
    case 'ประตูบานเลื่อน4':
      return calcDoorSlide4({ parsed, quantity });
    case 'ประตูสวิง':
      return calcSwing({ parsed, quantity, swingType: input.swingType });
    case 'ประตูรางแขวน':
      return calcHanging({
        parsed,
        quantity,
        mode: input.mode,
        fixedLeftM2: Number(input.fixedLeftM2 || 0),
        fixedRightM2: Number(input.fixedRightM2 || 0),
      });
    case 'บานเฟี้ยม':
      return calcFolding({ parsed, quantity });
    case 'บานตาย':
      return calcFixedPanel({ parsed, quantity });
    case 'บานกระทุ้ง':
      return calcAwning({ parsed, quantity });
    case 'ประตูมุ้ง':
      return calcMosquitoDoor({ quantity, roundFrame: !!input.roundFrame });
    case 'ชาวเวอร์':
      return calcShower({ quantity, isTempered: !!input.isTempered });
    case 'ตู้เฟอร์นิเจอร์':
      return calcCabinet({ quantity, lengthInch: input.lengthInch, lengthCm: input.lengthCm });
    default:
      return 0;
  }
}
