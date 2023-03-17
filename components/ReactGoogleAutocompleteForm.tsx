import React from 'react';
import Autocomplete from 'react-google-autocomplete';

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

function ReactGoogleAutocompleteForm() {
  return (
    <Autocomplete
      apiKey="AIzaSyBg9-ZM7XtlMUXiVRWKHBrkIs591IuH6g8"
      onPlaceSelected={(place) => {
        console.log(place);
        const addressComponents = place.address_components;
        if (!addressComponents) return; // why would this be undefined?
        const country = extractCountry(addressComponents);
        const city = extractCity(addressComponents);
      }}
      className="input input-bordered w-full"
      placeholder="Enter your city"
      onChange={(event) => console.log(event)}
    />
  );
}

export default ReactGoogleAutocompleteForm;
