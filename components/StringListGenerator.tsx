// Just pass strings and setStrings as props to the StringList component and you're done!

import CheckIcon from 'public/icons/CheckIcon';
import PlusIcon from 'public/icons/PlusIcon';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function StringListGenerator({
  strings,
  setStrings
}: {
  strings: string[];
  setStrings: (strings: string[]) => void;
}): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddString = (): void => {
    // check if input is empty string or only whitespace
    if (!inputValue.trim()) {
      toast.error('Please enter a value');
      return;
    }
    setStrings([...strings, inputValue]);
    setInputValue('');
  };

  const handleRemoveString = (index: number): void => {
    const newStrings = [...strings];
    newStrings.splice(index, 1);
    setStrings(newStrings);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setInputValue(event.target.value);
  };

  return (
    <div className="">
      <div className="space-y-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Add features to your product
            </span>
          </label>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            className="textarea textarea-bordered h-12"
            placeholder="Enter a feature"
          ></textarea>
          <button
            className="border px-4 rounded h-8 my-4 text-sm flex items-center justify-center gap-2 w-40"
            onClick={handleAddString}
          >
            <PlusIcon height={15} width={15} className="" />
            <p>Add feature</p>
          </button>
        </div>
        <ul className="list-none list-inside space-y-2 bg-gray-100 rounded-lg p-2">
          {strings.length === 0 && (
            <p className="text-xs text-gray-400">No features added yet</p>
          )}
          {strings.map((string: string, index: number) => (
            <li key={index}>
              <div className="flex items-center gap-2">
                <CheckIcon
                  height={15}
                  width={15}
                  className="flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>{string}</span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded ml-auto"
                  onClick={() => handleRemoveString(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StringListGenerator;
