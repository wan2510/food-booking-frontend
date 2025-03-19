import AboutUs from "./AboutUs";
import Banner from "./Banner/banner";
import FeaturedMenu from "./FeaturedMenu";
import FoodExamples from "./FoodExample";
import CustomerReviews from "./CustomerReview";
import React from 'react';

const Home = () => {
    return(
        <div className="home-page">
            <Banner/>
            <AboutUs/>
            <FeaturedMenu/>
            <FoodExamples />
            <CustomerReviews />
        </div>
    )
};

export default Home;