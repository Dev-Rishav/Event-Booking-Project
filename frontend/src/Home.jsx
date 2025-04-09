import React from "react"
import TopPickedEvents from "./Homepage/TopPickedEvents"
import RecommendedMovies from "./Homepage/RecommendedMovies"
import PromoBanner from "./Homepage/PromoBanner"
import ListYourShow from "./Homepage/ListYourShow"

const Home = () => {


    return (
        <>
        <TopPickedEvents />
        <RecommendedMovies />
        <PromoBanner />
        <ListYourShow />
        </>
    )
}

export default Home