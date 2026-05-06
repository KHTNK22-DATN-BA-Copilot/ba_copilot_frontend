import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Lớp Analytics đóng vai trò như một wrapper thống nhất để gọi tracking events.
 * Quy tắc: <action>_<object>
 */
export class Analytics {
  static trackEvent(action: string, object: string, params?: Record<string, any>) {
    if (!analytics) return;

    const eventName = `${action}_${object}`;

    try {
      firebaseLogEvent(analytics, eventName, params);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics Event] ${eventName}:`, params);
      }
    } catch (error) {
      console.error(`[Analytics Error] Failed to track ${eventName}:`, error);
    }
  }

  // ======================
  // QUIZ
  // ======================

  static startQuiz(
    quizId: string,
    params?: { difficulty?: 'easy' | 'medium' | 'hard'; topic?: string;[key: string]: any }
  ) {
    this.trackEvent('start', 'quiz', {
      quiz_id: quizId,
      ...params,
    });
  }

  static completeQuiz(
    quizId: string,
    params?: { score: number; time_spent_seconds?: number;[key: string]: any }
  ) {
    this.trackEvent('complete', 'quiz', {
      quiz_id: quizId,
      ...params,
    });
  }

  // ======================
  // UI
  // ======================

  static clickButton(
    buttonName: string,
    params?: { location?: string;[key: string]: any }
  ) {
    this.trackEvent('click', 'button', {
      button_name: buttonName,
      ...params,
    });
  }

  static viewPage(
    pageName: string,
    params?: { source?: string;[key: string]: any }
  ) {
    this.trackEvent('view', 'page', {
      page_name: pageName,
      ...params,
    });
  } // ✅ FIX: đóng function ở đây

  static toggleTheme(mode: 'dark' | 'light') {
    this.trackEvent('toggle', 'theme', { mode });
  }

  // ======================
  // PROJECT
  // ======================

  static clickCreateProject() {
    this.trackEvent('click', 'create_project_button');
  }

  static viewProject(projectId: number) {
    this.trackEvent('view', 'project', { project_id: projectId });
  }

  static filterProjects(filterName: string) {
    this.trackEvent('filter', 'projects', { filter_name: filterName });
  }

  static deleteProject(
    projectId: number,
    status: 'success' | 'error',
    errorMessage?: string
  ) {
    this.trackEvent('delete', 'project', {
      project_id: projectId,
      status,
      error_message: errorMessage,
    });
  }

  // ======================
  // USER
  // ======================

  static clickAccountSettings() {
    this.trackEvent('click', 'account_settings');
  }

  static logout() {
    this.trackEvent('logout', 'user');
  }

  // ======================
  // FILES & FOLDERS
  // ======================

  static uploadFile(projectId: string, filesCount: number) {
    this.trackEvent('upload', 'file', { project_id: projectId, count: filesCount });
  }

  static deleteFile(fileId: string | number) {
    this.trackEvent('delete', 'file', { file_id: fileId });
  }

  static downloadFile(fileId: string | number) {
    this.trackEvent('download', 'file', { file_id: fileId });
  }

  static createFolder(projectId: string, folderName: string) {
    this.trackEvent('create', 'folder', { project_id: projectId, folder_name: folderName });
  }

  static deleteFolder(folderId: number) {
    this.trackEvent('delete', 'folder', { folder_id: folderId });
  }

  static renameFolder(folderId: number) {
    this.trackEvent('rename', 'folder', { folder_id: folderId });
  }

  // ======================
  // WORKFLOWS
  // ======================

  static startWorkflow(projectId: string) {
    this.trackEvent('start', 'workflow', { project_id: projectId });
  }

  static completeWorkflow(projectId: string) {
    this.trackEvent('complete', 'workflow', { project_id: projectId });
  }

  static restartWorkflow(projectId: string) {
    this.trackEvent('restart', 'workflow', { project_id: projectId });
  }

  static workflowStep(projectId: string, stepName: string, action: 'next' | 'back') {
    this.trackEvent(action, 'workflow_step', { project_id: projectId, step_name: stepName });
  }

  static generateArtifact(projectId: string, artifactType: 'diagrams' | 'srs' | 'wireframes') {
    this.trackEvent('generate', 'artifact', { project_id: projectId, artifact_type: artifactType });
  }
}