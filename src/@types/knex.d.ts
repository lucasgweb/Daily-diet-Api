// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
    };
    meals: {
      id: string;
      name: string;
      description: string;
      dietary_compliance: boolean;
      created_at: string;
      user_id: string;
    };
  }
}
