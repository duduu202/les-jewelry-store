export interface IPaymentCardCreate {
  user_id: string
  external_id: string
  first_four_digits: string
  last_four_digits: string
  brand: string
  holder_name: string
}
