import OrdersTable from "../ordersTable";

export function MainSection() {
  return (
    <main className="flex justify-between gap-2 w-full items-stretch">
      <OrdersTable />
    </main>
  );
}
