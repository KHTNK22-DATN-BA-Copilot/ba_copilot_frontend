export default function GeneratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout just passes through children since the parent layout
    // already provides Header, Sidebar, and Footer
    return <>{children}</>;
}
