import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  selectedCategoryId: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setSelectedCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
