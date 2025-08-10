import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Paper,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { FormField } from '../store/formBuilderSlice';

interface DerivationHelperProps {
  availableFields: FormField[];
  currentLogic: string;
  onLogicChange: (logic: string) => void;
}

interface FormulaTemplate {
  id: string;
  name: string;
  description: string;
  example: string;
  template: string;
  requiredFields: number;
  category: 'math' | 'financial' | 'text' | 'conditional';
}

const FORMULA_TEMPLATES: FormulaTemplate[] = [
  // Math Operations
  {
    id: 'add',
    name: 'Add Numbers',
    description: 'Add two or more numbers together',
    example: 'Price + Tax = Total',
    template: '{field1} + {field2}',
    requiredFields: 2,
    category: 'math'
  },
  {
    id: 'subtract',
    name: 'Subtract Numbers',
    description: 'Subtract one number from another',
    example: 'Original Price - Discount = Final Price',
    template: '{field1} - {field2}',
    requiredFields: 2,
    category: 'math'
  },
  {
    id: 'multiply',
    name: 'Multiply Numbers',
    description: 'Multiply two numbers',
    example: 'Quantity × Unit Price = Subtotal',
    template: '{field1} * {field2}',
    requiredFields: 2,
    category: 'math'
  },
  {
    id: 'divide',
    name: 'Divide Numbers',
    description: 'Divide one number by another',
    example: 'Total Amount ÷ Number of People = Per Person',
    template: '{field1} / {field2}',
    requiredFields: 2,
    category: 'math'
  },
  
  // Financial Operations
  {
    id: 'percentage',
    name: 'Calculate Percentage',
    description: 'Calculate percentage of a number',
    example: 'Price × (Tax Rate ÷ 100) = Tax Amount',
    template: '{field1} * ({field2} / 100)',
    requiredFields: 2,
    category: 'financial'
  },
  {
    id: 'discount',
    name: 'Apply Discount',
    description: 'Apply percentage discount to a price',
    example: 'Price × (1 - Discount% ÷ 100) = Discounted Price',
    template: '{field1} * (1 - {field2} / 100)',
    requiredFields: 2,
    category: 'financial'
  },
  {
    id: 'tax_total',
    name: 'Add Tax to Total',
    description: 'Add tax percentage to a subtotal',
    example: 'Subtotal × (1 + Tax Rate ÷ 100) = Total with Tax',
    template: '{field1} * (1 + {field2} / 100)',
    requiredFields: 2,
    category: 'financial'
  },
  
  // Text Operations
  {
    id: 'concat',
    name: 'Combine Text',
    description: 'Join two text fields together',
    example: 'First Name + Last Name = Full Name',
    template: '{field1} + " " + {field2}',
    requiredFields: 2,
    category: 'text'
  },
  
  // Conditional Operations
  {
    id: 'conditional',
    name: 'If-Then Logic',
    description: 'Show different values based on a condition',
    example: 'If Age ≥ 18 then "Adult" else "Minor"',
    template: '{field1} >= 18 ? "Adult" : "Minor"',
    requiredFields: 1,
    category: 'conditional'
  }
];

