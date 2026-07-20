import NewProject from "./_components/NewProject";
import { getUserInfo } from "@/actions/user.action";

export default async function NewProjectPage() {
    const user = await getUserInfo();

    return <NewProject username={user.name} />;
}
