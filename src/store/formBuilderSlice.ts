import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date';

export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'minValue' | 'maxValue' | 'minDate' | 'maxDate' | 'regex';
  value?: number | string;
  message: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: ValidationRule[];
  isDerived: boolean;
  parentFields?: string[];
  derivationLogic?: string;
};

export type FormSchema = {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
};

interface FormBuilderState {
  currentForm: {
    fields: FormField[];
  };
  savedForms: FormSchema[];
}

const loadFromLocalStorage = (): FormBuilderState | undefined => {
  try {
    const serializedState = localStorage.getItem('formBuilderState');
    if (serializedState === null) return undefined;
    const parsedState = JSON.parse(serializedState);
    
    // Ensure the state has the correct structure
    if (parsedState && typeof parsedState === 'object') {
      return {
        currentForm: parsedState.currentForm || { fields: [] },
        savedForms: parsedState.savedForms || [],
      };
    }
    return undefined;
  } catch (e) {
    console.error("Could not load state from localStorage", e);
    return undefined;
  }
};

const initialState: FormBuilderState = loadFromLocalStorage() || {
  currentForm: {
    fields: [],
  },
  savedForms: [],
};

// Save to localStorage after state changes
const saveToLocalStorage = (state: FormBuilderState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('formBuilderState', serializedState);
  } catch (e) {
    console.error("Could not save state to localStorage", e);
  }
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Omit<FormField, 'id'>>) => {
      // Ensure currentForm exists
      if (!state.currentForm) {
        state.currentForm = { fields: [] };
      }
      if (!state.currentForm.fields) {
        state.currentForm.fields = [];
      }
      
      const newField = {
        ...action.payload,
        id: uuidv4(),
      };
      state.currentForm.fields.push(newField);
      saveToLocalStorage(state);
    },
    updateField: (state, action: PayloadAction<{id: string; updates: Partial<FormField>}>) => {
      // Ensure currentForm exists
      if (!state.currentForm) {
        state.currentForm = { fields: [] };
      }
      if (!state.currentForm.fields) {
        state.currentForm.fields = [];
      }
      
      const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (fieldIndex !== -1) {
        state.currentForm.fields[fieldIndex] = {
          ...state.currentForm.fields[fieldIndex],
          ...action.payload.updates,
        };
      }
      saveToLocalStorage(state);
    },
    removeField: (state, action: PayloadAction<string>) => {
      // Ensure currentForm exists
      if (!state.currentForm) {
        state.currentForm = { fields: [] };
      }
      if (!state.currentForm.fields) {
        state.currentForm.fields = [];
      }
      
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      saveToLocalStorage(state);
    },
    reorderFields: (state, action: PayloadAction<{startIndex: number; endIndex: number}>) => {
      // Ensure currentForm exists
      if (!state.currentForm) {
        state.currentForm = { fields: [] };
      }
      if (!state.currentForm.fields) {
        state.currentForm.fields = [];
      }
      
      const result = Array.from(state.currentForm.fields);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);
      state.currentForm.fields = result;
      saveToLocalStorage(state);
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const newForm: FormSchema = {
        id: uuidv4(),
        name: action.payload,
        createdAt: new Date().toISOString(),
        fields: [...state.currentForm.fields],
      };
      state.savedForms.push(newForm);
      state.currentForm.fields = [];
      saveToLocalStorage(state);
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm.fields = [...form.fields];
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      saveToLocalStorage(state);
    },
    resetCurrentForm: (state) => {
      // Ensure currentForm exists
      if (!state.currentForm) {
        state.currentForm = { fields: [] };
      }
      state.currentForm.fields = [];
      saveToLocalStorage(state);
    },
  },
});

export const { 
  addField, 
  updateField, 
  removeField, 
  reorderFields, 
  saveForm, 
  loadForm,
  deleteForm,
  resetCurrentForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;