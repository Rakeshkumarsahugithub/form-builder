# Form Builder Application

A powerful, dynamic form builder application built with React and TypeScript that allows users to create, customize, and manage forms with advanced features including derived fields, drag-and-drop functionality, and comprehensive validation.
**[🚀 View Live Demo](https://form-builder-livid-eight.vercel.app/)**
<div style="display: flex; justify-content: space-between; align-items: center;">
  <img src="https://github.com/user-attachments/assets/54022bdf-714e-45af-adaa-16433aa31e52" width="395" height="650" style="margin-right: 10px;">
  <img src="https://github.com/user-attachments/assets/ed252f7c-fad4-4990-9a54-8164f9991af5" width="400" height="650">
</div>

## 🚀 About the Project

This Form Builder is a comprehensive web application that enables users to:

- **Create Dynamic Forms**: Build forms with various field types including text, number, textarea, select, radio, checkbox, and date fields
- **Drag & Drop Interface**: Intuitive form building experience with drag-and-drop field reordering
- **Derived Fields**: Advanced feature allowing fields to be automatically calculated based on other field values using mathematical expressions
- **Form Management**: Save, edit, and manage multiple forms with persistent storage
- **Real-time Preview**: Live preview of forms as they're being built
- **Comprehensive Validation**: Built-in validation rules with custom error messages
- **Responsive Design**: Mobile-friendly interface that works across devices

## 🛠️ Technologies Used

### **Frontend Framework & Core**
- **React 18.2.0**: Core UI library for building component-based user interfaces
- **TypeScript 4.9.5**: Type-safe JavaScript for better development experience and code reliability
- **React Router DOM**: Client-side routing for single-page application navigation

### **State Management**
- **Redux Toolkit 2.8.2**: Modern Redux for predictable state management
- **React Redux 9.2.0**: React bindings for Redux to connect components to the store

### **UI Components & Styling**
- **Material-UI (MUI) 7.3.1**: Comprehensive React component library following Material Design
- **@mui/icons-material**: Material Design icons for consistent UI elements
- **@emotion/react & @emotion/styled**: CSS-in-JS library for dynamic styling

### **Enhanced User Experience**
- **React Beautiful DnD 13.1.1**: Smooth drag-and-drop functionality for form field reordering
- **Day.js 1.11.13**: Lightweight date manipulation library for date field handling

### **Utility Libraries**
- **Math.js 14.6.0**: Mathematical expression parser and evaluator for derived field calculations
- **UUID 11.1.0**: Unique identifier generation for form fields and forms

### **Development & Testing**
- **React Scripts 5.0.1**: Build tools and development server
- **Testing Library**: Comprehensive testing utilities for React components
- **Jest**: JavaScript testing framework

## 📁 Project Structure

```
form-builder/
├── public/                     # Static assets and HTML template
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── DerivationHelper.tsx    # Helper component for derived field logic
│   │   ├── FieldConfigDialog.tsx   # Modal for configuring field properties
│   │   └── Layout.tsx              # Main application layout wrapper
│   ├── pages/                 # Main application pages
│   │   ├── CreateFormPage.tsx      # Form creation and editing interface
│   │   ├── MyFormPage.tsx          # Form management and listing page
│   │   └── PreviewPage.tsx         # Form preview and testing interface
│   ├── store/                 # Redux state management
│   │   ├── formBuilderSlice.ts     # Redux slice for form builder state
│   │   └── store.ts                # Redux store configuration
│   ├── utils/                 # Utility functions and helpers
│   │   ├── formUtils.ts            # Form-related utility functions
│   │   └── validationUtils.ts      # Field validation logic and rules
│   ├── App.tsx                # Main application component with routing
│   ├── index.tsx              # Application entry point
│   └── [other config files]
├── package.json               # Dependencies and scripts
└── README.md                 # Project documentation
```

## 📋 File Details & Purpose

### **Core Application Files**

#### `src/App.tsx`
- **Purpose**: Main application component that sets up routing and Redux provider
- **Functionality**: Defines application routes (/create, /preview, /myforms) and wraps the app with necessary providers

#### `src/index.tsx`
- **Purpose**: Application entry point that renders the React app
- **Functionality**: Mounts the App component to the DOM and sets up React StrictMode

### **Page Components**

#### `src/pages/CreateFormPage.tsx`
- **Purpose**: Primary form building interface where users create and edit forms
- **Key Features**:
  - Drag-and-drop field management using React Beautiful DnD
  - Field addition with various types (text, number, select, etc.)
  - Real-time form preview
  - Field configuration through modal dialogs
  - Form saving and naming functionality
- **State Management**: Connects to Redux store for form state management

#### `src/pages/MyFormPage.tsx`
- **Purpose**: Form management dashboard for viewing and managing saved forms
- **Key Features**:
  - List of all saved forms with metadata
  - Form editing, duplication, and deletion
  - Quick form preview access
  - Form search and filtering capabilities

#### `src/pages/PreviewPage.tsx`
- **Purpose**: Form preview and testing interface
- **Key Features**:
  - Live form rendering with actual field behavior
  - Form submission testing
  - Validation testing and error display
  - Derived field calculation demonstration

### **Component Files**

#### `src/components/FieldConfigDialog.tsx`
- **Purpose**: Modal dialog for configuring individual form fields
- **Key Features**:
  - Field property editing (label, validation, options)
  - Derived field configuration with mathematical expressions
  - Validation rule setup with custom error messages
  - Field type-specific configuration options

#### `src/components/DerivationHelper.tsx`
- **Purpose**: Helper component for setting up derived field logic
- **Key Features**:
  - Mathematical expression builder interface
  - Field dependency selection
  - Expression validation and testing
  - Real-time calculation preview

#### `src/components/Layout.tsx`
- **Purpose**: Application layout wrapper with navigation
- **Key Features**:
  - Responsive navigation bar
  - Page routing integration
  - Consistent application styling

### **State Management**

#### `src/store/store.ts`
- **Purpose**: Redux store configuration
- **Functionality**: Sets up the Redux store with form builder slice

#### `src/store/formBuilderSlice.ts`
- **Purpose**: Redux slice managing all form builder state
- **Key State**:
  - Current form being edited
  - Saved forms collection
  - Field definitions and properties
- **Actions**:
  - `addField`: Add new field to current form
  - `updateField`: Update existing field properties
  - `removeField`: Delete field from form
  - `reorderFields`: Change field order via drag-and-drop
  - `saveForm`: Save form to collection
  - `loadForm`: Load existing form for editing

### **Utility Files**

#### `src/utils/formUtils.ts`
- **Purpose**: Form-related utility functions
- **Key Functions**:
  - Form data serialization/deserialization
  - Field value processing
  - Form structure validation

#### `src/utils/validationUtils.ts`
- **Purpose**: Comprehensive field validation system
- **Key Features**:
  - Multiple validation rule types (required, length, email, etc.)
  - Custom validation messages
  - Real-time validation feedback
  - Cross-field validation support

## 🔧 How It Works

### **Application Architecture**

The Form Builder follows a modern React architecture with clear separation of concerns:

1. **Component-Based UI**: Modular React components handle specific functionality
2. **Centralized State**: Redux manages application state for consistency across components
3. **Type Safety**: TypeScript ensures type safety and better development experience
4. **Responsive Design**: Material-UI provides consistent, mobile-friendly interface

### **Form Building Process**

1. **Field Addition**: Users select field types from a palette and add them to the form
2. **Field Configuration**: Each field opens a configuration dialog for customization
3. **Drag & Drop**: Fields can be reordered using intuitive drag-and-drop interface
4. **Real-time Preview**: Changes are immediately reflected in the form preview
5. **Validation Setup**: Comprehensive validation rules can be applied to each field
6. **Derived Fields**: Advanced users can create calculated fields using mathematical expressions

### **Derived Fields System**

The application's standout feature is its derived fields capability:

- **Mathematical Expressions**: Uses Math.js to evaluate complex calculations
- **Field Dependencies**: Derived fields can reference other form fields
- **Real-time Updates**: Calculations update automatically when dependent fields change
- **Expression Validation**: Ensures mathematical expressions are valid before saving

### **State Management Flow**

1. **User Actions**: User interactions trigger Redux actions
2. **State Updates**: Redux slice updates application state immutably
3. **Component Re-rendering**: Connected components automatically re-render with new state
4. **Persistence**: Forms are saved to localStorage for persistence across sessions

### **Validation System**

- **Rule-Based**: Multiple validation rules can be applied to each field
- **Real-time Feedback**: Validation occurs as users type
- **Custom Messages**: Each validation rule can have custom error messages
- **Cross-field Validation**: Fields can validate against other field values

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rakeshkumarsahugithub/form-builder.git
   cd form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- **`npm start`**: Runs the app in development mode
- **`npm test`**: Launches the test runner
- **`npm run build`**: Builds the app for production
- **`npm run eject`**: Ejects from Create React App (one-way operation)

## 🎯 Key Features

### **Dynamic Form Creation**
- Support for 7 different field types
- Drag-and-drop field reordering
- Real-time form preview
- Field duplication and deletion

### **Advanced Field Configuration**
- Custom labels and placeholders
- Comprehensive validation rules
- Default values and field options
- Conditional field display

### **Derived Fields**
- Mathematical expression evaluation
- Field dependency management
- Real-time calculation updates
- Expression syntax validation

### **Form Management**
- Save and load multiple forms
- Form duplication and editing
- Form deletion and organization
- Persistent storage across sessions

### **User Experience**
- Responsive design for all devices
- Intuitive drag-and-drop interface
- Real-time validation feedback
- Material Design consistency

## 📱 Mobile Support

The application includes mobile-specific components and responsive design:
- Touch-friendly interface
- Mobile-optimized form layouts
- Responsive navigation
- Touch-based drag-and-drop support


---

**Built with ❤️ using React, TypeScript, and Material-UI**
#
