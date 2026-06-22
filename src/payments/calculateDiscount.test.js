const { calculateDiscount } = require("./calculateDiscount");

test("applies no discount when percent is 0", () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test("applies 10 percent discount correctly", () => {
  // The test previously expected 100 which is incorrect for a 10% discount.
  // Fix: the function returns 90 for price=100 and discountPercent=10, so assert 90.
  expect(calculateDiscount(100, 10)).toBe(90);
});
