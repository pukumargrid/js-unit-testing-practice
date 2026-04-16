import { QuantityValidator } from 'tasks/task2';

describe('QuantityValidator', () => {
  describe('constructor validation', () => {
    it('should throw an error if threshold is negative', () => {
      expect(() => new QuantityValidator(-1, 5)).toThrow();
    });

    it('should throw an error if packageSize is zero', () => {
      expect(() => new QuantityValidator(10, 0)).toThrow();
    });

    it('should throw an error if packageSize is negative', () => {
      expect(() => new QuantityValidator(10, -1)).toThrow();
    });

    it('should not throw for valid threshold and packageSize', () => {
      expect(() => new QuantityValidator(10, 5)).not.toThrow();
    });

    it('should allow threshold of zero', () => {
      expect(() => new QuantityValidator(0, 5)).not.toThrow();
    });
  });

  describe('validate - quantity below or equal to zero', () => {
    const validator = new QuantityValidator(10, 5);

    it('should return invalid for quantity of zero', () => {
      const result = validator.validate(0);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for negative quantity', () => {
      const result = validator.validate(-3);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - quantity below threshold', () => {
    const validator = new QuantityValidator(10, 5);

    it('should return valid when quantity is below threshold', () => {
      const result = validator.validate(3);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return valid for quantity of 1', () => {
      const result = validator.validate(1);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validate - quantity at or above threshold', () => {
    const validator = new QuantityValidator(10, 5);

    it('should return valid when quantity equals threshold and is divisible by packageSize', () => {
      const result = validator.validate(10);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return valid when quantity exceeds threshold and is divisible by packageSize', () => {
      const result = validator.validate(15);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return invalid when quantity exceeds threshold and is NOT divisible by packageSize', () => {
      const result = validator.validate(12);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity should be divisible by 5');
    });

    it('should return invalid when quantity equals threshold and is NOT divisible by packageSize', () => {
      const v = new QuantityValidator(10, 3);
      const result = v.validate(10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity should be divisible by 3');
    });

    it('should include correct packageSize in error message', () => {
      const v = new QuantityValidator(20, 7);
      const result = v.validate(22);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity should be divisible by 7');
    });
  });

  describe('validate - error field', () => {
    const validator = new QuantityValidator(10, 5);

    it('should return null error for valid quantities below threshold', () => {
      expect(validator.validate(4).error).toBeNull();
    });

    it('should return null error for valid quantities at/above threshold', () => {
      expect(validator.validate(20).error).toBeNull();
    });

    it('should return error string for invalid quantities at/above threshold', () => {
      expect(validator.validate(13).error).toBe('Quantity should be divisible by 5');
    });
  });
});
