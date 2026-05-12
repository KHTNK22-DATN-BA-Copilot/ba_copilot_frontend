'use client';

import { useState, useEffect, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from 'react-joyride';
import { usePathname } from 'next/navigation';

// ─── Onboarding Steps cho trang Dashboard (/dashboard) ─────────────────
const dashboardSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div className="text-center">
                <div className="text-3xl mb-3">🎉</div>
                <h2 className="text-lg font-bold mb-2">Chào mừng đến với BA Copilot!</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    BA Copilot giúp bạn tự động hóa quy trình phân tích nghiệp vụ với sự hỗ trợ của AI.
                    Hãy cùng khám phá các tính năng chính nhé!
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,

    },
    {
        target: '[data-tour="search-bar"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">🔍 Tìm kiếm nhanh</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Sử dụng thanh tìm kiếm hoặc phím tắt <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+K</kbd> để
                    tìm dự án, tài liệu, hoặc người dùng nhanh chóng.
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
    {
        target: '[data-tour="overview-section"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📊 Tổng quan dự án</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Đây là bảng tổng quan giúp bạn theo dõi tổng số dự án và các thống kê quan trọng.
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
    {
        target: '[data-tour="create-project"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">➕ Tạo dự án mới</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Nhấn vào đây để tạo dự án BA đầu tiên. Mỗi dự án sẽ chứa toàn bộ tài liệu
                    Planning, Analysis và Design của bạn.
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
];

// ─── Onboarding Steps cho trang Project Detail (/dashboard/project/[id]) ──
const projectSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div className="text-center">
                <div className="text-3xl mb-3">📁</div>
                <h2 className="text-lg font-bold mb-2">Khám phá dự án của bạn</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Đây là trang quản lý dự án. Hãy cùng tìm hiểu cách điều hướng
                    và sử dụng các công cụ AI tại đây.
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,

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
                <h3 className="font-semibold mb-1">📌 Tiêu đề dự án</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Nơi hiển thị tên và mô tả ngắn gọn về dự án hiện tại của bạn.
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
    {
        target: '[data-tour="project-progress"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📈 Tiến độ tổng quan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Theo dõi xem bạn đã tạo được bao nhiêu tài liệu trên tổng số tài liệu mà hệ thống hỗ trợ.
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
    {
        target: '[data-tour="project-info"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">ℹ️ Thông tin chi tiết</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Các thông tin cơ bản về khách hàng, domain, loại dự án và thời gian khởi tạo.
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
    {
        target: '[data-tour="project-stats"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">📊 Thống kê tài liệu</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Số lượng tài liệu đã được tạo trong từng giai đoạn (Planning, Analysis, Design).
                </p>
            </div>
        ),
        placement: 'bottom',
        disableBeacon: true,

    },
    {
        target: '[data-tour="project-recent-activity"]',
        content: (
            <div>
                <h3 className="font-semibold mb-1">🕒 Hoạt động gần đây</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Danh sách các tài liệu bạn vừa thao tác hoặc cập nhật gần đây nhất.
                </p>
            </div>
        ),
        placement: 'top',
        disableBeacon: true,

    },
    // {
    //     target: '[data-tour="sidebar-workflow"]',
    //     content: (
    //         <div>
    //             <h3 className="font-semibold mb-1">⚡ Project Workflow</h3>
    //             <p className="text-sm text-gray-600 dark:text-gray-300">
    //                 Đây là tính năng cốt lõi! Workflow giúp bạn tạo toàn bộ tài liệu BA
    //                 một cách tự động qua quy trình hướng dẫn từng bước.
    //             </p>
    //         </div>
    //     ),
    //     placement: 'right',
    //     disableBeacon: true,
    // },
    // {
    //     target: '[data-tour="sidebar-files"]',
    //     content: (
    //         <div>
    //             <h3 className="font-semibold mb-1">📂 Quản lý tệp</h3>
    //             <p className="text-sm text-gray-600 dark:text-gray-300">
    //                 Upload, tạo thư mục và quản lý tất cả tệp tài liệu liên quan đến dự án.
    //             </p>
    //         </div>
    //     ),
    //     placement: 'right',
    //     disableBeacon: true,
    // },
    // {
    //     target: '[data-tour="sidebar-phases"]',
    //     content: (
    //         <div>
    //             <h3 className="font-semibold mb-1">🔄 Phases (Planning / Analysis / Design)</h3>
    //             <p className="text-sm text-gray-600 dark:text-gray-300">
    //                 Tạo tài liệu theo từng giai đoạn riêng biệt: Planning → Analysis → Design.
    //                 Mỗi phase chứa các loại tài liệu chuyên biệt do AI sinh ra.
    //             </p>
    //         </div>
    //     ),
    //     placement: 'right',
    //     disableBeacon: true,
    // },
];

// ─── localStorage Keys ─────────────────────────────────────────────────
const ONBOARDING_DASHBOARD_KEY = 'hasCompletedOnboarding_dashboard';
const ONBOARDING_PROJECT_KEY = 'hasCompletedOnboarding_project';

export default function OnboardingTour() {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        // Delay nhẹ để chờ DOM render hoàn toàn trước khi khởi chạy tour
        const timer = setTimeout(() => {
            if (pathname === '/dashboard') {
                const hasCompleted = localStorage.getItem(ONBOARDING_DASHBOARD_KEY);
                if (hasCompleted !== 'true') {
                    setSteps(dashboardSteps);
                    setStepIndex(0);
                    setRun(true);
                }
            } else if (pathname?.match(/^\/dashboard\/project\/[^/]+$/)) {
                // Chỉ kích hoạt trên trang Project Overview (không phải sub-routes như /workflows)
                const hasCompleted = localStorage.getItem(ONBOARDING_PROJECT_KEY);
                if (hasCompleted !== 'true') {
                    setSteps(projectSteps);
                    setStepIndex(0);
                    setRun(true);
                }
            } else {
                setRun(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [pathname]);


    const handleJoyrideCallback = useCallback((data: CallBackProps) => {
        const { status, action, index, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        // Cập nhật stepIndex khi chuyển step
        if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
        }

        if (finishedStatuses.includes(status)) {
            setRun(false);
            // Lưu trạng thái hoàn thành vào localStorage theo từng tour
            if (pathname === '/dashboard') {
                localStorage.setItem(ONBOARDING_DASHBOARD_KEY, 'true');
            } else if (pathname?.includes('/dashboard/project/')) {
                localStorage.setItem(ONBOARDING_PROJECT_KEY, 'true');
            }
        }
    }, [pathname]);

    if (!run || steps.length === 0) return null;

    return (
        <Joyride
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous
            showProgress
            showSkipButton
            disableOverlayClose
            callback={handleJoyrideCallback}
            locale={{
                back: 'Quay lại',
                close: 'Đóng',
                last: 'Hoàn thành',
                next: 'Tiếp theo',
                skip: 'Bỏ qua',
            }}
            styles={{
                options: {
                    primaryColor: '#2563eb',
                    zIndex: 10000,
                    arrowColor: '#fff',
                    backgroundColor: '#fff',
                    textColor: '#1f2937',
                    overlayColor: 'rgba(0, 0, 0, 0.5)',
                },
                tooltip: {
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                },
                tooltipContent: {
                    padding: '8px 0',
                },
                buttonNext: {
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                },
                buttonBack: {
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#6b7280',
                },
                buttonSkip: {
                    fontSize: '13px',
                    color: '#9ca3af',
                },
                spotlight: {
                    borderRadius: '12px',
                },
            }}
        />
    );
}
