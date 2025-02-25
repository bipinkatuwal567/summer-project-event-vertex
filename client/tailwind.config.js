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
  			'primary': '#001230', 
			'primary-blue': "#2563EB", 
			"hover-blue": "#1A4EC2"
  		},
  		fontFamily: {
  			marcellus: [
  				'Marcellus',
  				'sans-serif'
  			], 
			inter: [
				'Inter', 
				'sans-serif',
			]
  		}
  	}, 
  },
  plugins: [daisyui],
}