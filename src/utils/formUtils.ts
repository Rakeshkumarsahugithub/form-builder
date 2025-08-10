import { FormField, ValidationRule } from '../store/formBuilderSlice';

export const validateField = (field: FormField, value: any): string | null => {
  if (field.required && (value === undefined || value === null || value === '')) {
    return field.validation?.find(v => v.type === 'required')?.message || 'This field is required';
  }

  if (field.validation) {
    for (const rule of field.validation) {
      switch (rule.type) {
        case 'minLength':
          if (value && value.length < (rule.value || 0)) {
            return rule.message;
          }
          break;
        case 'maxLength':
          if (value && value.length > (rule.value || Infinity)) {
            return rule.message;
          }
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message;
          }
          break;
        case 'password':
          if (value && (value.length < 8 || !/\d/.test(value))) {
            return rule.message || 'Password must be at least 8 characters and contain a number';
          }
          break;
      }
    }
  }

  return null;
};

export const calculateDerivedValue = (
  derivationLogic: string,
  parentValues: Record<string, any>
): any => {
  try {
    // Create a context with parent field values
    const context: Record<string, any> = {};
    Object.keys(parentValues).forEach(key => {
      context[`parent_${key}`] = parentValues[key];
    });

    // Simple evaluation - in a real app you'd want more sophisticated parsing
    if (derivationLogic.startsWith('return ')) {
      const expression = derivationLogic.replace('return ', '').replace(';', '');
      return parseExpression(expression, context);
    }
    
    return new Function(...Object.keys(context), `return ${derivationLogic}`)(...Object.values(context));
  } catch (error) {
    console.error('Error calculating derived value:', error);
    return '';
  }
};

const parseExpression = (expression: string, context: Record<string, any>): any => {
  // Simple parser for common operations
  if (expression.includes('+')) {
    const parts = expression.split('+').map(p => p.trim());
    return parts.map(p => context[p] || p).join(' ');
  }
  // Add more operations as needed
  return context[expression] || expression;
};