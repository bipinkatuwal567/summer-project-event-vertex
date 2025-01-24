import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
	daisyui: {
		themes: [],
	},
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		backgroundColor: {
  			'primary': '#001230'
  		},
  		fontFamily: {
  			marcellus: [
  				'Marcellus',
  				'sans-serif'
  			]
  		}
  	}, 
  },
  plugins: [daisyui],
}