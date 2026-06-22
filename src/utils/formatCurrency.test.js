const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // The test used `toBe` which checks object identity; use `toEqual` for deep equality.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});
