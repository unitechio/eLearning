export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {children}
      {/* Aesthetic Backdrop Elements */}
      <div className="fixed -bottom-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed -top-48 -right-48 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}
