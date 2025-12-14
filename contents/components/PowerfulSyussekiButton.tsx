import React, { useState } from "react";

import type { PowerfulSyussekiButtonProps } from "../types/PowerfulSyusseki";

const PowerfulSyussekiButton: React.FC<PowerfulSyussekiButtonProps> = ({ onButtonClick }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [detectMash, setDetectMash] = useState(false);

    const handleClick = () => {
        if (detectMash) return;

        setDetectMash(true);
        setIsLoading(true);

        onButtonClick();

        setTimeout(() => {
            setDetectMash(false);
            setIsLoading(false);
        }, 3000);
    };

    return (
        <div
            id="psc-display"
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <button className="psc-btn" onClick={handleClick}>
                <span className="psc-btn-lg">
                    <span className="psc-btn-sl"></span>
                    <span className="psc-btn-text">
                        {isLoading ? "取得が完了しました！" : "出席ウィンドウの強制取得"}
                    </span>
                </span>
            </button>
        </div>
    );
};

export default PowerfulSyussekiButton;
