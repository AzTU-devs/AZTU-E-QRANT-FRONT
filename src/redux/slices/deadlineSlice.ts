import { createSlice } from '@reduxjs/toolkit';

const deadlineSlice = createSlice({
    name: 'deadline',
    initialState: {
        submissionDeadline: '2025-10-01T23:59:59',
    },
    reducers: {
        setDeadline: (state, action) => {
            state.submissionDeadline = action.payload;
        },
    },
});

export const { setDeadline } = deadlineSlice.actions;
export default deadlineSlice.reducer;