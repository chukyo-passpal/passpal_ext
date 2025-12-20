/**
 * アプリケーション全体で使用するURLを一元管理
 */

// ============================================
// PassPal公式サイト関連
// ============================================
export const PASSPAL_URLS = {
    /** フィードバックフォーム */
    feedback: "https://chukyo-passpal.app/feedback",
    /** お問い合わせフォーム */
    contact: "https://chukyo-passpal.app/contact",
    /** 利用規約 */
    terms: "https://chukyo-passpal.app/term",
    /** プライバシーポリシー */
    privacy: "https://chukyo-passpal.app/policy",
} as const;

// ============================================
// PassPalバックエンド関連
// ============================================
export const PALAPI_URLS = {
    /** ベースURL */
    base: "https://api.chukyo-passpal.app",
} as const;

// ============================================
// ChukyoLinkバックエンド関連
// ============================================
export const ChukyoLink_URLS = {
    /** ベースURL */
    base: "https://link.lanet.sist.chukyo-u.ac.jp",
} as const;

// ============================================
// 中京大学サービス関連
// ============================================

/** CUBICS（授業支援システム）関連URL */
export const CUBICS_URLS = {
    /** ベースURL */
    base: "https://cubics-as-out.mng.chukyo-u.ac.jp",
} as const;

/** Albo（ポータルサイト）関連URL */
export const ALBO_URLS = {
    /** ベースURL */
    base: "https://cubics-pt-out.mng.chukyo-u.ac.jp",
    /** ログインURL */
    login: "https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/UnLoginControl",
} as const;

/** MaNaBo（学習管理システム）関連URL */
export const MANABO_URLS = {
    /** ベースURL */
    base: "https://manabo.cnc.chukyo-u.ac.jp",
    /** Shibboleth認証URL */
    auth: "https://manabo.cnc.chukyo-u.ac.jp/auth/shibboleth/",
    /**
     * 授業ページURLを生成
     * @param classId - 授業ID
     * @returns 授業ページのURL
     */
    class: (classId: string) => `https://manabo.cnc.chukyo-u.ac.jp/class/${classId}/`,
} as const;

/** Shibboleth（認証システム）関連URL */
export const SHIBBOLETH_URLS = {
    /** ログインフォームURL */
    loginForm: "https://shib.chukyo-u.ac.jp/cloudlink/module.php/core/loginuserpass.php",
} as const;

/** 中京大学のリンク集 */
export const CHUKYO_UNIVERSITY_LINKS = {
    /** m.mail */
    mMail: "https://mail.google.com/a/m.chukyo-u.ac.jp",
    /** 豊田キャンパスマップ */
    toyotaCampusMap: "https://www.chukyo-u.ac.jp/information/facility/g2.html",
    /** 名古屋キャンパスマップ */
    nagoyaCampusMap: "https://www.chukyo-u.ac.jp/information/facility/g1.html",
};

// ============================================
// URLヘルパー関数
// ============================================

/**
 * MaNaBoの授業ページURLを取得
 * @param classId - 授業ID
 * @returns MaNaBoの授業ページURL
 */
export const getManaboClassUrl = (classId: string): string => {
    return MANABO_URLS.class(classId);
};
