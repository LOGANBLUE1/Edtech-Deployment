import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  mode: false
}

const modeSlice = createSlice({
  name: "mode",
  initialState: initialState,
  reducers: {
    setMode(state, value) {
      state.mode = value.payload
    }
  },
})

export const { setMode } = modeSlice.actions

export default modeSlice.reducer
