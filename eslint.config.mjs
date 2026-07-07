// ESLint flat config (ESLint 9+/10, Next 16).
// Remplace l'ancien .eslintrc.json : `next lint` a ete retire de Next 16,
// le lint passe desormais directement par ESLint avec la config plate.
import next from 'eslint-config-next/core-web-vitals';

export default [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'prisma/**'],
  },
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];
