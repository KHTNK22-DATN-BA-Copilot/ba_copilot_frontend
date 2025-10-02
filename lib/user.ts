export type StateProps =
    | {
          state: "view" | "edit" | "alert" | "pending";
      }
    | {
          state: "error";
          message: string;
      };
export type UserProfileProps = {
    fullName: string;
    email: string;
};
export function isEqual(a: UserProfileProps, b: UserProfileProps) {
    return (
        a.fullName.trim() === b.fullName.trim() &&
        a.email.trim() === b.email.trim()
    );
}
export function isValidEmail(email: string) {
    const emailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
    return emailRegex.test(email);
}
