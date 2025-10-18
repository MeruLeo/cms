export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-center w-full justify-center">{children}</div>
    </section>
  );
}
