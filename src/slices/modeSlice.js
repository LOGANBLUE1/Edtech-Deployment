import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  mode: true,
  loading: false,
}

const modeSlice = createSlice({
  name: "mode",
  initialState: initialState,
  reducers: {
    setMode(state, value) {
      state.mode = value.payload
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
  },
})

export const { setMode, setLoading } = modeSlice.actions

export default modeSlice.reducer
