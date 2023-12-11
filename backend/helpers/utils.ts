export enum DeparmentsEnum {
  admin,
  maintenance,
  helpdesk,
  signaling,
  telecom,
  mechanical,
}

export const isObjEmpty = (value: any) => {
  for (let prop in value) {
    if (value.hasOwnProperty(prop)) return false;
  }
  return true;
};
