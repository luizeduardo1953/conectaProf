import { randomUUID } from 'crypto';

export type CreateTeacherProps = {
  userId: string;
  biography?: string | null;
  training?: string | null;
  priceHour?: number | null;
  telephone?: string | null;
  location?: string | null;
}

export type UpdateTeacherInput = {
  biography?: string | null;
  training?: string | null;
  priceHour?: number | null;
  telephone?: string | null;
  location?: string | null;
}

export class Teacher {
  public readonly id: string;
  public userId: string;
  public biography?: string | null;
  public training?: string | null;
  public priceHour?: number | null;
  public telephone?: string | null;
  public location?: string | null;
  public availabilities?: any[];

  constructor(id: string, props: CreateTeacherProps & { availabilities?: any[] }) {
    this.id = id;
    this.userId = props.userId;
    this.biography = props.biography ?? null;
    this.training = props.training ?? null;
    this.priceHour = props.priceHour ?? 0;
    this.telephone = props.telephone ?? '';
    this.location = props.location ?? null;
    this.availabilities = props.availabilities ?? [];
  }

  static create(props: CreateTeacherProps): Teacher {
    return new Teacher(randomUUID(), props);
  }
}