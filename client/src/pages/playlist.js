import { Link } from 'react-router-dom';

const playlist = () => {
    return (
    <>
        <h1>Your playlist has been created! Check spotify :)</h1>
        <Link to="/" >
            <button>Back</button>
        </Link>
    </>
    )
}

export default playlist;