const DerivationHelper: React.FC<DerivationHelperProps> = ({
  availableFields,
  currentLogic,
  onLogicChange
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customLogic, setCustomLogic] = useState(currentLogic);
  const [mode, setMode] = useState<'template' | 'custom'>('template');

  useEffect(() => {
    setCustomLogic(currentLogic);
  }, [currentLogic]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setSelectedFields([]);
  };

  const handleFieldSelect = (index: number, fieldId: string) => {
    const newFields = [...selectedFields];
    newFields[index] = fieldId;
    setSelectedFields(newFields);
  };

  const generateLogic = () => {
    const template = FORMULA_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template || selectedFields.length < template.requiredFields) return;

    let logic = template.template;
    selectedFields.forEach((fieldId, index) => {
      logic = logic.replace(`{field${index + 1}}`, `parent_${fieldId}`);
    });

    onLogicChange(logic);
    setCustomLogic(logic);
  };

  const handleCustomLogicChange = (logic: string) => {
    setCustomLogic(logic);
    onLogicChange(logic);
  };

  const getFieldName = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    return field ? field.label : fieldId;
  };

  const selectedTemplateData = FORMULA_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📊 Easy Formula Builder
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Choose a formula template below or write custom logic. No coding required!
      </Alert>

      {/* Mode Selection */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant={mode === 'template' ? 'contained' : 'outlined'}
          onClick={() => setMode('template')}
          sx={{ mr: 1 }}
        >
          🎯 Use Template
        </Button>
        <Button
          variant={mode === 'custom' ? 'contained' : 'outlined'}
          onClick={() => setMode('custom')}
        >
          ⚙️ Custom Logic
        </Button>
      </Box>

      {mode === 'template' ? (
        <Box>
          {/* Template Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Choose a Formula Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              label="Choose a Formula Template"
            >
              {Object.entries(
                FORMULA_TEMPLATES.reduce((acc, template) => {
                  if (!acc[template.category]) acc[template.category] = [];
                  acc[template.category].push(template);
                  return acc;
                }, {} as Record<string, FormulaTemplate[]>)
              ).map(([category, templates]) => [
                <MenuItem key={`${category}-header`} disabled>
                  <Typography variant="subtitle2" color="primary">
                    {category.toUpperCase()}
                  </Typography>
                </MenuItem>,
                ...templates.map(template => (
                  <MenuItem key={template.id} value={template.id}>
                    <Box>
                      <Typography variant="body1">{template.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {template.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ])}
            </Select>
          </FormControl>

          {/* Template Details */}
          {selectedTemplateData && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>
                📋 {selectedTemplateData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedTemplateData.description}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Example: {selectedTemplateData.example}
              </Typography>
            </Paper>
          )}

          {/* Field Selection */}
          {selectedTemplateData && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select Fields for Your Formula:
              </Typography>
              <Grid container spacing={2}>
                {Array.from({ length: selectedTemplateData.requiredFields }).map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <FormControl fullWidth>
                      <InputLabel>Field {index + 1}</InputLabel>
                      <Select
                        value={selectedFields[index] || ''}
                        onChange={(e) => handleFieldSelect(index, e.target.value)}
                        label={`Field ${index + 1}`}
                      >
                        {availableFields
                          .filter(field => !field.isDerived)
                          .map(field => (
                            <MenuItem key={field.id} value={field.id}>
                              {field.label} ({field.type})
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Generate Button */}
          {selectedTemplateData && selectedFields.length >= selectedTemplateData.requiredFields && (
            <Button
              variant="contained"
              onClick={generateLogic}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Generate Formula
            </Button>
          )}
        </Box>
      ) : (
        /* Custom Logic Mode */
        <Box>
          <TextField
            label="Custom Derivation Logic"
            multiline
            rows={4}
            value={customLogic}
            onChange={(e) => handleCustomLogicChange(e.target.value)}
            fullWidth
            placeholder="Example: parent_field1 + parent_field2"
            helperText="Use parent_[fieldId] to reference other fields"
            sx={{ mb: 2 }}
          />
        </Box>
      )}

      {/* Current Logic Display */}
      {customLogic && (
        <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <Typography variant="subtitle2" gutterBottom>
            ✅ Current Formula:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {customLogic}
          </Typography>
        </Paper>
      )}

      {/* Help Section */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            💡 Need Help? Quick Reference
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body2" gutterBottom>
              <strong>Common Operations:</strong>
            </Typography>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2">• Addition: field1 + field2</Typography>
              <Typography variant="body2">• Subtraction: field1 - field2</Typography>
              <Typography variant="body2">• Multiplication: field1 * field2</Typography>
              <Typography variant="body2">• Division: field1 / field2</Typography>
              <Typography variant="body2">• Percentage: field1 * (field2 / 100)</Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Field Reference:</strong> Use parent_[fieldId] to reference other fields
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DerivationHelper;
