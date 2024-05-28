/* eslint-disable no-unused-vars */
export enum GlobalRoute {
  PREFIX = '/api/',
}

export const enum UsersRoute {
  REGISTER = 'users',
  SINGLE_USER = 'user/:userId',
  RETRIEVE_IMAGE = ':userId/avatar',
}
