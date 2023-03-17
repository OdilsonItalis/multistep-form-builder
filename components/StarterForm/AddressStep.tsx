import { changeMultipleFields } from '@/utils/features/customFormSlice';
import { getTheme } from '@/utils/getTheme';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import React from 'react';
import Autocomplete from 'react-google-autocomplete';
import { toast, Toaster } from 'react-hot-toast';

function extractCountry(addressComponents: any[]) {
  for (let component of addressComponents) {
    if (component.types.includes('country')) {
      return component.long_name;
    }
  }
  return null;
}

function extractCity(addressComponents: any[]) {
  for (let component of addressComponents) {
    if (component.types.includes('locality')) {
      return component.long_name;
    }
  }
  return null;
}

function AddressStep() {
  const { theme } = useAppSelector((state) => state.customForm);
  const dispatch = useAppDispatch();
  const usersTheme = getTheme(theme);

  return (
    <>
      <Toaster />
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            Where are you from? <span className="text-red-400 text-xs">*</span>
          </span>
        </label>
        <Autocomplete
          apiKey="AIzaSyBg9-ZM7XtlMUXiVRWKHBrkIs591IuH6g8"
          onPlaceSelected={(place) => {
            // check if its an actual place
            if (!place.geometry) {
              toast.error('Please choose city from the dropdown list.');
              return;
            }
            dispatch(
              changeMultipleFields([
                { key: 'city', value: place.formatted_address },
                { key: 'long', value: place.geometry.location?.lng() },
                { key: 'lat', value: place.geometry.location?.lat() }
              ])
            );
          }}
          className={`input input-bordered ${usersTheme.inactiveColor} rounded-none`}
          placeholder="Enter your city"
        />
      </div>
    </>
  );
}

export default AddressStep;
