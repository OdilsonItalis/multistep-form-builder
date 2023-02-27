const initialState = {
  totalForms: [],
  selectedForm: {}
};

export const formsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'createNewForm':
      state = {
        ...state,
        totalForms: [...state.totalForms, action.payload],
        selectedForm: action.payload
      };
    default:
      return state;
  }
};
