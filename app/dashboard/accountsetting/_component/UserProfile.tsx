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

type UserProfileProps = {
    fullName: string;
    email: string;
    username: string;
};

function isEqual(a: UserProfileProps, b: UserProfileProps) {
    return (
        a.fullName.trim() === b.fullName.trim() &&
        a.email.trim() === b.email.trim() &&
        a.username.trim() === b.username.trim()
    );
}

function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default function UserProfile() {
    const [avatar, setAvatar] = useState(Avatar.src);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [state, setState] = useState<"view" | "edit" | "alert" | "pending">(
        "view"
    );
    const [originalProfile, setOriginalProfile] = useState<UserProfileProps>({
        fullName: "Pham Gia Khang",
        email: "pgkhangt1@gmail.com",
        username: "khang080704",
    });
    const [EditProfile, setEditProfile] = useState(originalProfile);

    const handleChangeInfor = async () => {
        console.log(EditProfile);
        setState("pending");
        setOriginalProfile(EditProfile);
        setState("view");
    };

    const sendAlert = async () => {
        if (EditProfile.email !== originalProfile.email) {
            if (!isValidEmail(EditProfile.email)) {
                alert("Please enter a valid email address.");
                return;
            }
            setState("alert");
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
                        <p className="font-semibold">Pham Gia Khang</p>
                        <p className="text-gray-500 text-sm">
                            pgkhangt1@gmail.com
                        </p>
                    </div>
                </div>
                <Edit
                    className="hover:cursor-pointer"
                    onClick={() => setState("edit")}
                />
            </div>
            <hr className="my-2" />
            <div className="mt-6 space-y-4">
                <Field
                    label="Email"
                    value={EditProfile.email}
                    state={state}
                    onChange={(value: string) =>
                        setEditProfile((pre) => ({ ...pre, email: value }))
                    }
                />
                <Field
                    label="Full Name"
                    value={EditProfile.fullName}
                    state={state}
                    onChange={(value: string) =>
                        setEditProfile((pre) => ({ ...pre, fullName: value }))
                    }
                />
            </div>
            {(state === "edit" || state === "pending") && (
                <div
                    className={`gap-4 justify-center mt-2 max-md:justify-center flex`}
                >
                    <Button
                        className="hover:cursor-pointer"
                        onClick={sendAlert}
                        disabled={
                            isEqual(originalProfile, EditProfile) ||
                            state === "pending"
                        }
                    >
                        {state === "pending" ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={() => {
                            setState("view");
                            setEditProfile(originalProfile);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            )}
            <AlertDialog
                open={state === "alert"}
                onOpenChange={() => setState("view")}
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
