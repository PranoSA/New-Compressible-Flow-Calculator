import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js',
  description: 'The React Framework for Production',
};
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      {children}
    </section>
  );
}
