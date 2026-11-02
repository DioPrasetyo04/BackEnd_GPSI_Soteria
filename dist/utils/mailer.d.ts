export declare const transporter: import("nodemailer/lib/mailer").default<import("nodemailer/lib/smtp-transport").SMTPSentMessageInfo, import("nodemailer/lib/smtp-transport").SMTPTransportOptions>;
export interface ApprovalEmailPayload {
    adminEmails: string[];
    applicant: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt?: Date;
    };
    approvalToken: string;
}
export declare function sendAdminApprovalNotification({ adminEmails, applicant, approvalToken, }: ApprovalEmailPayload): Promise<boolean>;
//# sourceMappingURL=mailer.d.ts.map