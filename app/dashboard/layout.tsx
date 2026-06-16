import DashboardLayout from "@/components/layout/DashboardLayout";
import {getUserInfo} from "@/actions/user.action"

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const user = await getUserInfo();

    return <DashboardLayout name={user.name}>{children}</DashboardLayout>;
}
