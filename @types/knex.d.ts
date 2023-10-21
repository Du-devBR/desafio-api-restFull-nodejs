// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    user: {
      id: string;
      name: string;
      lastname: string;
      email: string;
      hashPassword: string;
    };
    meal: {
      id: string;
      name: string;
      description: string;
      createdAt: date;
      isDiet: boolean;
      userId: string;
    };
  }
}
