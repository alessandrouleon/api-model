import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export class ValidatorHelper {
  static validateObjectId(field: string) {
    return Joi.string()
      .custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .messages({
        'any.invalid': `${field} must be a valid MongoDB ObjectId`,
      });
  }
}
