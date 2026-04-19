export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-planora-surface/60 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 py-12 md:justify-center md:py-16">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
