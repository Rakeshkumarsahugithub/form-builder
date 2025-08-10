import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, FormControlLabel, Checkbox, Typography, Box, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormField, ValidationRule } from '../store/formBuilderSlice';
import DerivationHelper from './DerivationHelper';
import { getValidationOptionsForFieldType } from '../utils/validationUtils';

interface FieldConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (fieldData: any) => void;
  field?: FormField;
  availableFields?: FormField[];
}

const FieldConfigDialog: React.FC<FieldConfigDialogProps> = ({ open, onClose, onSave, field, availableFields = [] }) => {
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [isDerived, setIsDerived] = useState(false);
  const [parentFields, setParentFields] = useState<string[]>([]);
  const [derivationLogic, setDerivationLogic] = useState('');

  useEffect(() => {
    if (field) {
      setLabel(field.label);
      setRequired(field.required);
      setDefaultValue(field.defaultValue || '');
      setOptions(field.options || []);
      setValidationRules(field.validation || []);
      setIsDerived(field.isDerived || false);
      setParentFields(field.parentFields || []);
      setDerivationLogic(field.derivationLogic || '');
    } else {
      resetForm();
    }
  }, [field]);

  const resetForm = () => {
    setLabel('');
    setRequired(false);
    setDefaultValue('');
    setOptions([]);

    setValidationRules([]);
    setIsDerived(false);
    setParentFields([]);
    setDerivationLogic('');
  };

  const handleAddValidation = () => {
    const availableOptions = getValidationOptionsForFieldType(field?.type || 'text');
    const firstOption = availableOptions[0];
    setValidationRules([...validationRules, { 
      type: firstOption.type, 
      message: firstOption.defaultMessage 
    }]);
  };

  const handleUpdateValidation = (index: number, rule: ValidationRule) => {
    const newRules = [...validationRules];
    newRules[index] = rule;
    setValidationRules(newRules);
  };

  const handleRemoveValidation = (index: number) => {
    const newRules = [...validationRules];
    newRules.splice(index, 1);
    setValidationRules(newRules);
  };

  const handleSubmit = () => {
    const fieldData: any = {
      label,
      required,
      defaultValue: defaultValue || undefined,
      validation: validationRules.length > 0 ? validationRules : undefined,
      isDerived,
    };

    if (field?.type === 'select' || field?.type === 'radio') {
      fieldData.options = options;
    }

    if (isDerived) {
      fieldData.parentFields = parentFields;
      fieldData.derivationLogic = derivationLogic;
    }

    onSave(fieldData);
    resetForm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '1.5rem'
      }}>
        ⚙️ Configure Field
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={12}>
            <TextField
              label="Label"
              fullWidth
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                />
              }
              label="Required"
            />
          </Grid>

          {(field?.type === 'text' || field?.type === 'number' || field?.type === 'textarea') && (
            <Grid size={12}>
              <TextField
                label="Default Value"
                fullWidth
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
              />
            </Grid>
          )}

          {(field?.type === 'select' || field?.type === 'radio') && (
            <Grid size={12}>
              <Typography variant="subtitle1">Options</Typography>
              {options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Option ${index + 1}`}
                    fullWidth
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    onClick={() => {
                      const newOptions = [...options];
                      newOptions.splice(index, 1);
                      setOptions(newOptions);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setOptions([...options, ''])}
                sx={{ mt: 1 }}
              >
                Add Option
              </Button>
            </Grid>
          )}

          <Grid size={12}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
              ✅ Validation Rules
            </Typography>
            {validationRules.map((rule, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  mb: 2, 
                  p: 3, 
                  background: 'white',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '2px solid',
                  borderColor: 'primary.light'
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Rule Type</InputLabel>
                      <Select
                        value={rule.type}
                        onChange={(e) => {
                          const validationOptions = getValidationOptionsForFieldType(field?.type || 'text');
                          const selectedOption = validationOptions.find(opt => opt.type === e.target.value);
                          handleUpdateValidation(index, {
                            ...rule,
                            type: e.target.value as any,
                            message: selectedOption?.defaultMessage || rule.message,
                          });
                        }}
                      >
                        {getValidationOptionsForFieldType(field?.type || 'text').map(option => (
                          <MenuItem key={option.type} value={option.type}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {(() => {
                    const validationOptions = getValidationOptionsForFieldType(field?.type || 'text');
                    const currentOption = validationOptions.find(opt => opt.type === rule.type);
                    
                    if (!currentOption?.requiresValue) return null;
                    
                    return (
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                          label="Value"
                          type={currentOption.valueType === 'number' ? 'number' : 
                                currentOption.valueType === 'date' ? 'date' : 'text'}
                          value={rule.value || ''}
                          onChange={(e) => handleUpdateValidation(index, {
                            ...rule,
                            value: currentOption.valueType === 'number' ? 
                                   parseFloat(e.target.value) : e.target.value,
                          })}
                          fullWidth
                          InputLabelProps={currentOption.valueType === 'date' ? { shrink: true } : undefined}
                        />
                      </Grid>
                    );
                  })()}
                  <Grid size={{ xs: 12, sm: (() => {
                    const validationOptions = getValidationOptionsForFieldType(field?.type || 'text');
                    const currentOption = validationOptions.find(opt => opt.type === rule.type);
                    return currentOption?.requiresValue ? 5 : 8;
                  })() }}>
                    <TextField
                      label="Error Message"
                      value={rule.message}
                      onChange={(e) => handleUpdateValidation(index, {
                        ...rule,
                        message: e.target.value,
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveValidation(index)}
                    >
                      Remove Rule
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddValidation}
            >
              Add Validation Rule
            </Button>
          </Grid>

          <Grid size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDerived}
                  onChange={(e) => setIsDerived(e.target.checked)}
                />
              }
              label="Derived Field"
            />
          </Grid>

          {isDerived && (
            <Grid size={12}>
              <DerivationHelper
                availableFields={availableFields}
                currentLogic={derivationLogic}
                onLogicChange={setDerivationLogic}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigDialog;