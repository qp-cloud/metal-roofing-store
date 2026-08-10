import { phones, type Phone } from './site';

/**
 * Meechai Steel operates from a single site in Nong Khai — no branches.
 *
 * `addressTh/En` is the street address and is still empty: it has not been
 * supplied, and templates skip the line rather than show a made-up one.
 * The province IS known, so that is shown on its own until the full address
 * lands. Fill in the address (and mapUrl) and both appear automatically.
 */
export type Location = {
  nameTh: string;
  nameEn: string;
  /** Street address. Empty until supplied. */
  addressTh: string;
  addressEn: string;
  provinceTh: string;
  provinceEn: string;
  /** Google Maps link, once available. */
  mapUrl?: string;
  phones: Phone[];
};

export const location: Location = {
  nameTh: 'หจก.มีชัยสตีล',
  nameEn: 'Meechai Steel Ltd., Part.',
  addressTh: '',
  addressEn: '',
  provinceTh: 'จังหวัดหนองคาย',
  provinceEn: 'Nong Khai Province',
  phones,
};

export const hasAddress = location.addressTh.trim().length > 0;

/**
 * Where we actually deliver. Nong Khai sits on the Thai–Lao border at the
 * First Friendship Bridge, roughly 25 km from Vientiane — closer to the Lao
 * capital than to most of Thailand's own industrial centres.
 *
 * Confirm the exact province list before this goes live.
 */
export const serviceArea = {
  domesticTh: 'หนองคาย อุดรธานี บึงกาฬ และจังหวัดใกล้เคียงในภาคอีสานตอนบน',
  domesticEn: 'Nong Khai, Udon Thani, Bueng Kan and neighbouring upper-Isan provinces',
  crossBorderTh: 'สปป.ลาว — เวียงจันทน์และพื้นที่ใกล้เคียง ผ่านสะพานมิตรภาพไทย–ลาว แห่งที่ 1',
  crossBorderEn: 'Lao PDR — Vientiane and the surrounding area, via the First Thai–Lao Friendship Bridge',
};
