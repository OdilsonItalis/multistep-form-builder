import React, { useState } from 'react';
import classNames from 'classnames';
import { FaCheckCircle } from 'react-icons/fa';

export default function NewFormControlsNav() {
  const themeBackgrounds = [
    { name: 'Default', url: '' },
    {
      name: 'Skype Blue',
      url: '/images/formThemeBackgrounds/skype_blue_gradient.png'
    },
    { name: 'Red 123', url: '/images/formThemeBackgrounds/red_123.png' }
  ];
  const [selectedTheme, setSelectedTheme] = useState<number>(0);
  return (
    <div>
      <p className="text-[16px] font-medium mb-4">Background Theme</p>
      <div className="flex items-center">
        {themeBackgrounds.map((item, index) => (
          <div key={index} className="flex flex-col items-center mr-4">
            <div
              className={classNames(
                'w-[50px] h-[100px] rounded-[6px] bg-white overflow-hidden flex justify-center items-center relative cursor-pointer',
                {
                  'border-gray-500 border': index !== selectedTheme && index === 0
                },
                {
                  'border-violet-600 border-2': index === selectedTheme && index === 0
                }
              )}
              onClick={() => setSelectedTheme(index)}
            >
              {item.url !== '' && (
                <img
                  src={item.url}
                  alt="Theme background"
                  className="w-full h-full"
                />
              )}
              {index === selectedTheme && (
                <FaCheckCircle
                  color="rgb(124 58 237)"
                  className="absolute z-10"
                />
              )}
            </div>
            <p className="text-[12px] font-medium text-gray-500">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
