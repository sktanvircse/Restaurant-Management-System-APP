export function isValidEmail(email: string) {
  const re = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(String(email).toLowerCase());
}

export function isValidPin(pw: string) {
  const re = /^\d{4,6}$/;
  return re.test(pw);
}
