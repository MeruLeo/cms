import ProductsTable from "../productsTable";

export function MainSection() {
  return (
    <main className="flex justify-between gap-2 w-full items-stretch">
      <ProductsTable />
    </main>
  );
}
