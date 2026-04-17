export function validateName(name: string): string | null {
  if (!name) return null;
  if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(name.trim()))
    return "이름은 2~20자의 한글 또는 영문만 입력 가능합니다";
  return null;
}

export function validateDob(dob: string): string | null {
  if (dob.length === 0) return null;
  if (dob.length !== 8) return "생년월일 8자리를 모두 입력해주세요";

  const year = parseInt(dob.slice(0, 4), 10);
  const month = parseInt(dob.slice(4, 6), 10);
  const day = parseInt(dob.slice(6, 8), 10);

  if (month < 1 || month > 12) return "올바른 월을 입력해주세요 (01~12)";
  if (day < 1 || day > 31) return "올바른 일을 입력해주세요 (01~31)";

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "존재하지 않는 날짜입니다";
  }

  const today = new Date();
  if (date > today) return "미래 날짜는 입력할 수 없습니다";

  const age130 = new Date(
    today.getFullYear() - 130,
    today.getMonth(),
    today.getDate(),
  );
  if (date < age130) return "올바른 생년월일을 입력해주세요";

  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return null;
  if (!/^01[016789]\d{7,8}$/.test(phone))
    return "올바른 휴대폰 번호를 입력해주세요 (010, 011, 016~019)";
  return null;
}
