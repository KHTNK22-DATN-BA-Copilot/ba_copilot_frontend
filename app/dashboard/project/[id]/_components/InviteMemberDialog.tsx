"use client";

import { useState, useEffect } from "react";
import { UserPlus, Mail, Shield, Loader2, CheckCircle2, AlertCircle, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getProjectMembers, inviteProjectMember, updateProjectMemberRole, removeProjectMember } from "@/actions/project.action";
import { useProjectMembership } from "@/context/ProjectMembershipContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface InviteMemberDialogProps {
    projectId: string;
}

interface ProjectMember {
    user_id: number;
    name?: string;
    email: string;
    role: "Owner" | "Editor" | "Viewer";
    joined_at?: string;
}

const getFriendlyErrorMessage = (msg: string): string => {
    if (!msg) return "An error occurred. Please try again.";
    
    const msgLower = msg.toLowerCase();
    
    if (msgLower.includes("already a member")) {
        return "This user is already a member of the project.";
    }
    if (msgLower.includes("role not found")) {
        return "Invalid or non-existent project role.";
    }
    if (msgLower.includes("project not found")) {
        return "Project not found or you do not have access.";
    }
    if (msgLower.includes("user not found")) {
        return "This email is not registered in the system.";
    }
    if (msgLower.includes("does not have project:manage_members")) {
        return "You do not have permission to manage members for this project.";
    }
    if (msgLower.includes("valid email address") || msgLower.includes("value_error.email")) {
        return "Please enter a valid email address.";
    }
    if (msgLower.includes("cannot downgrade the last project owner")) {
        return "Cannot demote the only owner in this project.";
    }
    if (msgLower.includes("cannot remove the last project owner")) {
        return "Cannot delete the only owner in this project.";
    }
    
    return msg;
};

const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case "Owner":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
        case "Editor":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
        case "Viewer":
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700";
        default:
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
};

