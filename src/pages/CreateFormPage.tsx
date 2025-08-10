import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addField, updateField, removeField, reorderFields, saveForm, resetCurrentForm } from '../store/formBuilderSlice';
import { Button, TextField, Typography, Box, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import FieldConfigDialog from '../components/FieldConfigDialog';

const CreateFormPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fields = [] } = useSelector((state: RootState) => state.formBuilder?.currentForm || { fields: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');

  const handleAddField = (fieldType: string) => {
    const baseField = {
      type: fieldType as any,
      label: '',
      required: false,
      isDerived: false,
    };

    let fieldToAdd;
    if (fieldType === 'select' || fieldType === 'radio') {
      fieldToAdd = { ...baseField, options: ['Option 1', 'Option 2'] };
    } else {
      fieldToAdd = baseField;
    }
    
    dispatch(addField(fieldToAdd));
    
    // Open dialog immediately for configuration
    setTimeout(() => {
      setOpenDialog(true);
    }, 50);
  };

  const handleEditField = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setOpenDialog(true);
  };

  const handleSaveField = (fieldData: any) => {
    if (editingFieldId) {
      dispatch(updateField({ id: editingFieldId, updates: fieldData }));
    } else {
      // If no editing field ID, update the last added field
      const lastField = fields[fields.length - 1];
      if (lastField) {
        dispatch(updateField({ id: lastField.id, updates: fieldData }));
      }
    }
    setOpenDialog(false);
    setEditingFieldId(null);
  };

  const handleDragEnd = (result: DropResult) => {
    // If dropped outside the list or no destination
    if (!result.destination) {
      return;
    }

    // If dropped in the same position
    if (result.destination.index === result.source.index) {
      return;
    }

    dispatch(reorderFields({
      startIndex: result.source.index,
      endIndex: result.destination.index,
    }));
  };

  const handleSaveForm = () => {
    dispatch(saveForm(formName));
    setSaveDialogOpen(false);
    setFormName('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Form
      </Typography>

      {/* Field Type Selection */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          ➕ Add New Field
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose a field type to add to your form
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('text')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            📝 Text
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('number')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            🔢 Number
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('textarea')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            📄 Textarea
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('select')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #A8E6CF 30%, #88D8A3 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            📋 Select
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('radio')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #FFD93D 30%, #FF6B6B 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            ⚪ Radio
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('checkbox')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #A8DADC 30%, #457B9D 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            ☑️ Checkbox
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddField('date')}
            sx={{ 
              py: 2, 
              flexDirection: 'column', 
              gap: 1,
              background: 'linear-gradient(45deg, #F1C0E8 30%, #CFBAF0 90%)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            📅 Date
          </Button>
        </Box>
      </Paper>

      {/* Form Fields */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
          📋 Form Fields {fields.length > 0 && `(${fields.length})`}
        </Typography>
        
        {fields.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h6" gutterBottom>
              🎯 Start Building Your Form
            </Typography>
            <Typography variant="body1">
              Add fields using the buttons above to create your form
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, background: '#fafafa' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields" direction="vertical" isDropDisabled={false} isCombineEnabled={false}>
                {(provided: DroppableProvided) => (
                  <Box 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    sx={{ minHeight: '100px' }}
                  >
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided: DraggableProvided, snapshot) => (
                            <Paper 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style} // Use style prop directly for draggable positioning
                              sx={{ 
                                p: 3, 
                                mb: 2, 
                                position: 'relative',
                                background: snapshot.isDragging ? '#f0f0f0' : 'white',
                                border: '2px solid transparent',
                                borderRadius: 2,
                                boxShadow: snapshot.isDragging 
                                  ? '0 8px 24px rgba(0,0,0,0.2)' 
                                  : '0 2px 8px rgba(0,0,0,0.1)',
                                transition: snapshot.isDragging ? 'none' : 'all 0.3s ease',
                                '&:hover': !snapshot.isDragging ? { 
                                  borderColor: 'primary.main',
                                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                                  // Removed transform that was causing vibration
                                } : {}
                              }}
                            >
                            {/* Drag Handle */}
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                cursor: 'grab',
                                padding: '4px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.2)',
                                },
                                '&:active': {
                                  cursor: 'grabbing',
                                }
                              }}
                            >
                              ⋮⋮
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pr: 5 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {field.label || `Unnamed ${field.type} field`}
                                  </Typography>
                                  {field.required && (
                                    <Box sx={{ 
                                      px: 1, 
                                      py: 0.5, 
                                      bgcolor: 'error.main', 
                                      color: 'white', 
                                      borderRadius: 1, 
                                      fontSize: '0.75rem',
                                      fontWeight: 600
                                    }}>
                                      REQUIRED
                                    </Box>
                                  )}
                                  {field.isDerived && (
                                    <Box sx={{ 
                                      px: 1, 
                                      py: 0.5, 
                                      bgcolor: 'info.main', 
                                      color: 'white', 
                                      borderRadius: 1, 
                                      fontSize: '0.75rem',
                                      fontWeight: 600
                                    }}>
                                      DERIVED
                                    </Box>
                                  )}
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                  📝 {field.type} field
                                </Typography>
                                {field.validation && field.validation.length > 0 && (
                                  <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                                    ✅ {field.validation.length} validation rule{field.validation.length > 1 ? 's' : ''} applied
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, position: 'absolute', bottom: 8, right: 60 }}>
                                <IconButton 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditField(field.id);
                                  }}
                                  sx={{ 
                                    bgcolor: 'primary.main', 
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                  }}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(removeField(field.id));
                                  }}
                                  sx={{ 
                                    bgcolor: 'error.main', 
                                    color: 'white',
                                    '&:hover': { bgcolor: 'error.dark' }
                                  }}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Paper>
        )}
      </Box>

      {fields.length > 0 && (
        <Paper sx={{ 
          p: 3, 
          mt: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            🚀 Ready to Save Your Form?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Your form has {fields.length} field{fields.length > 1 ? 's' : ''} configured and ready to use.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => setSaveDialogOpen(true)}
              sx={{ 
                bgcolor: 'success.main',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': { 
                  bgcolor: 'success.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              💾 Save Form
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => dispatch(resetCurrentForm())}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              🗑️ Clear Form
            </Button>
          </Box>
        </Paper>
      )}

      <FieldConfigDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveField}
        field={fields.find(field => field.id === editingFieldId) || undefined}
        availableFields={fields}
      />

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} disabled={!formName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateFormPage;