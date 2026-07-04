"use client";

import { AlertTriangle, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash, Edit, CheckCircle } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { AIProvider } from "@/type/types";

type Props = {
    apiKeyId: string,
    onDelete: (provider: AIProvider, apiKeyId: string) => void,
    onChangeModel: (provider: AIProvider, apiKeyId: string) => void,
    onActivate?: (provider: AIProvider, apiKeyId: string) => void,
    provider: AIProvider,
    isDeleting?: boolean,
    status: string
}

export default function ThreeDotsMenu({ apiKeyId, onDelete, onChangeModel, onActivate, provider, isDeleting, status }: Props) {
    const [isDelete, setIsDelete] = useState(false)
    console.log(status)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreHorizontal className="h-5 w-5" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>Option</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            onChangeModel(provider, apiKeyId);
                        }}
                        className="p-3 cursor-pointer"
                    >
                        <Edit className="inline-block mr-2 h-4 w-4" />
                        Change Model
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onActivate) onActivate(provider, apiKeyId);
                        }}
                        className={`p-3 ${status == 'active' ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={status == 'active'}
                    >
                        <CheckCircle className="inline-block mr-2 h-4 w-4" />
                        Activate key
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDelete(true);
                        }}
                        className="p-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                        disabled={isDeleting}
                    >
                        <Trash className="inline-block mr-2 h-4 w-4" />
                        Delete key
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
                <AlertDialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] mx-4" onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-base sm:text-lg">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left space-y-2 text-xs sm:text-sm">
                            This action cannot be undone. This will permanently delete your
                            key from our server
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <AlertDialogCancel className="w-full sm:w-auto" onClick={() => setIsDelete(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setIsDelete(false);
                                onDelete(provider, apiKeyId);
                            }}
                            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600/50 w-full sm:w-auto"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}