export default function InviteMemberDialog({ projectId }: InviteMemberDialogProps) {
    const { membership } = useProjectMembership();

    // Member list state
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    
    // Invite states
    const [isOpen, setIsOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"Owner" | "Editor" | "Viewer">("Viewer");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSuccess, setInviteSuccess] = useState(false);

    // Member actions states
    const [actionLoading, setActionLoading] = useState<number | string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<{ userId: number; email: string } | null>(null);

    const handleUpdateRole = async (userId: number, newRole: "Owner" | "Editor" | "Viewer") => {
        setActionLoading(userId);
        setActionError(null);
        try {
            const res = await updateProjectMemberRole(projectId, userId, newRole);
            if (!res.success) {
                setActionError(getFriendlyErrorMessage(res.error || ""));
                return;
            }
            
            // Refresh members list
            const updatedMembers = await getProjectMembers(projectId) as ProjectMember[];
            setMembers(updatedMembers);
        } catch (err: any) {
            console.error("Failed to update role:", err);
            setActionError("An unexpected error occurred. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveMember = async (userId: number, email: string) => {
        setActionLoading(userId);
        setActionError(null);
        try {
            const res = await removeProjectMember(projectId, userId);
            if (!res.success) {
                setActionError(getFriendlyErrorMessage(res.error || ""));
                return;
            }
            
            // Refresh members list
            const updatedMembers = await getProjectMembers(projectId) as ProjectMember[];
            setMembers(updatedMembers);
        } catch (err: any) {
            console.error("Failed to remove member:", err);
            setActionError("An unexpected error occurred. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        if (!isOpen || !projectId) return;

        let active = true;
        setLoadingMembers(true);
        getProjectMembers(projectId)
            .then((data: any) => {
                if (active) setMembers(data);
            })
            .catch((err: any) => {
                console.error("Error fetching members:", err);
            })
            .finally(() => {
                if (active) setLoadingMembers(false);
            });

        return () => {
            active = false;
        };
    }, [isOpen, projectId]);

    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;

        setInviteLoading(true);
        setInviteError(null);
        setInviteSuccess(false);

        try {
            const res = await inviteProjectMember(projectId, inviteEmail.trim(), inviteRole);
            if (!res.success) {
                setInviteError(getFriendlyErrorMessage(res.error || ""));
                return;
            }

            setInviteSuccess(true);
            setInviteEmail("");
            setInviteRole("Viewer");
            
            // Refresh members list
            const updatedMembers = await getProjectMembers(projectId) as ProjectMember[];
            setMembers(updatedMembers);

            // Auto close after 1.5s
            setTimeout(() => {
                setIsOpen(false);
                setInviteSuccess(false);
            }, 1500);
        } catch (err: any) {
            console.error("Failed to invite member:", err);
            setInviteError("An unexpected error occurred. Please try again.");
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 cursor-pointer">
                    <UserPlus className="w-4.5 h-4.5" />
                    Invite
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-500" />
                        Invite New Member
                    </DialogTitle>
                    <DialogDescription>
                        Add a registered user by email to collaborate on this project.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteSubmit} className="space-y-4 py-3">
                    <div className="space-y-2">
                        <Label htmlFor="invite-email" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            Email Address
                        </Label>
                        <Input
                            id="invite-email"
                            type="email"
                            placeholder="Enter user email..."
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            disabled={inviteLoading || inviteSuccess}
                            className="w-full border-gray-300 dark:border-gray-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="invite-role" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <Shield className="w-4 h-4 text-gray-400" />
                            Role
                        </Label>
                        <Select
                            value={inviteRole}
                            onValueChange={(val: any) => setInviteRole(val)}
                            disabled={inviteLoading || inviteSuccess}
                        >
                            <SelectTrigger id="invite-role" className="w-full border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-250 dark:border-gray-750">
                                <SelectItem value="Viewer" className="focus:bg-slate-100 dark:focus:bg-slate-700">Viewer (Read-only)</SelectItem>
                                <SelectItem value="Editor" className="focus:bg-slate-100 dark:focus:bg-slate-700">Editor (Write files/folders)</SelectItem>
                                <SelectItem value="Owner" className="focus:bg-slate-100 dark:focus:bg-slate-700">Owner (Full permissions)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {inviteError && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-2 border border-red-200 dark:border-red-900/50">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{inviteError}</span>
                        </div>
                    )}

                    {inviteSuccess && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm flex items-start gap-2 border border-green-200 dark:border-green-900/50">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>Invitation sent successfully!</span>
                        </div>
                    )}

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-blue-500" />
                            Current Project Members
                        </p>
                        {loadingMembers ? (
                            <div className="flex items-center gap-2 text-xs text-gray-500 py-4 justify-center">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                Loading members...
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 border rounded-lg p-2 bg-gray-50/50 dark:bg-gray-900/20">
                                    {members.map((member) => (
                                        <div key={member.user_id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs">
                                            <div className="min-w-0 flex-1 mr-2">
                                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-1">
                                                    {member.name || member.email.split('@')[0]}
                                                    {membership?.user_id === member.user_id && (
                                                        <span className="text-[9px] font-normal text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-sm">You</span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-gray-500 truncate">{member.email}</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {/* Role selection/badge */}
                                                {membership?.user_id === member.user_id ? (
                                                    <Badge variant="outline" className={`${getRoleBadgeColor(member.role)} uppercase text-[9px] font-semibold`}>
                                                        {member.role}
                                                    </Badge>
                                                ) : (
                                                    <Select
                                                        value={member.role}
                                                        disabled={actionLoading !== null}
                                                        onValueChange={(val: any) => handleUpdateRole(member.user_id, val)}
                                                    >
                                                        <SelectTrigger className="h-7 w-24 text-[10px] border-gray-300 dark:border-gray-700 px-2 bg-white dark:bg-gray-800">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-250 dark:border-gray-750">
                                                            <SelectItem value="Viewer" className="text-xs">Viewer</SelectItem>
                                                            <SelectItem value="Editor" className="text-xs">Editor</SelectItem>
                                                            <SelectItem value="Owner" className="text-xs">Owner</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}

                                                {/* Delete button */}
                                                {membership?.user_id !== member.user_id && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                                                        disabled={actionLoading !== null}
                                                        onClick={() => setMemberToDelete({ userId: member.user_id, email: member.email })}
                                                    >
                                                        {actionLoading === member.user_id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {actionError && (
                                    <div className="p-2 rounded bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[11px] flex items-start gap-1.5 border border-red-200 dark:border-red-900/50">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{actionError}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={inviteLoading}
                            className="cursor-pointer border-gray-300 dark:border-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={inviteLoading || inviteSuccess || !inviteEmail}
                            className="gap-2 cursor-pointer"
                        >
                            {inviteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Invite
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={memberToDelete !== null} onOpenChange={(open) => { if (!open) setMemberToDelete(null); }}>
            <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        Remove Project Member
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to remove <span className="font-semibold text-gray-900 dark:text-gray-100">{memberToDelete?.email}</span> from this project? They will lose all access.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-950 dark:text-gray-50 border-none cursor-pointer">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (memberToDelete) {
                                handleRemoveMember(memberToDelete.userId, memberToDelete.email);
                                setMemberToDelete(null);
                            }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer"
                    >
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
