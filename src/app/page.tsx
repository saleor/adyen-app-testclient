import { Billing } from "./components/billing";
import { Cart } from "./components/cart";
import { Environment } from "./components/environment";
import { Shipping } from "./components/shipping";

export default function Home() {
  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <div className="grid gap-4 md:gap-8">
        <Environment />
        <Billing />
        <Shipping />
      </div>
      <div className="grid gap-4 md:gap-8">
        <Cart />
      </div>
    </main>
  );
}
