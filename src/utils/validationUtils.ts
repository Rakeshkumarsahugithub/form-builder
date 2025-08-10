import { FieldType, ValidationRule } from '../store/formBuilderSlice';

export interface ValidationOption {
  type: ValidationRule['type'];
  label: string;
  requiresValue: boolean;
  valueType: 'number' | 'string' | 'date';
  defaultMessage: string;
}

export const getValidationOptionsForFieldType = (fieldType: FieldType): ValidationOption[] => {
  const baseOptions: ValidationOption[] = [
    {
      type: 'required',
      label: 'Required',
      requiresValue: false,
      valueType: 'string',
      defaultMessage: 'This field is required'
    }
  ];

  switch (fieldType) {
    case 'text':
      return [
        ...baseOptions,
        {
          type: 'minLength',
          label: 'Minimum Length',
          requiresValue: true,
          valueType: 'number',
          defaultMessage: 'Must be at least {value} characters'
        },
        {
          type: 'maxLength',
          label: 'Maximum Length',
          requiresValue: true,
          valueType: 'number',
          defaultMessage: 'Must be no more than {value} characters'
        },
        {
          type: 'email',
          label: 'Email Format',
          requiresValue: false,
          valueType: 'string',
          defaultMessage: 'Please enter a valid email address'
        },
        {
          type: 'password',
          label: 'Password Rules',
          requiresValue: false,
          valueType: 'string',
          defaultMessage: 'Password must be at least 8 characters and contain a number'
        },
        {
          type: 'regex',
          label: 'Custom Pattern',
          requiresValue: true,
          valueType: 'string',
          defaultMessage: 'Please enter a valid format'
        }
      ];

    case 'number':
      return [
        ...baseOptions,
        {
          type: 'minValue',
          label: 'Minimum Value',
          requiresValue: true,
          valueType: 'number',
          defaultMessage: 'Must be at least {value}'
        },
        {
          type: 'maxValue',
          label: 'Maximum Value',
          requiresValue: true,
          valueType: 'number',
          defaultMessage: 'Must be no more than {value}'
        }
      ];

    case 'textarea':
      return [
        ...baseOptions,
        {
          type: 'minLength',
          label: 'Minimum Length',
          requiresValue: true,
          valueType: 'number',
          defaultMessage: 'Must be at least {value} characters'
        },
        {
          type: 'maxLength',
          label: 'Maximum Length',
          requiresValue: true,
          valueType: 'number',
          defaultMessage: 'Must be no more than {value} characters'
        }
      ];

    case 'date':
      return [
        ...baseOptions,
        {
          type: 'minDate',
          label: 'Minimum Date',
          requiresValue: true,
          valueType: 'date',
          defaultMessage: 'Date must be after {value}'
        },
        {
          type: 'maxDate',
          label: 'Maximum Date',
          requiresValue: true,
          valueType: 'date',
          defaultMessage: 'Date must be before {value}'
        }
      ];

    case 'select':
    case 'radio':
    case 'checkbox':
      return baseOptions;

    default:
      return baseOptions;
  }
};

export const validateFieldValue = (
  fieldType: FieldType,
  value: any,
  validationRules: ValidationRule[],
  isRequired: boolean
): string | null => {
  // Check required validation
  if (isRequired && (value === undefined || value === null || value === '' || 
      (fieldType === 'checkbox' && !value))) {
    return 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!isRequired && (value === undefined || value === null || value === '')) {
    return null;
  }

  // Apply field-specific validations
  for (const rule of validationRules) {
    switch (rule.type) {
      case 'minLength':
        if (value && value.toString().length < (rule.value as number || 0)) {
          return rule.message.replace('{value}', (rule.value || 0).toString());
        }
        break;

      case 'maxLength':
        if (value && value.toString().length > (rule.value as number || Infinity)) {
          return rule.message.replace('{value}', (rule.value || 0).toString());
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return rule.message;
        }
        break;

      case 'password':
        if (value && (value.length < 8 || !/\d/.test(value))) {
          return rule.message;
        }
        break;

      case 'minValue':
        if (fieldType === 'number' && value && parseFloat(value) < (rule.value as number || 0)) {
          return rule.message.replace('{value}', (rule.value || 0).toString());
        }
        break;

      case 'maxValue':
        if (fieldType === 'number' && value && parseFloat(value) > (rule.value as number || Infinity)) {
          return rule.message.replace('{value}', (rule.value || 0).toString());
        }
        break;

      case 'minDate':
        if (fieldType === 'date' && value && new Date(value) < new Date(rule.value as string)) {
          return rule.message.replace('{value}', rule.value as string);
        }
        break;

      case 'maxDate':
        if (fieldType === 'date' && value && new Date(value) > new Date(rule.value as string)) {
          return rule.message.replace('{value}', rule.value as string);
        }
        break;

      case 'regex':
        if (value && rule.value) {
          try {
            const regex = new RegExp(rule.value as string);
            if (!regex.test(value)) {
              return rule.message;
            }
          } catch (e) {
            console.error('Invalid regex pattern:', rule.value);
          }
        }
        break;
    }
  }

  return null;
};
