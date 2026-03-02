export type UserRole = 'teacher' | 'student' | 'admin';

export type CreateUserProps = {
  name: string;
  email: string;
  role: UserRole;
};

export type UpdateUserInput = {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
};

export class User {
  private constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public role: UserRole,
    public createdAt: Date,
    public firebaseUid?: string,
  ) {}

  static create(props: CreateUserProps) {
    return new User(
      crypto.randomUUID(),
      props.name,
      props.email,
      props.role,
      new Date(),
    );
  }

  //   changePassword(newPasswordHash: string) {
  //     if (newPasswordHash.length < 8) {
  //       throw new Error('A senha deve ter pelo menos 8 caracteres.');
  //     }
  //     this.passwordHash = newPasswordHash;
  //   }

  //   updateName(name: string) {
  //     this.name = name;
  //   }

  //   updateEmail(email: string) {
  //     this.email = email;
  //   }

  //   changeRole(role: UserRole) {
  //     this.role = role;
  //   }
}
