import React from 'react';
import './featuredMenu.css';

const FeaturedMenu = () => {
    const featuredItems = [
        {
            id: 1,
            image: 'src/assets/image/gasotcayhq.jpg',
            name: 'Gà Sốt Cay Hàn Quốc (6 miếng)',
            description: 'Gà rán giòn rụm, phủ sốt cay ngọt chuẩn vị Hàn Quốc.',
            price: '155.000đ',
            tag: 'Món mới',
            details: 'Ức gà tươi, sốt cay Hàn Quốc đặc trưng, tẩm bột giòn. 600 kcal',
            isHot: true
        },
        {
            id: 2,
            image: 'src/assets/image/garantt.jpg',
            name: 'Gà Rán Truyền Thống (1 miếng)',
            description: 'Gà rán giòn tan, hương vị truyền thống hấp dẫn.',
            price: '40.000đ',
            tag: 'Best Seller',
            details: 'Đùi gà tươi, tẩm bột chiên giòn, giữ nguyên hương vị tự nhiên. 350 kcal',
            isHot: true
        },
        {
            id: 3,
            image: 'src/assets/image/burgerthitxongkhoibbq.jpg',
            name: 'Burger Thịt Xông Khói BBQ',
            description: 'Bánh burger nhân thịt bò kết hợp với thịt xông khói và sốt BBQ đậm đà.',
            price: '70.000đ',
            tag: 'Best Seller',
            details: 'Thịt bò nướng, thịt xông khói, sốt BBQ, rau tươi, phô mai cheddar. 500 kcal',
            isHot: true
        }
    ];

    return (
        <div className="featured-menu">
            <h2 className="section-title">Món Ăn Đặc Biệt</h2>
            <div className="menu-container">
                {featuredItems.map((item) => (
                    <div key={item.id} className="menu-item">
                        <div className="menu-image-container">
                            <img src={item.image} alt={item.name} className="menu-image" />
                            {item.isHot && <span className="menu-tag">{item.tag}</span>}
                        </div>
                        <h3 className="menu-name">{item.name}</h3>
                        <p className="menu-description">{item.description}</p>
                        <span className="menu-price">{item.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedMenu;
