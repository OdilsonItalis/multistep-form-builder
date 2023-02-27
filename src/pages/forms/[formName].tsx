import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/store';

export default function CustomForm() {
    const formsReducer = useSelector((state: RootState) => state.formsReducer);
    return (
        <div>safdasfer</div>
    )
}
