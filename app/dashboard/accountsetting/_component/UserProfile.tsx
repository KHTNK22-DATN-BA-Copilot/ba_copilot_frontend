"use client";
import Image from "next/image";
import Avatar from "@/public/Profile.png";
import { Pencil, PenIcon, X, Check, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";

function Field({
    label,
    value,
    state,
    onChange,
}: {
    label: string;
    value: string;
    state: "view" | "edit";
    onChange: any;
}) {
    return (
        <div className="sm:flex sm:justify-between sm:items-center py-2">
            <div className="flex items-center gap-x-2">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </Label>
            </div>
            {state === "edit" ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        type={label === "Email" ? "email" : "text"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="max-w-xs"
                        aria-label={label}
                    />
                </div>
            ) : (
                <p className="truncate max-w-xs">{value}</p>
            )}
        </div>
    );
}

export default function UserProfile() {
    const [avatar, setAvatar] = useState(Avatar.src);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [state, setState] = useState<"view" | "edit">("view");
    const [originalProfile, setOriginalProfile] = useState<{
        fullName: string;
        email: string;
        username: string;
    }>({
        fullName: "Pham Gia Khang",
        email: "pgkhangt1@gmail.com",
        username: "khang080704",
    });
    const [EditProfile, setEditProfile] = useState(originalProfile);

    const handleChangeInfor = async () => {
        console.log(EditProfile);
        setState("view");
        setOriginalProfile(EditProfile);
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
                    label="Full Name"
                    value={EditProfile.fullName}
                    state={state}
                    onChange={(value: string) =>
                        setEditProfile((pre) => ({ ...pre, fullName: value }))
                    }
                />
                <Field
                    label="Email"
                    value={EditProfile.email}
                    state={state}
                    onChange={(value: string) =>
                        setEditProfile((pre) => ({ ...pre, email: value }))
                    }
                />
                <Field
                    label="User name"
                    value={EditProfile.username}
                    state={state}
                    onChange={(value: string) =>
                        setEditProfile((pre) => ({ ...pre, username: value }))
                    }
                />
            </div>
            {state === "edit" && (
                <div
                    className={`gap-4 justify-center mt-2 max-md:justify-center flex`}
                >
                    <Button
                        className="hover:cursor-pointer"
                        onClick={handleChangeInfor}
                    >
                        Edit
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
        </article>
    );
}
