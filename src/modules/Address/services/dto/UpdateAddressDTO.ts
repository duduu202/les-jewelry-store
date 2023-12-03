interface IUpdateAddressDTO {
  name?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  id: string;
  request_id?: string;
}

export { IUpdateAddressDTO };
