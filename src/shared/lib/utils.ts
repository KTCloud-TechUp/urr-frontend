import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Spring Boot가 LocalDate/LocalDateTime을 JSON 배열([2026,4,9] 또는 [2026,4,9,18,0,0])로
 * 직렬화할 때를 포함해 다양한 포맷을 안전하게 파싱합니다.
 */
export function parseApiDate(value: unknown): Date {
  if (!value) return new Date(NaN);
  // Java 배열 직렬화: [year, month(1-based), day, hour?, min?, sec?]
  if (Array.isArray(value)) {
    const [year, month, day, hours = 0, minutes = 0, seconds = 0] = value as number[];
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
  // MySQL DATETIME 공백 구분자 → T로 정규화
  return new Date(String(value).replace(" ", "T"));
}

const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 날짜를 "MM.DD(요일)" 형식으로 포맷합니다. (예: "03.03(화)")
 * 시간 정보가 있으면 " HH:MM"도 붙습니다. (예: "03.03(화) 20:00")
 */
export function formatEventDate(value: unknown, includeTime = false): string {
  const date = parseApiDate(value);
  if (isNaN(date.getTime())) return "";
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = DAYS_KO[date.getDay()];
  let result = `${mm}.${dd}(${day})`;
  if (includeTime) {
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    result += ` ${hh}:${min}`;
  }
  return result;
}
