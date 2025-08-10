import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, FormControlLabel, Checkbox, Radio, RadioGroup, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { evaluate } from 'mathjs';
import { validateFieldValue } from '../utils/validationUtils';

const PreviewPage: React.FC = () => {
  const { fields = [] } = useSelector((state: RootState) => state.formBuilder?.currentForm || { fields: [] });
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize form values with default values
    const initialValues: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined && field.defaultValue !== '') {
        initialValues[field.id] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        initialValues[field.id] = false;
      } else if (field.type === 'select' || field.type === 'radio') {
        initialValues[field.id] = field.options?.[0] || '';
      } else if (field.type === 'number') {
        initialValues[field.id] = 0;
      } else {
        initialValues[field.id] = '';
      }
    });
    setFormValues(initialValues);
  }, [fields]);

  useEffect(() => {
    // Calculate derived fields
    const derivedFields = fields.filter(f => f.isDerived);
    if (derivedFields.length > 0 && Object.keys(formValues).length > 0) {
      const newValues = { ...formValues };
      let hasChanges = false;

      derivedFields.forEach(field => {
        if (field.derivationLogic) {
          try {
            // Create a context with all field values for parent field references
            const context: Record<string, any> = {};
            Object.keys(formValues).forEach(fieldId => {
              context[`parent_${fieldId}`] = formValues[fieldId];
            });

            // Evaluate the derivation logic
            const result = evaluateDerivation(field.derivationLogic, context);
            if (newValues[field.id] !== result) {
              newValues[field.id] = result;
              hasChanges = true;
            }
          } catch (error) {
            console.error('Error evaluating derived field:', error);
          }
        }
      });

      if (hasChanges) {
        setFormValues(newValues);
      }
    }
  }, [formValues, fields]);

  const evaluateDerivation = (logic: string, context: Record<string, any>): any => {
    try {
      // Clean and validate the expression
      if (!logic || logic.trim() === '') {
        return '';
      }

      let expression = logic.trim();
      
      // Log for debugging
      console.log('=== DERIVATION DEBUG ===');
      console.log('Original logic:', logic);
      console.log('Context:', context);
      
      // Replace parent field references with actual values
      Object.keys(context).forEach(key => {
        const value = context[key];
        // Convert value to number if it's a valid number, otherwise use 0
        const numericValue = value === '' || value === null || value === undefined ? 0 : 
                           isNaN(Number(value)) ? 0 : Number(value);
        
        // Replace all instances of the key with the numeric value
        // Use a more robust replacement that handles word boundaries
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKey}\\b`, 'g');
        expression = expression.replace(regex, numericValue.toString());
        
        console.log(`Replacing ${key} with ${numericValue}`);
      });

      console.log('Final expression:', expression);
      
      // Simple evaluation for basic math operations
      if (expression.match(/^[\d\s+\-*/.()]+$/)) {
        const result = Function(`"use strict"; return (${expression})`)();
        console.log('Calculation result:', result);
        console.log('========================');
        
        // Return the result, handling different types appropriately
        if (typeof result === 'number') {
          return isNaN(result) ? 0 : Number(result.toFixed(2));
        }
        return String(result);
      } else {
        // Fallback to mathjs for complex expressions
        const result = evaluate(expression);
        console.log('MathJS result:', result);
        console.log('========================');
        
        if (typeof result === 'number') {
          return isNaN(result) ? 0 : Number(result.toFixed(2));
        }
        return String(result);
      }
    } catch (error) {
      console.error('Error in derivation logic:', error);
      console.error('Original logic:', logic);
      console.error('Context:', context);
      console.log('========================');
      return 0; // Return 0 instead of error message for better UX
    }
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleBlur = (fieldId: string) => {
    const error = validateField(fieldId, formValues[fieldId]);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: error
      }));
    }
  };

  const validateField = (fieldId: string, value: any): string | null => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return null;

    return validateFieldValue(
      field.type,
      value,
      field.validation || [],
      field.required
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (!field.isDerived) { // Don't validate derived fields
        const error = validateField(field.id, formValues[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!\n\nForm Data:\n' + JSON.stringify(formValues, null, 2));
    }
  };

  if (fields.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          📋 Form Preview
        </Typography>
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}>
          <Typography variant="h5" gutterBottom>
            🎯 No Form to Preview
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Create a form first to see the preview
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/create')}
            sx={{ 
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            🔨 Create Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
          👁️ Form Preview
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/create')}
          sx={{ 
            fontWeight: 600,
            px: 3,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
          }}
        >
          ← Back to Builder
        </Button>
      </Box>

      <Paper sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
          📝 Interactive Form Preview
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <Paper 
              key={field.id} 
              sx={{ 
                p: 3, 
                mb: 3, 
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: field.isDerived ? '2px dashed #2196F3' : '2px solid transparent',
                position: 'relative'
              }}
            >
              {field.isDerived && (
                <Box sx={{ 
                  position: 'absolute',
                  top: -10,
                  right: 16,
                  bgcolor: 'info.main',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  🔄 AUTO-CALCULATED
                </Box>
              )}
              
              {field.type === 'text' && (
                <TextField
                  label={field.label}
                  fullWidth
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id] || (field.isDerived ? '🔄 This field is automatically calculated' : '')}
                  disabled={field.isDerived}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: field.isDerived ? '#f0f8ff' : 'white'
                    }
                  }}
                />
              )}

              {field.type === 'number' && (
                <TextField
                  label={field.label}
                  type="number"
                  fullWidth
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id] || (field.isDerived ? '🔄 This field is automatically calculated' : '')}
                  disabled={field.isDerived}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: field.isDerived ? '#f0f8ff' : 'white'
                    }
                  }}
                />
              )}

              {field.type === 'textarea' && (
                <TextField
                  label={field.label}
                  multiline
                  rows={4}
                  fullWidth
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id] || (field.isDerived ? '🔄 This field is automatically calculated' : '')}
                  disabled={field.isDerived}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: field.isDerived ? '#f0f8ff' : 'white'
                    }
                  }}
                />
              )}

              {field.type === 'select' && (
                <FormControl fullWidth error={!!errors[field.id]}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={() => handleBlur(field.id)}
                    disabled={field.isDerived}
                    sx={{
                      backgroundColor: field.isDerived ? '#f0f8ff' : 'white'
                    }}
                  >
                    {field.options?.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                  {errors[field.id] && (
                    <Typography color="error" variant="caption">{errors[field.id]}</Typography>
                  )}
                  {field.isDerived && (
                    <Typography variant="caption" color="info.main">🔄 Auto-calculated</Typography>
                  )}
                </FormControl>
              )}

              {field.type === 'radio' && (
                <FormControl component="fieldset" error={!!errors[field.id]}>
                  <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                  <RadioGroup
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    {field.options?.map(option => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio disabled={field.isDerived} />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                  {errors[field.id] && (
                    <Typography color="error" variant="caption">{errors[field.id]}</Typography>
                  )}
                  {field.isDerived && (
                    <Typography variant="caption" color="info.main">🔄 Auto-calculated</Typography>
                  )}
                </FormControl>
              )}

              {field.type === 'checkbox' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formValues[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                      onBlur={() => handleBlur(field.id)}
                      disabled={field.isDerived}
                    />
                  }
                  label={field.label}
                />
              )}

              {field.type === 'date' && (
                <TextField
                  label={field.label}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id] || (field.isDerived ? '🔄 This field is automatically calculated' : '')}
                  disabled={field.isDerived}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: field.isDerived ? '#f0f8ff' : 'white'
                    }
                  }}
                />
              )}

              {field.isDerived && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  🔄 This field is automatically calculated from: {field.parentFields?.map(id => {
                    const parentField = fields.find(f => f.id === id);
                    return parentField?.label;
                  }).join(', ')}
                </Alert>
              )}
            </Paper>
          ))}

          <Paper sx={{ 
            p: 3, 
            mt: 4, 
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              🚀 Ready to Submit?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              Review your form data and click submit when ready
            </Typography>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white',
                color: 'success.main',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': { 
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              ✅ Submit Form
            </Button>
          </Paper>
        </form>
      </Paper>
    </Box>
  );
};

export default PreviewPage;
