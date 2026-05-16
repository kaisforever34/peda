# Technical Analysis: UI Button Failures & Resolution Plan

## 1. Executive Summary
A comprehensive audit of the PEDA Teacher Portal has identified several critical user interface elements (Buttons) that are currently "unresponsive." These failures fall into two categories:
1.  **Missing Event Handlers:** Buttons without `onClick` props or `Link` wrappers.
2.  **Silent Failures:** Buttons that trigger server actions but do not provide user feedback (Toasts) or handle errors.

## 2. Identified Failures & Technical Analysis

### A. Course Management (Teacher Portal)
-   **Component:** `src/app/teacher/courses/page.tsx`
-   **Affected Buttons:** "Edit," "Delete," and "Publish" buttons for individual course cards.
-   **Current Behavior:** Clicking the buttons does nothing. The browser does not navigate or trigger any state change.
-   **Expected Behavior:** 
    -   **Edit:** Navigate to the course editor.
    -   **Delete:** Show a confirmation dialog and trigger a `deleteCourse` server action.
    -   **Publish:** Update the course status from `DRAFT` to `PUBLISHED`.
-   **Underlying Issue:** The buttons are rendered as raw UI components without any associated logic or routing.

### B. Classroom Management (Teacher Portal)
-   **Component:** `src/app/teacher/classes/page.tsx`
-   **Affected Buttons:** "Edit" and "Archive" icons.
-   **Current Behavior:** Icons are visible but inactive.
-   **Expected Behavior:** Open a settings/edit dialog for the classroom.
-   **Underlying Issue:** Placeholder buttons from the initial UI design were never linked to functional actions.

### C. Submission Review (Teacher Portal)
-   **Component:** `src/app/teacher/submissions/page.tsx`
-   **Affected Button:** "Review Work"
-   **Current Behavior:** Button is clickable but has no destination.
-   **Expected Behavior:** Open the detailed submission view or audio playback for voice sessions.
-   **Underlying Issue:** Missing `Link` to the specific submission ID.

### D. Empty State CTA (Dashboard)
-   **Component:** `src/app/teacher/dashboard/dashboard-client.tsx`
-   **Affected Button:** "Create First Class"
-   **Current Behavior:** (Fixed) Previously a raw button, now correctly linked.

---

## 3. Systematic Debugging Plan

To restore full functionality across the platform, we will follow these steps:

1.  **Logic Mapping:** Define the specific server action or route for every button in the `Teacher` namespace.
2.  **Action Implementation:** Create missing server actions in `@/app/actions/` (e.g., `deleteCourse`, `updateCourseStatus`, `deleteClassroom`).
3.  **UI Linking:**
    *   Wrap navigational buttons in Next.js `<Link>` components.
    *   Attach `onClick` handlers with `useTransition` to action-based buttons.
4.  **Feedback Integration:** Add `sonner` toasts to all action-based buttons to ensure the user is notified of success or failure.
5.  **Validation pass:** Use the `grep` tool to ensure no `<Button>` remains in the `src/app` directory without either a `type="submit"`, `onClick`, or parent `<Link>`.

## 4. Proposed Fixes (Phase 1)
-   Refactor `teacher/courses/page.tsx` to include `delete` and `publish` actions.
-   Update `teacher/submissions/page.tsx` to link "Review Work" to the submission detail view.
-   Implement a generic `DeleteConfirmDialog` component to prevent accidental data loss.
