# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Example Calculation

Suppose your preferences are:
categories = { Music: 2, Tech: 1 }
organizers = { Alice: 1 }
locations = { Kathmandu: 2 }


And there’s an upcoming event:
category: Music
organizer: Alice
location: Kathmandu
happening in 3 days


Score:
Category: ( 2 \times 3 = 6 )
Organizer: ( 1 \times 2 = 2 )
Location: ( 2 \times 1 = 2 )
Soon bonus: ( 1 )

Total score: ( 6 + 2 + 2 + 1 = 11 )
