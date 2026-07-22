import * as migration_20260720_200055_initial from './20260720_200055_initial';
import * as migration_20260722_033149_add_home_featured_products_certificates from './20260722_033149_add_home_featured_products_certificates';

export const migrations = [
  {
    up: migration_20260720_200055_initial.up,
    down: migration_20260720_200055_initial.down,
    name: '20260720_200055_initial',
  },
  {
    up: migration_20260722_033149_add_home_featured_products_certificates.up,
    down: migration_20260722_033149_add_home_featured_products_certificates.down,
    name: '20260722_033149_add_home_featured_products_certificates'
  },
];
