import { Role } from '../entity/role.entity';

export interface Payload {
  id: number;
  userid: string;
  username: string;
  roles: Role[];
}
