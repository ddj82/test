import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import 'src/css/HomeScreen.css'; // 별도의 CSS 파일로 스타일 관리 (웹에 적합)
import { RoomData } from "src/types/rooms";
import KakaoWebMap from "src/components/map/KakaoMap";
import { useNavigate } from 'react-router-dom'; // React Router 사용
import WishlistButton from "src/components/modals/WishlistButton";
import i18n from "src/i18n";

// Accommodation Card Component
const AccommodationCard = memo(
    ({ item, onClick }: { item: RoomData; onClick: () => void }) => {
        const formatPrice = useCallback((price: number | null) => {
            if (!price) return '가격 정보 없음';
            return `${price.toLocaleString()}원`;
        }, []);

        return (
            <div className="homeScreen card" onClick={onClick}>
                <div className="homeScreen card-header">
                    <WishlistButton />
                    <img
                        src={item.thumbnail_url || 'https://placehold.co/600x400'}
                        alt="thumbnail"
                        className="homeScreen card-image"
                    />
                </div>
                <div className="homeScreen card-content">
                    <div className="homeScreen price-container">
                        {item.hour_enabled && item.hour_price && (
                            <p className="homeScreen price">{formatPrice(item.hour_price)} / 시간</p>
                        )}
                        {item.day_enabled && item.day_price && (
                            <p className="homeScreen price">{formatPrice(item.day_price)} / 일</p>
                        )}
                        {item.week_enabled && item.week_price && (
                            <p className="homeScreen price">{formatPrice(item.week_price)} / 주</p>
                        )}
                    </div>
                    <h3 className="homeScreen title">{item.title || '제목 없음'}</h3>
                    <p className="homeScreen location">{item.address || '주소 정보 없음'}</p>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);

interface HomeScreenProps {
    rooms: RoomData[];
}

// Main Component
const HomeScreen: React.FC<HomeScreenProps> = ({ rooms: externalRooms }) => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState(true);

    const handleRoomsUpdate = useCallback((newRooms: RoomData[]) => {
        console.log('Rooms updated:', newRooms);
        setRooms(newRooms);
        setLoading(false);
    }, []);

    useEffect(() => {
        setRooms(externalRooms);
    }, [externalRooms]);

    const handleCardClick = (roomId: number) => {
        const currentLocale = i18n.language; // 현재 언어 감지
        navigate(`/detail/${roomId}/${currentLocale}`); // URL 파라미터로 전달
    };

    const renderMap = useCallback(
        () => <KakaoWebMap onRoomsUpdate={handleRoomsUpdate} />,
        [handleRoomsUpdate]
    );

    const renderAccommodations = useMemo(() => {
        if (loading) {
            return <div className="homeScreen loading">로딩 중...</div>;
        }

        if (rooms.length === 0) {
            return <div className="homeScreen error">표시할 숙소가 없습니다.</div>;
        }

        return (
            <div className="homeScreen accommodation-grid">
                {rooms.map((item) => (
                    <AccommodationCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item.id)} // id 전달
                    />
                ))}
            </div>
        );
    }, [rooms, loading]);

    return (
        <div className="homeScreen container">
            {renderMap()}
            <div className="homeScreen room-content-container">{renderAccommodations}</div>
        </div>
    );
};

export default HomeScreen;
