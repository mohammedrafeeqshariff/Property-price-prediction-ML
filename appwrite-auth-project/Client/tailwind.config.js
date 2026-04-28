/** @type {import('tailwindcss').Config} */
const daisy = require('daisyui');
export const content = ['./index.html', './src/**/*.{js,ts,jsx,tsx}'];
export const theme = {
  extend: {},
};
export const plugins = [daisy];