import { randomUUID } from 'crypto';

export type CreateTeacherProps = {
  userId: string;
  biography?: string | null;
  training?: string | null;
  priceHour?: number | null;
  telephone?: string | null;
}

export class Teacher {
  public readonly id: string;
  public userId: string;
  public biography?: string | null;
  public training?: string | null;
  public priceHour?: number | null;
  public telephone?: string | null;

  constructor(id: string, props: CreateTeacherProps) {
    this.id = id;
    this.userId = props.userId;
    this.biography = props.biography;
    this.training = props.training;
    this.priceHour = props.priceHour;
    this.telephone = props.telephone;
  }

  static create(props: CreateTeacherProps): Teacher {
    return new Teacher(randomUUID(), props);
  }
}