import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { User, users } from '../models/users';
const SALT_ROUNDS = 10;

export const UserService = {
  async createUser(newUser: { email: string; password: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(newUser.password, SALT_ROUNDS);
    const [insertedUser] = await db
      .insert(users)
      .values({
        email: newUser.email,
        passwordHash: passwordHash,
      })
      .returning();

    if (!insertedUser) {
      throw new Error('Failed to create user.');
    }
    return insertedUser;
  },

  async findUserByEmail(username: string): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.email, username)).get();
    return user;
  },
  async validatePassword(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  },
};
