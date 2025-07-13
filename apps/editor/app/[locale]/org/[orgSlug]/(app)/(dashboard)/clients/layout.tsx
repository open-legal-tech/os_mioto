export default function ClientLayout({
  children,
  client,
}: {
  children: React.ReactNode;
  client: React.ReactNode;
}) {
  return (
    <>
      {client}
      {children}
    </>
  );
}
