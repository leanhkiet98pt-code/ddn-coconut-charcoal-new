import * as migration_20260720_200055_initial from './20260720_200055_initial';

export const migrations = [
  {
    up: migration_20260720_200055_initial.up,
    down: migration_20260720_200055_initial.down,
    name: '20260720_200055_initial'
  },
];
