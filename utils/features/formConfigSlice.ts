import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FormConfigInterface {
  order_number: number;
  component: string;
  input?: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'date';
  label?: string;
  name?: string;
  placeholder?: string;
  image?: string;
}

export interface FormConfigStepInterface {
  order_number: number;
  title?: string;
  subtitle?: string;
  image_url?: string;
  components: FormConfigInterface[];
}

const initialState: FormConfigStepInterface[] = [];

export const formConfigSlice = createSlice({
  name: 'formConfig',
  initialState,
  reducers: {
    addNewFormConfigStep: (state) => {
      state.push({
        order_number: state.length + 1,
        title: `Step ${state.length + 1}`,
        components: []
      });
    },
    updateFormConfig: (
      state,
      action: PayloadAction<FormConfigStepInterface[]>
    ) => {
      return action.payload;
    },
    // // write a function that moves selected step down and then reorders the array with correct order numbers
    moveSelectedFormConfigStepUp: (state, action: PayloadAction<number>) => {
      const selectedStep = state[action.payload];
      const stepBelow = state[action.payload + 1];
      state[action.payload] = stepBelow;
      state[action.payload + 1] = selectedStep;
      // reorder the order numbers make sure it starts from 1
      state.forEach((step, index) => {
        step.order_number = index + 1;
      });
    },
    // // write a function that moves selected step up and then reorders the array with correct order numbers
    moveSelectedFormConfigStepDown: (state, action: PayloadAction<number>) => {
      const selectedStep = state[action.payload];
      const stepAbove = state[action.payload - 1];
      state[action.payload] = stepAbove;
      state[action.payload - 1] = selectedStep;
      // reorder the order numbers make sure it starts from 1
      state.forEach((step, index) => {
        step.order_number = index + 1;
      });
    },
    deleteSelectedFormConfigStep: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
      // reorder the order numbers make sure it starts from 1
      state.forEach((step, index) => {
        step.order_number = index + 1;
      });
    },
    addNewFieldToSelectedStep: (
      state,
      action: PayloadAction<{
        stepIndex: number;
        field: FormConfigInterface;
      }>
    ) => {
      console.log('this ran');
      state[action.payload.stepIndex].components.push(action.payload.field);
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  addNewFormConfigStep,
  updateFormConfig,
  moveSelectedFormConfigStepDown,
  moveSelectedFormConfigStepUp,
  deleteSelectedFormConfigStep,
  addNewFieldToSelectedStep
} = formConfigSlice.actions;

export default formConfigSlice.reducer;
