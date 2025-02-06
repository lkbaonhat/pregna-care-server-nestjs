export enum UserStatus {
  // Registered users are those who have signed up but have not yet confirmed their email address
  Registered = 'registered',
  // Active users are those who have confirmed their email address and are able to log in
  Active = 'active',
  // Banned users are those who have been banned from the platform
  Banned = 'banned',
}

export enum UserRoles {
  Admin = 'admin',
  Basic = 'basic',
  Premium = 'premium',
}
