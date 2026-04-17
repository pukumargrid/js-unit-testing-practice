interface IQuantityValidator {
  validate(quantity: number): { isValid: boolean; error: string | null };
}

export class QuantityValidator implements IQuantityValidator {
  private threshold: number;
  private packageSize: number;

  constructor(threshold: number, packageSize: number) {
    if (threshold < 0) {
      throw new Error('Threshold cannot be a negative value');
    }
    if (packageSize <= 0) {
      throw new Error('Package size should be greater than zero');
    }
    this.threshold = threshold;
    this.packageSize = packageSize;
  }

  public validate(quantity: number): { isValid: boolean; error: string | null } {
    if (quantity < 0) {
      return { isValid: false, error: 'Quantity cannot be negative' };
    }

    if (quantity === 0) {
      return { isValid: false, error: 'Quantity should be greater than zero' };
    }

    if (quantity >= this.threshold && quantity % this.packageSize !== 0) {
      return {
        isValid: false,
        error: `Quantity should be divisible by ${this.packageSize}`,
      };
    }

    return { isValid: true, error: null };
  }
}
