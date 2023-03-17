import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  authModalOpen: boolean;
  modalForAddNewFormStep: boolean;
  sendInvoiceModalOpen: boolean;
  createInvoiceAddonModalOpen: boolean;
  createNewFormModalOpen: boolean;
  stepDelConfirmationModalOpen: boolean;
  refreshModalOpen: boolean;
  createNewMaterialModalOpen: boolean;
  saveChangesConfirmationModalOpen: boolean;
  formMaterialDelConfirmationModalOpen: boolean;
}

const initialState: ModalState = {
  authModalOpen: false,
  modalForAddNewFormStep: false,
  sendInvoiceModalOpen: false,
  createInvoiceAddonModalOpen: false,
  createNewFormModalOpen: false,
  stepDelConfirmationModalOpen: false,
  refreshModalOpen: false,
  createNewMaterialModalOpen: false,
  saveChangesConfirmationModalOpen: false,
  formMaterialDelConfirmationModalOpen: false,
};

export const ModalSlice = createSlice({
  name: 'Modal',
  initialState,
  reducers: {
    changeAuthModalStatus: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
    changeModalForAddNewFormStepStatus: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.modalForAddNewFormStep = action.payload;
    },
    changeSendInvoiceModalStatus: (state, action: PayloadAction<boolean>) => {
      state.sendInvoiceModalOpen = action.payload;
    },
    changeCreateInvoiceAddonModalStatus: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.createInvoiceAddonModalOpen = action.payload;
    },
    changeCreateNewFormModalStatus: (state, action: PayloadAction<boolean>) => {
      state.createNewFormModalOpen = action.payload;
    },
    changeStepDelConfirmationModalStatus: (state, action: PayloadAction<boolean>) => {
      state.stepDelConfirmationModalOpen = action.payload;
    },
    changeRefreshModalStatus: (state, action: PayloadAction<boolean>) => {
      state.refreshModalOpen = action.payload;
    },
    changeCreateNewMaterialModalStatus: (state, action: PayloadAction<boolean>) => {
      state.createNewMaterialModalOpen = action.payload;
    },
    changeSaveConfirmationModalStatus: (state, action: PayloadAction<boolean>) => {
      state.saveChangesConfirmationModalOpen = action.payload;
    },
    changeFormMaterialDelConfirmationModalStatus: (state, action: PayloadAction<boolean>) => {
      state.formMaterialDelConfirmationModalOpen = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  changeAuthModalStatus,
  changeModalForAddNewFormStepStatus,
  changeSendInvoiceModalStatus,
  changeCreateInvoiceAddonModalStatus,
  changeCreateNewFormModalStatus,
  changeStepDelConfirmationModalStatus,
  changeRefreshModalStatus,
  changeCreateNewMaterialModalStatus,
  changeSaveConfirmationModalStatus,
  changeFormMaterialDelConfirmationModalStatus,
} = ModalSlice.actions;

export default ModalSlice.reducer;
