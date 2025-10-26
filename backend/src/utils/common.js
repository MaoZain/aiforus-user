export const generateCouponCode = (prefix = "CPN", length = 8) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 去掉O0I1L
  let body = "";
  for (let i = 0; i < length; i++) {
    body += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${body}`;
}