import { atom } from "jotai";

export const paymentGatewayConfigAtom = atom<{ id: string; data: any } | null>(
  null,
);
