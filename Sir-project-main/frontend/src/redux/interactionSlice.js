import { createSlice } from "@reduxjs/toolkit";

const interactionSlice = createSlice({
  name: "interaction",
  initialState: {
    data: {},
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = interactionSlice.actions;
export default interactionSlice.reducer;