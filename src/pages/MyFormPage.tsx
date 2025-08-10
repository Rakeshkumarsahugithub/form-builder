// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../store/store';
// import { loadForm, deleteForm } from '../store/formBuilderSlice';
// import { Typography, Box, Paper, List, ListItem, ListItemText, IconButton, Divider, Button, Chip } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PreviewIcon from '@mui/icons-material/Preview';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs';

// const MyFormsPage: React.FC = () => {
//   const { savedForms = [] } = useSelector((state: RootState) => state.formBuilder || {});
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const handlePreview = (formId: string) => {
//     dispatch(loadForm(formId));
//     navigate('/preview');
//   };

//   const handleDelete = (formId: string) => {
//     if (window.confirm('Are you sure you want to delete this form?')) {
//       dispatch(deleteForm(formId));
//     }
//   };

//   const handleEdit = (formId: string) => {
//     dispatch(loadForm(formId));
//     navigate('/create');
//   };

//   if (savedForms.length === 0) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
//           📚 My Forms
//         </Typography>
//         <Paper sx={{ 
//           p: 6, 
//           textAlign: 'center',
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: 'white',
//           borderRadius: 3
//         }}>
//           <Typography variant="h5" gutterBottom>
//             📝 No Saved Forms Yet
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 4 }}>
//             Start building your first form to see it saved here
//           </Typography>
//           <Button 
//             variant="contained" 
//             startIcon={<AddIcon />}
//             onClick={() => navigate('/create')}
//             sx={{ 
//               bgcolor: 'white',
//               color: 'primary.main',
//               fontWeight: 600,
//               px: 4,
//               py: 1.5,
//               '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)' }
//             }}
//           >
//             🔨 Create Your First Form
//           </Button>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
//           📚 My Forms ({savedForms.length})
//         </Typography>
//         <Button 
//           variant="contained" 
//           startIcon={<AddIcon />}
//           onClick={() => navigate('/create')}
//           sx={{ 
//             fontWeight: 600,
//             px: 3,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             '&:hover': { 
//               background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
//               transform: 'translateY(-2px)', 
//               boxShadow: 4 
//             }
//           }}
//         >
//           Create New Form
//         </Button>
//       </Box>

//       <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
//         {savedForms.map((form) => (
//           <Paper key={form.id} sx={{ 
//             p: 3,
//             background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//             borderRadius: 3,
//             boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//             transition: 'all 0.3s ease',
//             '&:hover': {
//               transform: 'translateY(-4px)',
//               boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
//             }
//           }}>
//             <Typography variant="h6" gutterBottom sx={{ 
//               fontWeight: 600, 
//               color: 'primary.main',
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1
//             }}>
//               📋 {form.name}
//             </Typography>
            
//             <Box sx={{ mb: 2 }}>
//               <Chip 
//                 label={`${form.fields.length} field${form.fields.length > 1 ? 's' : ''}`}
//                 size="small"
//                 sx={{ 
//                   bgcolor: 'primary.main', 
//                   color: 'white',
//                   fontWeight: 600,
//                   mr: 1
//                 }}
//               />
//               {form.fields.some(f => f.isDerived) && (
//                 <Chip 
//                   label="🔄 Has Derived Fields"
//                   size="small"
//                   sx={{ 
//                     bgcolor: 'info.main', 
//                     color: 'white',
//                     fontWeight: 600
//                   }}
//                 />
//               )}
//             </Box>

//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               Created: {dayjs(form.createdAt).format('MMM DD, YYYY')}
//             </Typography>

