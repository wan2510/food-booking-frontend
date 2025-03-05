import AboutUs from "./AboutUs";
import Banner from "./Banner/banner";
import CustomerReviews from "./CustomerReview";
import FeaturedMenu from "./FeaturedMenu";
import FoodExamples from "./FoodExample";

const Home = () => {
    return(
        <div>
            <Banner/>
            <AboutUs/>
            <FeaturedMenu/>
            <FoodExamples/>
            <CustomerReviews/>
        </div>
    )
};

export default Home;