# Tài liệu Hướng dẫn Triển khai Chức năng Onboarding (BA Copilot)

## 1. Tổng quan (High-level Overview)
Chức năng Onboarding (Hướng dẫn người dùng mới) đóng vai trò quan trọng trong việc giữ chân người dùng (user retention) và giúp họ làm quen với các tính năng phức tạp của BA Copilot. Vì dự án là một AI-powered Business Analysis assistant, có nhiều quy trình (Planning, Analysis, Design) và tính năng, việc hướng dẫn người dùng qua từng bước cơ bản sẽ giúp họ có trải nghiệm "Aha moment" sớm nhất.

## 2. Xác định các Key Features cần giới thiệu
Dựa trên kiến trúc và tính năng hiện tại của dự án, quá trình Onboarding nên tập trung vào các điểm sau:
1. **Welcome Message:** Chào mừng và giới thiệu ngắn gọn về BA Copilot.
2. **Tạo Dự án Mới (Create New Project):** Nơi bắt đầu mọi thứ. Điểm chạm đầu tiên tại `ProjectsSection` trên Dashboard.
3. **Thanh Điều hướng (Sidebar Navigation):** Giới thiệu cấu trúc quản lý dự án (Project Overview, Project Workflow, Files).
4. **Quy trình 3 Bước (3-Phase Workflow):** Nhấn mạnh vào Planning, Analysis, Design - tính năng cốt lõi tạo ra các tài liệu.
5. **AI Chat System / Streaming Generation:** Chức năng tương tác với AI để tạo/cập nhật tài liệu.

## 3. Luồng Người dùng (User Flow)
- **Điều kiện kích hoạt:** Người dùng mới đăng nhập lần đầu tiên sau khi xác thực email (có thể kiểm tra cờ `isFirstLogin` hoặc `hasCompletedOnboarding` từ User Profile của Backend, hoặc lưu tạm ở `localStorage`).
- **Flow:**
  1. **Hiển thị Modal Chào mừng:** Cung cấp tổng quan về công cụ và 2 lựa chọn: "Bắt đầu hướng dẫn" hoặc "Bỏ qua" (Skip).
  2. **Step 1:** Highlight nút **Create New** ở màn hình Dashboard (`/dashboard`).
  3. **Step 2:** Sau khi tạo dự án thành công và vào trang Chi tiết Dự án (`/dashboard/project/[id]`), tiếp tục highlight menu **Project Workflow** trên Sidebar.
  4. **Step 3:** Highlight các tab **Planning**, **Analysis**, **Design** trong phần Phases.
  5. **Hoàn thành:** Cập nhật trạng thái `hasCompletedOnboarding = true` qua API để không hiển thị lại ở lần đăng nhập sau.

## 4. Các vấn đề cần lưu ý (Considerations)
- **State Management:** Cần đồng bộ trạng thái onboarding lên backend để trải nghiệm đồng nhất trên nhiều thiết bị.
- **Trải nghiệm UX:** Không nên có quá 5 bước trong một flow để tránh làm người dùng khó chịu. Luôn có nút "Bỏ qua" (Skip/Dismiss) ở mọi bước.
- **Responsive:** Trên thiết bị di động (Mobile), giao diện thay đổi (ví dụ: Sidebar bị ẩn dưới dạng Hamburger menu), do đó luồng Onboarding trên Mobile cần được thiết kế riêng biệt hoặc đơn giản hóa so với Desktop.
- **Routing:** Vì BA Copilot sử dụng Next.js App Router, người dùng có thể chuyển trang trong lúc onboarding, thư viện onboarding phải hỗ trợ đa trang (multi-page tour) hoặc ta chia tour ra theo từng trang.

---

## 5. Hướng dẫn Triển khai (Low-level Implementation)

Để thực hiện hiệu quả, khuyến nghị sử dụng thư viện **`react-joyride`** vì nó hỗ trợ tốt React/Next.js, dễ dàng tùy chỉnh UI bằng Tailwind CSS và hỗ trợ luồng đa trang.

### Bước 1: Cài đặt thư viện
Chạy lệnh sau tại thư mục root của frontend:
```bash
npm install react-joyride
npm install -D @types/react-joyride
```

### Bước 2: Chuẩn bị định danh (Data Attributes) trên các UI hiện tại
Chúng ta cần thêm các thuộc tính `data-tour` vào các thẻ HTML mà Joyride sẽ highlight.

**1. Trên màn hình Dashboard (`app/dashboard/_components/ProjectsSection.tsx`):**
Tìm nút "Create New Project" và thêm `data-tour="create-project"`
```tsx
<Link
    data-tour="create-project"
    className="bg-gradient-to-br from-blue-50..."
    href="/new-project"
>
    {/* ... */}
</Link>
```