//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <Button
//                 variant="contained"
//                 size="small"
//                 startIcon={<PreviewIcon />}
//                 onClick={() => handlePreview(form.id)}
//                 sx={{ 
//                   flex: 1,
//                   bgcolor: 'success.main',
//                   fontWeight: 600,
//                   '&:hover': { 
//                     bgcolor: 'success.dark',
//                     transform: 'translateY(-1px)'
//                   }
//                 }}
//               >
//                 Preview
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 startIcon={<EditIcon />}
//                 onClick={() => handleEdit(form.id)}
//                 sx={{ 
//                   fontWeight: 600,
//                   '&:hover': { 
//                     transform: 'translateY(-1px)',
//                     boxShadow: 2
//                   }
//                 }}
//               >
//                 Edit
//               </Button>
//               <IconButton 
//                 onClick={() => handleDelete(form.id)}
//                 sx={{ 
//                   color: 'error.main',
//                   '&:hover': { 
//                     bgcolor: 'error.light',
//                     color: 'white'
//                   }
//                 }}
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           </Paper>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default MyFormsPage;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loadForm, deleteForm } from '../store/formBuilderSlice';
import { 
  Typography, 
  Box, 
  Paper, 
  List,  
  ListItemIcon,
  ListItemText, 
  IconButton, 
  Button, 
  Chip,
  Toolbar,
  Divider,
  Menu,
  MenuItem,
  ListItemButton,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

type ViewMode = 'list' | 'grid';
type SortBy = 'name' | 'date' | 'fields';

const MyFormsPage: React.FC = () => {
  const { savedForms = [] } = useSelector((state: RootState) => state.formBuilder || {});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    formId: string;
  } | null>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  const handlePreview = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
    setContextMenu(null);
  };

  const handleDelete = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dispatch(deleteForm(formId));
    }
    setContextMenu(null);
  };

  const handleEdit = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
    setContextMenu(null);
  };

  const handleContextMenu = (event: React.MouseEvent, formId: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      formId
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const sortedForms = [...savedForms].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'fields':
        return b.fields.length - a.fields.length;
      default:
        return 0;
    }
  });

  const getFileSize = (fieldCount: number) => {
    return `${fieldCount * 2}KB`; // Mock file size based on field count
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ height: '100vh', bgcolor: '#fafafa' }}>
        {/* Toolbar */}
        <Paper sx={{ 
          borderRadius: 0, 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'white'
        }}>
          <Toolbar sx={{ minHeight: '56px !important' }}>
            <FolderIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
              My Forms
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              size="small"
              sx={{ fontWeight: 500 }}
            >
              New Form
            </Button>
          </Toolbar>
        </Paper>

        {/* Empty State */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 'calc(100vh - 120px)',
          p: 3
        }}>
          <FolderIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            This folder is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Create your first form to get started
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
            sx={{ fontWeight: 500 }}
          >
            Create New Form
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Paper sx={{ 
        borderRadius: 0, 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'white',
        zIndex: 1
      }}>
        <Toolbar sx={{ minHeight: '56px !important' }}>
          <FolderIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
            My Forms ({savedForms.length} items)
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={(e) => setSortMenuAnchor(e.currentTarget)}
              sx={{ color: 'text.secondary' }}
            >
              <SortIcon />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              sx={{ color: 'text.secondary' }}
            >
              {viewMode === 'list' ? <GridViewIcon /> : <ViewListIcon />}
            </IconButton>
            
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <RefreshIcon />
            </IconButton>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              size="small"
              sx={{ fontWeight: 500 }}
            >
              New Form
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {viewMode === 'list' ? (
          <Paper sx={{ margin: 2, borderRadius: 2 }}>
            <List sx={{ p: 0 }}>
              {sortedForms.map((form, index) => (
                <React.Fragment key={form.id}>
                  <ListItemButton
                    onContextMenu={(e) => handleContextMenu(e, form.id)}
                    onDoubleClick={() => handlePreview(form.id)}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DescriptionIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {form.name}
                          </Typography>
                          {form.fields.some(f => f.isDerived) && (
                            <Chip 
                              label="Smart"
                              size="small"
                              sx={{ 
                                height: 18,
                                fontSize: '0.7rem',
                                bgcolor: 'info.light',
                                color: 'info.dark'
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Modified: {dayjs(form.createdAt).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size: {getFileSize(form.fields.length)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fields: {form.fields.length}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(form.id);
                        }}
                        sx={{ color: 'success.main' }}
                      >
                        <PreviewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(form.id);
                        }}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(form.id);
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemButton>
                  {index < sortedForms.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ) : (
          <Box sx={{ 
            p: 2, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: 2 
          }}>
            {sortedForms.map((form) => (
              <Paper
                key={form.id}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
                onContextMenu={(e) => handleContextMenu(e, form.id)}
                onDoubleClick={() => handlePreview(form.id)}
              >
                <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }} noWrap>
                  {form.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {form.fields.length} fields
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {getFileSize(form.fields.length)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {dayjs(form.createdAt).format('MMM DD')}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => contextMenu && handlePreview(contextMenu.formId)}>
          <PreviewIcon fontSize="small" sx={{ mr: 1 }} />
          Open
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleEdit(contextMenu.formId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => contextMenu && handleDelete(contextMenu.formId)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        <MenuItem onClick={() => { setSortBy('name'); setSortMenuAnchor(null); }}>
          Sort by Name
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('date'); setSortMenuAnchor(null); }}>
          Sort by Date
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('fields'); setSortMenuAnchor(null); }}>
          Sort by Field Count
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MyFormsPage;