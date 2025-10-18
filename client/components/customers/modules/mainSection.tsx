import CustomersTable from "../customersTable";

export function MainSection() {
  return (
    <main className="flex justify-between gap-2 w-full items-stretch">
      <CustomersTable />
    </main>
  );
}
