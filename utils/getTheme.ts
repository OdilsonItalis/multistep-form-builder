export const themeOptions = [
  {
    name: 'Default',
    value: 'default',
    activeColor: 'bg-black',
    inactiveColor: 'bg-gray-100',
    activeTabText: 'text-gray-400',
    ringActive: 'ring-gray-400'
  },
  {
    name: 'Pink',
    value: 'pink',
    activeColor: 'bg-pink-400',
    inactiveColor: 'bg-white/50',
    activeTabText: 'text-white',
    ringActive: 'ring-pink-400'
  },
  {
    name: 'Blue',
    value: 'blue',
    activeColor: 'bg-blue-400',
    inactiveColor: 'bg-blue-100',
    activeTabText: 'text-white',
    ringActive: 'ring-blue-400'
  }
];

interface ThemeOption {
  name: string;
  value: string;
  activeColor: string;
  inactiveColor: string;
  activeTabText: string;
  ringActive: string;
}

export function getTheme(themeValue: string | unknown): ThemeOption {
  const theme = themeOptions.find((theme) => theme.value === themeValue);
  if (!theme) {
    return themeOptions[0]; // Return default theme if theme is not found
  }
  return theme;
}
