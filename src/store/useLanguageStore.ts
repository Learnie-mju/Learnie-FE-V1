import { create } from "zustand";

export type Language = "ko" | "en" | "zh" | "ja";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguage = create<LanguageState>((set) => ({
  language: "ko",
  setLanguage: (lang) => set({ language: lang }),
}));

// 언어별 텍스트 정의
export const translations = {
  ko: {
    intro: [
      "1단계 : 알아듣지 못하는 강의를 업로드하세요",
      "2단계 : 모국어로 번역된 수업 요약본을 보고 학습",
      "3단계 : 생성된 문제를 보고 학습해보세요",
      "4단계 : 해당 수업의 심화를 다룬 내용들도 학습해주세요",
      "LectureLens와 함께 학습을 해볼까요?",
    ],
    title: "LectureLen",
    signup: {
      title: "LectureLens 시작하기",
      name: "이름",
      namePlaceholder: "이름을 입력하세요",
      email: "이메일",
      emailPlaceholder: "이메일을 입력하세요",
      password: "비밀번호",
      passwordPlaceholder: "비밀번호를 입력하세요",
      confirmPassword: "비밀번호 확인",
      confirmPasswordPlaceholder: "비밀번호를 다시 입력하세요",
      signupButton: "회원가입",
      signupLoading: "가입 중...",
      loginLink: "이미 계정이 있으신가요?",
      loginButton: "로그인",
      errors: {
        allFieldsRequired: "모든 필드를 입력해주세요",
        passwordMismatch: "비밀번호가 일치하지 않습니다",
        passwordTooShort: "비밀번호는 8자 이상이어야 합니다",
        signupFailed: "회원가입에 실패했습니다",
      },
    },
    home: {
      greeting: "안녕하세요!",
      welcomeMessage: "홍길동 교수님을 도와드릴 AI Tutor예요",
      homeTitle: "홈",
      uploadFile: "파일 업로드",
      emptyState: {
        title: "강의 영상을 업로드해보세요",
        description:
          "파일을 드래그하거나 클릭하여 강의 영상을 업로드할 수 있어요!",
      },
      sidebar: {
        home: "홈",
        courses: "강의 과목",
        logout: "로그아웃",
      },
      content: {
        keywords: "키워드",
        quiz: "퀴즈",
        summary: "요약",
        number: "번호",
        back: "뒤로가기",
      },
      uploadModal: {
        fileInfo: "파일 정보",
        classTitle: "수업 제목 입력",
        cancel: "취소",
        confirm: "확인",
      },
    },
  },
  en: {
    intro: [
      "Step 1: Upload lectures you don't understand",
      "Step 2: Review and learn from the translated lecture summary in your native language",
      "Step 3: Review and learn from the generated problems",
      "Step 4: Also learn from the advanced content covering the in-depth aspects of the lecture",
      "Shall we learn together with LectureLens?",
    ],
    title: "LectureLen",
    signup: {
      title: "Get Started with LectureLens",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      signupButton: "Sign Up",
      signupLoading: "Signing up...",
      loginLink: "Already have an account?",
      loginButton: "Log In",
      errors: {
        allFieldsRequired: "Please fill in all fields",
        passwordMismatch: "Passwords do not match",
        passwordTooShort: "Password must be at least 8 characters",
        signupFailed: "Sign up failed",
      },
    },
    home: {
      greeting: "Hello!",
      welcomeMessage: "I am an AI Tutor to help Professor Hong Gil-dong",
      homeTitle: "Home",
      uploadFile: "Upload File",
      emptyState: {
        title: "Upload your lecture video",
        description:
          "Drag and drop files or click to upload your lecture video!",
      },
      sidebar: {
        home: "Home",
        courses: "Course Subjects",
        logout: "Logout",
      },
      content: {
        keywords: "Keywords",
        quiz: "Quiz",
        summary: "Summary",
        number: "Number",
        back: "Back",
      },
      uploadModal: {
        fileInfo: "File Information",
        classTitle: "Enter Class Title",
        cancel: "Cancel",
        confirm: "Confirm",
      },
    },
  },
  zh: {
    intro: [
      "第1步：上传您听不懂的讲座",
      "第2步：查看并学习用您的母语翻译的课程摘要",
      "第3步：查看并学习生成的问题",
      "第4步：也请学习涵盖该课程深入内容的进阶内容",
      "让我们一起与LectureLens一起学习吧？",
    ],
    title: "LectureLen",
    signup: {
      title: "开始使用LectureLens",
      name: "姓名",
      namePlaceholder: "请输入您的姓名",
      email: "电子邮件",
      emailPlaceholder: "请输入您的电子邮件",
      password: "密码",
      passwordPlaceholder: "请输入您的密码",
      confirmPassword: "确认密码",
      confirmPasswordPlaceholder: "请再次输入您的密码",
      signupButton: "注册",
      signupLoading: "注册中...",
      loginLink: "已有账户？",
      loginButton: "登录",
      errors: {
        allFieldsRequired: "请填写所有字段",
        passwordMismatch: "密码不匹配",
        passwordTooShort: "密码必须至少8个字符",
        signupFailed: "注册失败",
      },
    },
    home: {
      greeting: "你好！",
      welcomeMessage: "我是帮助洪吉童教授的AI Tutor",
      homeTitle: "首页",
      uploadFile: "上传文件",
      emptyState: {
        title: "上传您的讲座视频",
        description: "拖放文件或点击上传您的讲座视频！",
      },
      sidebar: {
        home: "首页",
        courses: "课程科目",
        logout: "登出",
      },
      content: {
        keywords: "关键词",
        quiz: "测验",
        summary: "摘要",
        number: "编号",
        back: "返回",
      },
      uploadModal: {
        fileInfo: "文件信息",
        classTitle: "输入课程标题",
        cancel: "取消",
        confirm: "确认",
      },
    },
  },
  ja: {
    intro: [
      "ステップ1：理解できない講義をアップロードしてください",
      "ステップ2：母国語に翻訳された授業の要約を見て学習してください",
      "ステップ3：生成された問題を見て学習してください",
      "ステップ4：その授業の深化を扱った内容も学習してください",
      "LectureLensと一緒に学習してみませんか？",
    ],
    title: "LectureLen",
    signup: {
      title: "LectureLensを始める",
      name: "名前",
      namePlaceholder: "お名前を入力してください",
      email: "メールアドレス",
      emailPlaceholder: "メールアドレスを入力してください",
      password: "パスワード",
      passwordPlaceholder: "パスワードを入力してください",
      confirmPassword: "パスワード確認",
      confirmPasswordPlaceholder: "パスワードを再度入力してください",
      signupButton: "会員登録",
      signupLoading: "登録中...",
      loginLink: "すでにアカウントをお持ちですか？",
      loginButton: "ログイン",
      errors: {
        allFieldsRequired: "すべてのフィールドを入力してください",
        passwordMismatch: "パスワードが一致しません",
        passwordTooShort: "パスワードは8文字以上である必要があります",
        signupFailed: "会員登録に失敗しました",
      },
    },
    home: {
      greeting: "こんにちは！",
      welcomeMessage: "洪吉童教授をお手伝いするAI Tutorです",
      homeTitle: "ホーム",
      uploadFile: "ファイルをアップロード",
      emptyState: {
        title: "講義動画をアップロードしてください",
        description:
          "ファイルをドラッグ＆ドロップするか、クリックして講義動画をアップロードできます！",
      },
      sidebar: {
        home: "ホーム",
        courses: "講義科目",
        logout: "ログアウト",
      },
      content: {
        keywords: "キーワード",
        quiz: "クイズ",
        summary: "要約",
        number: "番号",
        back: "戻る",
      },
      uploadModal: {
        fileInfo: "ファイル情報",
        classTitle: "授業タイトル入力",
        cancel: "キャンセル",
        confirm: "確認",
      },
    },
  },
};
