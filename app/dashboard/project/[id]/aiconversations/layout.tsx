export default function AIConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col">
            {children}
        </div>
    );
}
