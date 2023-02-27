import React from 'react';

import { FromLabelProps } from '../../models/componentsMaterialModels';

export default function FormLabel({ children }: FromLabelProps) {
  return (
    <label className="mt-2 mb-1 font-medium text-[14px]">{children}</label>
  );
}
