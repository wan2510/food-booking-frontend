import React from 'react';
import Banner from '../Homecomponent/banner.jsx';
import WhyChooseUs from '../Homecomponent/whyChooseUs.jsx';
import FeaturedMenu from '../Homecomponent/featuredMenu.jsx';
import FoodExamples from '../Homecomponent/foodExamples.jsx';
import SpecialOffers from '../Homecomponent/specialOffer.jsx';
import CustomerReviews from '../Homecomponent/customerReview.jsx';

const HomePage = () => {
    return (
        <div>
            <Banner />
            <WhyChooseUs/>
            <FeaturedMenu/>
            <FoodExamples/>
            <SpecialOffers/>
            <CustomerReviews/>
        </div>
    );
};
export default HomePage;