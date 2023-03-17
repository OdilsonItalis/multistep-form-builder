import { Reviews } from '@/components/Reviews';
import AddressStep from '@/components/StarterForm/AddressStep';
import DobStep from '@/components/StarterForm/DobStep';
import PhoneNumberStep from '@/components/StarterForm/PhoneNumberStep';
import SexButtons from '@/components/StarterForm/SexButtons';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import React from 'react';

function FormExamples() {
  return (
    <div>
      <SexButtons />
      <AddressStep />
      <DobStep />
      <PhoneNumberStep />
      <Reviews />
    </div>
  );
}

export default FormExamples;
