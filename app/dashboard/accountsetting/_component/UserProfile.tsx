"use client";
import Image from "next/image";
import Avatar from "@/public/Profile.png";
import { Pencil, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field } from "./Field";

//import util relevant user management
import { StateProps, UserProfileProps, isEqual, isValidEmail } from "@/lib/user";


export default function UserProfile({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    const [avatar, setAvatar] = useState(Avatar.src);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [state, setState] = useState<StateProps>({
        state: "view",
    });
    const [originalProfile, setOriginalProfile] = useState<UserProfileProps>({
        fullName: name,
        email: email,
    });
    const [EditProfile, setEditProfile] = useState(originalProfile);

    const isEditMode = state.state === "edit";
    const isPendingMode = state.state === "pending";
    const isErrorMode = state.state === "error";
    const isAlertMode = state.state === "alert";

    const handleChangeInfor = async () => {
        console.log(EditProfile);
        setState({ state: "pending" });
        setOriginalProfile(EditProfile);
        try {
            const res = await fetch("/api/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(EditProfile),
            });
            const result = await res.json();
            if (res.ok) {
                setState({ state: "view" });
                if (EditProfile.email !== originalProfile.email) {
                    window.location.href = "/login";
                } else {
                    window.location.reload();
                }
            } else {
                throw new Error(result.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const sendAlert = async () => {
        if (EditProfile.email !== originalProfile.email) {
            if (!isValidEmail(EditProfile.email)) {
                setState({
                    state: "error",
                    message: "Invalid email format.",
                });
                return;
            }
            setState({ state: "alert" });
        } else {
            handleChangeInfor();
        }
    };

    return (
        <article>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-4 mb-5">
                    <div className="relative group">
                        <Image
                            src={avatar}
                            alt="User Avatar"
                            width={60}
                            height={60}
                            className="rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                        />
                        <label
                            className="absolute cursor-pointer bottom-0 right-0 w-5 h-5 bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110"
                            title="Change profile picture"
                        >
                            <Pencil className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                aria-label="Upload profile picture"
                            />
                        </label>
                    </div>
                    <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-gray-500 text-sm">{email}</p>
                    </div>
                </div>
                <Edit
                    className="hover:cursor-pointer"
                    onClick={() => setState({ state: "edit" })}
                />
            </div>
            <hr className="my-2" />
            <div className="mt-6 space-y-4">
                <form onSubmit={(e) => e.preventDefault()}>
                    <Field
                        label="Email"
                        value={EditProfile.email}
                        state={state.state}
                        onChange={(value: string) => {
                            setEditProfile((pre) => ({ ...pre, email: value }));
                            setState({ state: "edit" });
                        }}
                        message={isErrorMode ? state.message : ""}
                    />
                    <Field
                        label="Full Name"
                        value={EditProfile.fullName}
                        state={state.state}
                        onChange={(value: string) =>
                            setEditProfile((pre) => ({
                                ...pre,
                                fullName: value,
                            }))
                        }
                    />
                    {(isEditMode || isPendingMode || isErrorMode) && (
                        <div
                            className={`gap-4 justify-center mt-2 max-md:justify-center flex`}
                        >
                            <Button
                                className="hover:cursor-pointer"
                                onClick={sendAlert}
                                disabled={
                                    isEqual(originalProfile, EditProfile) ||
                                    state.state === "pending"
                                }
                            >
                                {state.state === "pending"
                                    ? "Saving..."
                                    : "Save"}
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    setState({ state: "view" });
                                    setEditProfile(originalProfile);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </div>

            <AlertDialog
                open={isAlertMode}
                onOpenChange={() => setState({ state: "view" })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. We will change your
                            email and redirect you to the login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setEditProfile(originalProfile)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleChangeInfor}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </article>
    );
}
