import { makeApp } from './app';

const PORT = process.env.PORT || 3000;

makeApp().listen(PORT, () => {
  console.log(`Notes API escuchando en http://localhost:${PORT}`);
});
