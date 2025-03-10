import React, {useContext} from "react";
import Modal from "react-modal"; // react-modal 사용
import { FaSignOutAlt, FaRegHeart, FaCogs, FaRegEnvelope } from "react-icons/fa"; // react-icons 사용
import { useTranslation } from "react-i18next";
import { logout } from "src/api/api";
import { HostModeContext } from "src/components/auth/HostModeContext";
import { useNavigate } from "react-router-dom"; // 웹에서는 react-router-dom 사용
import 'src/css/UserModal.css';
import { useIsHost } from "src/components/auth/IsHostContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

interface UserModalProps {
    visible: boolean;
    onClose: () => void;
}

export const UserModal = ({ visible, onClose }: UserModalProps) => {
    const { t } = useTranslation();
    const { hostMode, toggleUserMode, resetUserMode } = useContext(HostModeContext);
    const navigate = useNavigate();
    const { isHost } = useIsHost();

    const handleLogout = async () => {
        try {
            const response = await logout();
            console.log(response);
            resetUserMode();// hostMode 초기화
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const handleMessage = () => {
        console.log("메시지 메뉴");
        console.log("ishost값 :", isHost);
    };

    const handleFavorite = () => {
        console.log("찜 목록 메뉴");
    };

    const handleHostManage = () => {
        console.log("호스트 관리 메뉴");
        navigate("/host");
        onClose();
    };

    const handleSettings = () => {
        console.log("계정 설정 메뉴");
        console.log('유저 정보', localStorage.getItem('userName'));
    };

    const handleUserMode = () => {
        toggleUserMode();
    };

    const handleUserHostMode = async () => {
        if (isHost) {
            toggleUserMode();
        } else {
            navigate('/hostAgree');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={visible}
            onRequestClose={onClose}
            contentLabel="User Modal"
            className="userModal modal-container"
            overlayClassName="userModal overlay"
        >
            <div className="userModal modal-content">
                <div className="userModal header">
                    <div className="flex items-center justify-center w-20 h-20 m-4 bg-roomi rounded-full">
                        <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
                    </div>
                    <div className="text-lg font-bold">{localStorage.getItem('userName')}</div>
                </div>

                <div className="userModal content text-lg">
                    {isHost ? (
                        <>
                            {hostMode ? (
                                <>
                                    <button onClick={handleUserMode} className="userModal menu-item">
                                        <FontAwesomeIcon icon={faUser} className="text-2xl" />
                                        {t("게스트 전환")}
                                    </button>
                                    <button onClick={handleHostManage} className="userModal menu-item">
                                        <FaCogs className="text-2xl"/>
                                        {t("호스트 관리")}
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleUserHostMode} className="userModal menu-item">
                                    <FontAwesomeIcon icon={faUser} className="text-2xl" />
                                    {t("호스트 전환")}
                                </button>
                            )}
                        </>
                    ) : (
                        <button onClick={handleUserHostMode} className="userModal menu-item">
                            <FontAwesomeIcon icon={faUser} className="text-2xl" />
                            {t("호스트 등록")}
                        </button>
                    )}

                    <button onClick={handleMessage} className="userModal menu-item">
                        <FaRegEnvelope className="text-2xl"/>
                        {t("메시지")}
                    </button>

                    <button onClick={handleFavorite} className="userModal menu-item">
                        <FaRegHeart className="text-2xl"/>
                        {t("찜 목록")}
                    </button>

                    <button onClick={handleSettings} className="userModal menu-item">
                        <FaCogs className="text-2xl"/>
                        {t("계정 설정")}
                    </button>

                    <button onClick={handleLogout} className="userModal menu-item">
                        <FaSignOutAlt className="text-2xl"/>
                        {t("로그아웃")}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
