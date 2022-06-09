import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { generateRandomPlaylist, getRandomGenre } from '../spotify';
import { useSpring, Spring, animated } from 'react-spring'

const Results = () => {
const [genre, setGenre] = useState(null);
const [year, setYear] = useState(null);
const [infoYear, setInfoYear] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        const { data } = await getRandomGenre();
        let genreList = data.genres;

        //pick random seed
        let randomGenre = genreList[Math.floor(Math.random()*genreList.length)];
        setGenre(randomGenre);

        //random number 1-10
        if(Math.floor(Math.random() * 11) === 7) {
            setGenre('CHAOS!');
        }
        console.log("Genre: " + randomGenre);

        //pick a year range
        let yearRange = [
            ["50's", "1950-1959"],
            ["60's", "1960-1969"],
            ["70's", "1970-1979"],
            ["80's", "1980-1989"],
            ["90's", "1990-1999"],
            ["2000's", "2000-2009"],
            ["2010's", "2010-2019"],
            ["Modern", "2020-2022"]
        ]
        let randomYearRange = yearRange[Math.floor(Math.random()*yearRange.length)]
        console.log("Year Range: " + randomYearRange[0]);
        setYear(randomYearRange[0]);
        setInfoYear(randomYearRange[1]);
    };
  
    catchErrors(fetchData());
}, []);


    return (
    <Spring from={{ scale: 0 }} to={{ scale: 1 }}>
    {props => (
    <animated.div style={props}>
        <h1>Your playlist is: {year} {genre}</h1>
        <div id="container">
            <Link to="/playlist">
                <button class="resultsButton" onClick={() => generateRandomPlaylist(`${genre}`, `${infoYear}`, `${year}`)}>Accept</button>
            </Link>
            <button class="resultsButton" onClick={() => window.location.reload()}>Reroll</button>
        </div>
    </animated.div>
    )}
    </Spring>
    )
};

export default Results;