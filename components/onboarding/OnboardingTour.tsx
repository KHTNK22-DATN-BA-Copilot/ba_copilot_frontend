"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Joyride,
    EventData,
    STATUS,
    Step,
    ACTIONS,
    EVENTS,
} from "react-joyride";
import { usePathname } from "next/navigation";
import { ShadcnTooltip } from "./OnboardingButton";
import { getUserInfo, updateUserInfo } from "@/actions/user.action";

// ─── Onboarding Steps cho trang Dashboard (/dashboard) ─────────────────
const dashboardSteps: Step[] = [
    {
        target: "body",
        content: (
            <div className="text-center">
                <div className="text-3xl mb-3">🎉</div>
                <h2 className="text-lg font-bold mb-2">
                    Welcome to BA Copilot
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    BA Copilot help you automate the business analysis process
                    with AI assistance. Let's explore the main features
                    together!
                </p>
            </div>
        ),
        placement: "center",
        skipBeacon: true,
    },
    {
        target: '[data-tour="search-bar"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">🔍 Quick Search</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use the search bar or the shortcut{" "}
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                        Ctrl+K
                    </kbd>{" "}
                    to quickly find projects, documents, or users.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
    {
        target: '[data-tour="overview-section"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📊 Project Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    This is the overview table that helps you track the total
                    number of projects and important statistics.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
    {
        target: '[data-tour="create-project"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">➕ Create New Project</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Click here to create your first BA project. Each project
                    will contain all your Planning, Analysis, and Design
                    documents.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
];

// ─── Onboarding Steps cho trang Project Detail (/dashboard/project/[id]) ──
const projectSteps: Step[] = [
    {
        target: "body",
        content: (
            <div className="text-center">
                <div className="text-3xl mb-3">📁</div>
                <h2 className="text-lg font-bold mb-2">Explore Your Project</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    This is the project management page. Let's explore how to
                    navigate and use the AI tools here.
                </p>
            </div>
        ),
        placement: "center",
        skipBeacon: true,
    },
    // {
    //     target: '[data-tour="sidebar-overview"]',
    //     content: (
    //         <div>
    //             <h3 className="font-semibold mb-1">📋 Tổng quan dự án</h3>
    //             <p className="text-sm text-gray-600 dark:text-gray-300">
    //                 Xem thông tin tổng quan, tiến độ, và thống kê nhanh về dự án tại đây.
    //             </p>
    //         </div>
    //     ),
    //     placement: 'right',
    //     disableBeacon: true,
    // },
    {
        target: '[data-tour="project-header"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📌 Project Title</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    This is where the project name and a brief description are
                    displayed.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
    {
        target: '[data-tour="project-progress"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📈 Project Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Track how many documents you've created out of the total
                    number of documents supported by the system.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
    {
        target: '[data-tour="project-info"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">ℹ️ Project Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Basic information about the client, domain, project type,
                    and creation date.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
    {
        target: '[data-tour="project-stats"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📊 Document Statistics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    The number of documents created in each phase (Planning,
                    Analysis, Design).
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
    {
        target: '[data-tour="project-recent-activity"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">🕒 Recent Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    A list of documents you've recently interacted with or
                    updated.
                </p>
            </div>
        ),
        placement: "top",
        skipBeacon: true,
    },
    {
        target: '[data-tour="sidebar"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">Sidebar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    This is the main navigation area for your project. You can
                    access different sections like Overview, Files, and Phases
                    (Planning, Analysis, Design) here.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
];

const fileManagerSteps: Step[] = [
    {
        target: "body",
        content: (
            <div className="text-center">
                <h3 className="font-semibold mb-1">📂 File Manager</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Upload, create folders, and manage all project-related
                    documents here.
                </p>
            </div>
        ),
        placement: "center",
        skipBeacon: true,
    },
    {
        target: '[data-tour="create-folder"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📁 Create Folder</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Easily create new folders to organize your project files.
                </p>
            </div>
        ),
        placement: "bottom",
        skipBeacon: true,
    },
];

// ─── localStorage Keys ─────────────────────────────────────────────────
const ONBOARDING_DASHBOARD_KEY = "hasCompletedOnboarding_dashboard";
const ONBOARDING_PROJECT_KEY = "hasCompletedOnboarding_project";
const ONBOARDING_FILE_MANAGER_KEY = "hasCompletedOnboarding_fileManager";

export default function OnboardingTour() {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        // Delay nhẹ để chờ DOM render hoàn toàn trước khi khởi chạy tour
        const timer = setTimeout(async () => {
            try {
                const user = await getUserInfo();
                if (pathname === "/dashboard") {
                    const hasCompleted = user.onboard_dashboard;
                    if (!hasCompleted) {
                        setSteps(dashboardSteps);
                        setStepIndex(0);
                        setRun(true);
                    }
                } else if (pathname?.match(/^\/dashboard\/project\/[^/]+$/)) {
                    // Chỉ kích hoạt trên trang Project Overview (không phải sub-routes như /workflows)
                    const hasCompleted = user.onboard_project;
                    if (!hasCompleted) {
                        setSteps(projectSteps);
                        setStepIndex(0);
                        setRun(true);
                    }
                } else if (
                    pathname?.match(/^\/dashboard\/project\/[^/]+\/files$/)
                ) {
                    const hasCompleted = user.onboard_file;
                    if (!hasCompleted) {
                        setSteps(fileManagerSteps);
                        setStepIndex(0);
                        setRun(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user info for onboarding:", error);
            }
        }, 500);

        return () => clearTimeout(timer); 
    }, [pathname]);

    useEffect(() => {
        if (!run || steps.length === 0) return;

        const currentStep = steps[stepIndex];

        // 1. CHỐT CHẶN AN TOÀN: Tránh lỗi undefined khi stepIndex out of bounds
        if (!currentStep) return;

        if (currentStep.target === "body") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // 2. DÙNG setTimeout ĐỂ CHỜ UI RENDER
        // Bọc logic tìm element vào một setTimeout nhỏ để đảm bảo
        // ô nhập liệu (input) của bạn đã được React vẽ xong trên UI
        const timer = setTimeout(() => {
            const targetElement = document.querySelector(
                currentStep.target as string,
            );

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                });

                if (currentStep.data?.waitOnTargetClick) {
                    const handleTargetClick = () => {
                        // Khi người dùng click nút "Create Folder"
                        // Delay 200ms trước khi chuyển step để UI kịp hiển thị ô input mới
                        setTimeout(() => {
                            setStepIndex((prev) => prev + 1);
                        }, 200);
                    };

                    targetElement.addEventListener("click", handleTargetClick);

                    return () => {
                        targetElement.removeEventListener(
                            "click",
                            handleTargetClick,
                        );
                    };
                }
            }
        }, 100); // 100ms chờ DOM ổn định trước khi Joyride tìm thẻ

        return () => clearTimeout(timer);
    }, [stepIndex, run, steps]);

    const handleJoyrideCallback = useCallback(
        (data: EventData) => {
            const { status, action, index, type } = data;
            const finishedStatuses: string[] = [
                STATUS.FINISHED,
                STATUS.SKIPPED,
            ];

            // Cập nhật stepIndex khi chuyển step
            if (
                type === EVENTS.STEP_AFTER ||
                type === EVENTS.TARGET_NOT_FOUND
            ) {
                setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
            }

            if (finishedStatuses.includes(status)) {
                setRun(false);
                // Lưu trạng thái hoàn thành vào API theo từng tour
                const updateOnboardingStatus = async () => {
                    try {
                        if (pathname === "/dashboard") {
                            await updateUserInfo({ onboard_dashboard: true });
                        } else if (pathname?.match(/^\/dashboard\/project\/[^/]+$/)) {
                            await updateUserInfo({ onboard_project: true });
                        } else if (
                            pathname?.match(/^\/dashboard\/project\/[^/]+\/files$/)
                        ) {
                            await updateUserInfo({ onboard_file: true });
                        }
                    } catch (error) {
                        console.error("Failed to update onboarding status:", error);
                    }
                };
                updateOnboardingStatus();
            }
        },
        [pathname],
    );

    if (!run || steps.length === 0) return null;

    return (
        <Joyride
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous
            options={{
                primaryColor: "#2563eb",
                zIndex: 10000,
                arrowColor: "#fff",
                backgroundColor: "#fff",
                textColor: "#1f2937",
                overlayColor: "rgba(0, 0, 0, 0.5)",
                overlayClickAction: false,
                spotlightRadius: 12,
                showProgress: true,
                buttons: ["back", "close", "primary", "skip"],
            }}
            tooltipComponent={ShadcnTooltip}
            onEvent={handleJoyrideCallback}
            locale={{
                back: "Quay lại",
                close: "Đóng",
                last: "Hoàn thành",
                next: "Tiếp theo",
                skip: "Bỏ qua",
            }}
            styles={{
                tooltip: {
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                },
                tooltipContent: {
                    padding: "8px 0",
                },
                buttonPrimary: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                },
                buttonBack: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "#6b7280",
                },
                buttonSkip: {
                    fontSize: "13px",
                    color: "#9ca3af",
                },
            }}
        />
    );
}
