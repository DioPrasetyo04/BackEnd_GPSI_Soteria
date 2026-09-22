// Data shape yang dikembalikan Prisma (full record)
export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Data shape yang aman dikembalikan ke client (tanpa password)
export interface UserPublicInterface {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
