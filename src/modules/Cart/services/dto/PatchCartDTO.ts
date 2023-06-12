import { Cart_status } from '@prisma/client';

interface IPatchCartDTO {
  request_id: string;
  id: string;
  status: Cart_status;
}

export { IPatchCartDTO };
