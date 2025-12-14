export interface AuthHeaderProps {
    title: string;
    comment: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, comment }) => {
    return (
        <div className="m-0 flex w-full flex-col items-center justify-center gap-[12px] p-0">
            <h2 className="text-primary text-center text-[28px] font-bold">PassPal</h2>
            <p className="text-neutral-black text-center text-[18px] font-semibold">{title}</p>
            <p className="text-center text-[14px] font-normal text-[#6B7280]">{comment}</p>
        </div>
    );
};

export default AuthHeader;
