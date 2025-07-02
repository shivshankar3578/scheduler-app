import '@total-typescript/ts-reset';

if (process.env.NODE_ENV === 'production') {
  console.log('🔐 Loading production mode...');
  import('./index.prod');
} else {
  console.log('👷 Loading development mode...');
  import('./index.dev');
}
