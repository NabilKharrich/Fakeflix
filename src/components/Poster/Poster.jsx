import "./poster.scss"
import { motion } from "framer-motion";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { FaChevronDown, FaMinus, FaPlay, FaPlus } from "react-icons/fa";
import useGenreConversion from "../../hooks/useGenreConversion";
import { showModalDetail } from "../../redux/modal/modal.actions";
import { useDispatch } from "react-redux";
import { addToFavourites, removeFromFavourites } from "../../redux/favourites/favourites.actions";
import { Link } from "react-router-dom";
import { defaultEasing } from "../../motionUtils";

const Poster = result => {
    const { item, item: { title, original_name, original_title, name, genre_ids, backdrop_path }, isFavourite } = result;
    let fallbackTitle = title || original_title || name || original_name;
    const genresConverted = useGenreConversion(genre_ids);
    const dispatch = useDispatch();

    const handleAdd = event => {
        event.stopPropagation();
        dispatch(addToFavourites(result));
    };
    const handleRemove = event => {
        event.stopPropagation();
        dispatch(removeFromFavourites(result));
    };

    const handleModalOpening = () => {
        dispatch(showModalDetail({ ...item, fallbackTitle, genresConverted, isFavourite, result }));
    }

    const handlePlayAction = event => {
        event.stopPropagation();
    };

    const fadeIn = {
        initial: { y: 20, opacity: 0, transition: { duration: .5, ease: defaultEasing }},
        animate: { y: 0, opacity: 1, transition: { duration: .5, ease: defaultEasing }},
        exit: { y: 20, opacity: 0, transition: { duration: .5, ease: defaultEasing }}
    };

    return (
        <motion.div
            variants={fadeIn}
            className='Poster'
            onClick={handleModalOpening}
        >
            {backdrop_path ? (
                <img src={`${BASE_IMG_URL}/${backdrop_path}`} alt={fallbackTitle} />
            ) : (
                <>
                    <img src={FALLBACK_IMG_URL} alt={fallbackTitle} />
                    <div className='Poster__fallback'>
                        <span>{fallbackTitle}</span>
                    </div>
                </>
            )}
            <div className="Poster__info">
                <div className="Poster__info--iconswrp">
                    <Link
                        className="Poster__info--icon icon--play"
                        onClick={handlePlayAction}
                        to={'/play'}
                    >
                        <FaPlay />
                    </Link>
                    {!isFavourite
                        ? (
                            <button className='Poster__info--icon icon--favourite' onClick={handleAdd}>
                                <FaPlus />
                            </button>
                        ): (
                            <button className='Poster__info--icon icon--favourite' onClick={handleRemove}>
                                <FaMinus />
                            </button>
                        )}
                    <button className='Poster__info--icon icon--toggleModal'>
                        <FaChevronDown onClick={handleModalOpening}/>
                    </button>
                </div>
                <div className="Poster__info--title">
                    <h3>{fallbackTitle}</h3>
                </div>
                <div className="Poster__info--genres">
                    {genresConverted && genresConverted.map(genre => (
                        <span key={`Genre--id_${genre}`} className="genre-title">{genre}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default Poster
