"use client";
import Image from "next/image";
import Avatar from "@/public/Profile.png";
import { Pencil, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
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
import { StateProps, UserProfileProps } from "./types";
import { isEqual, isValidEmail, updateUserProfile } from "./utils";

export default function UserProfile({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    const [avatar, setAvatar] = useState<string | null>(name[0].toUpperCase());
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
        setState({ state: "pending" });

        const result = await updateUserProfile(EditProfile);

        if (result.success) {
            setOriginalProfile(EditProfile);
            setState({ state: "view" });

            // Redirect to login if email changed, otherwise reload
            if (EditProfile.email !== originalProfile.email) {
                window.location.href = "/login";
            } else {
                window.location.reload();
            }
        } else {
            setState({
                state: "error",
                message: result.message || "Failed to update profile",
            });
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
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-x-3 sm:gap-x-4 mb-4 sm:mb-5 min-w-0">
                    <div className="relative group flex-shrink-0">
                        {avatar ? (
                            <div
                                className={`*:w-12 h-12 flex justify-center items-center text-2xl sm:w-[60px] sm:h-[60px] rounded-full border border-gray-200 dark:border-gray-700 object-cover bg-gray-200 dark:bg-gray-700`}
                            >
                                {avatar}
                            </div>
                        ) : (
                            <div
                                className={`w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 text-white flex items-center justify-center overflow-hidden shadow-sm`}
                            >
                                <svg
                                    className="w-7 h-7 sm:w-8 sm:h-8"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base truncate">
                            {name}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm truncate">
                            {email}
                        </p>
                    </div>
                </div>
                <Edit
                    className="hover:cursor-pointer flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6"
                    onClick={() => setState({ state: "edit" })}
                />
            </div>
            <hr className="my-2" />
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
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
                    {/* <Field
                        label="Your API Key"
                        value={EditProfile.apiKey || ""}
                        state={state.state}
                        onChange={(value: string) =>
                            setEditProfile((pre) => ({
                                ...pre,
                                apiKey: value,
                            }))
                        }
                    /> */}
                    {(isEditMode || isPendingMode || isErrorMode) && (
                        <div
                            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-3 sm:mt-4`}
                        >
                            <Button
                                className="hover:cursor-pointer w-full sm:w-auto"
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
                                className="w-full sm:w-auto"
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