**2. Trên màn hình Sidebar (`components/layout/Sidebar.tsx`):**
Thêm định danh cho Workflow và Phases.
```tsx
// Trong hàm render menu items
<button
    key={item.id}
    data-tour={item.id === 'workflow' ? "project-workflow" : undefined}
    className={cn(...)}
>
```

### Bước 3: Định nghĩa các bước Onboarding (Steps)
Tạo một file mới `components/ui/OnboardingTour.tsx`. Đây sẽ là Client Component chạy Tour.

```tsx
'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { usePathname } from 'next/navigation';

// Định nghĩa các bước cho Dashboard
const dashboardSteps: Step[] = [
  {
    target: 'body',
    content: 'Chào mừng bạn đến với BA Copilot! Hãy cùng làm quen với các tính năng cơ bản nhé.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-project"]',
    content: 'Bắt đầu bằng cách tạo một dự án mới. Mọi tài liệu và thiết kế của bạn sẽ nằm trong dự án này.',
    placement: 'bottom',
  }
];

// Định nghĩa các bước cho màn hình Project Details
const projectSteps: Step[] = [
  {
    target: '[data-tour="project-workflow"]',
    content: 'Đây là quy trình làm việc (Workflow). Bạn sẽ thực hiện qua 3 bước: Planning, Analysis, và Design tại đây.',
    placement: 'right',
  }
];

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Logic kiểm tra xem người dùng đã hoàn thành onboarding chưa
    // Tạm thời dùng localStorage, thực tế nên gọi API lấy từ User Profile
    const hasCompleted = localStorage.getItem('onboardingCompleted');
    
    if (!hasCompleted) {
      if (pathname === '/dashboard') {
        setSteps(dashboardSteps);
        setRun(true);
      } else if (pathname?.includes('/dashboard/project/')) {
        setSteps(projectSteps);
        setRun(true);
      }
    }
  }, [pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Khi tour kết thúc, lưu lại trạng thái
      localStorage.setItem('onboardingCompleted', 'true');
      // TODO: Gọi API cập nhật trạng thái user: updateUserInfo({ hasCompletedOnboarding: true })
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb', // Màu xanh Tailwind (blue-600)
          zIndex: 10000,
        },
      }}
    />
  );
}
```

### Bước 4: Tích hợp Component vào Root Layout hoặc Dashboard Layout
Để OnboardingTour hoạt động, hãy đưa nó vào `app/dashboard/layout.tsx`. Do `layout.tsx` bọc toàn bộ dashboard, Tour sẽ luôn luôn mount và theo dõi `pathname`.

```tsx
// app/dashboard/layout.tsx
// ... imports
import OnboardingTour from '@/components/ui/OnboardingTour';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ...
    return (
        <div className="...">
            <OnboardingTour /> {/* <--- THÊM VÀO ĐÂY */}
            <Header />
            {/* ... */}
        </div>
    );
}
```

### Bước 5: Cập nhật Trạng thái User (Backend Integration)
Việc sử dụng `localStorage` có rủi ro nếu người dùng đổi trình duyệt, họ sẽ phải xem lại Tour. Để giải quyết, hãy mở rộng Backend.
1. **Trong Database:** Thêm trường `hasCompletedOnboarding: boolean` (mặc định: `false`) vào bảng User.
2. **Trong API Get User Info:** Trả về trường này.
3. **Trong `actions/user.action.ts`:** Sử dụng hàm `updateUserInfo` để gọi lên backend cập nhật.

Cập nhật `OnboardingTour.tsx` để sử dụng Backend Data:
```tsx
import { useEffect, useState } from 'react';
import { getUserInfo, updateUserInfo } from '@/actions/user.action';

// Trong useEffect
useEffect(() => {
    async function checkOnboarding() {
        const userInfoRes = await getUserInfo();
        // Giả sử API trả về data có cấu trúc chứa thông tin user
        if (userInfoRes?.data && userInfoRes.data.hasCompletedOnboarding === false) {
            setRun(true);
        }
    }
    checkOnboarding();
}, []);

// Trong handleJoyrideCallback
if (finishedStatuses.includes(status)) {
    setRun(false);
    updateUserInfo({ hasCompletedOnboarding: true }); // Action Next.js gọi lên API
}
```

## Tổng kết các Checklist Cần Làm
- [ ] Bổ sung trường `hasCompletedOnboarding` vào Backend User entity (nhờ team Backend).
- [ ] Cài đặt `react-joyride` vào Frontend.
- [ ] Tạo Component `OnboardingTour` (tái sử dụng linh hoạt với Context nếu cần).
- [ ] Gắn các `data-tour` attribute vào các UI Elements cần làm nổi bật.
- [ ] Tích hợp API qua Server Actions (`user.action.ts`) để lưu vết hoàn tất onboarding.
- [ ] Test luồng Onboarding từ lúc Đăng ký -> Đăng nhập lần đầu -> Đi qua các bước.
