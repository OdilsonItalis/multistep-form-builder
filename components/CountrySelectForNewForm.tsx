import React, { useContext, useEffect } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';

export interface Location {
  latitude: number;
  longtitude: number;
  city: string;
  country: string;
}

interface Props {
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

export default function CountrySelectForNewForm({
  setLocation,
  address,
  setAddress
}: Props) {
  const handleSelect = async (value: any) => {
    console.log(value);
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    let city = results[0].address_components.find((component) =>
      component.types.includes('locality')
    );
    let country = results[0].address_components.find((component) =>
      component.types.includes('country')
    );
    setLocation((prevState: any) => ({
      ...prevState,
      latitude: latLng.lat,
      longitude: latLng.lng,
      city: city?.long_name,
      country: country?.long_name
    }));
  };

  return (
    <>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        searchOptions={{ types: ['country', 'locality'] }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              className={`input input-bordered w-full`}
              {...getInputProps({ placeholder: '' })}
            />

            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                  marginTop: '10px'
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
}
