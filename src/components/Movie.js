import React from "react";
import ReactModal from "react-modal";
import { THEMOVIEDB_API_KEY } from "../../config.js";

ReactModal.setAppElement("#root");
const api_key = THEMOVIEDB_API_KEY || process.env.THEMOVIEDB_API_KEY;

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      movie: this.props.movie
    };
  }

  addDetailsToMovie = movie => {
    return new Promise((resolve, reject) => {
      // console.log(movie);
      const url = `https://api.themoviedb.org/3/movie/${
        movie.id
      }?api_key=${api_key}`;
      // console.log(url);
      fetch(url)
        .then(res => res.json())
        .then(
          result => {
            // console.log(result);
            movie.details = result;
            this.setState({ movie });
            resolve();
          },
          error => {
            this.setState({
              isLoaded: true,
              error
            });
            reject();
          }
        );
    });
  };

  onClickDetailButton = () => {
    if (!this.state.movie.details) {
      this.addDetailsToMovie(this.state.movie).then(
        this.setState({ showModal: true })
      );
    } else {
      this.setState({ showModal: true });
    }
  };
  handleCloseModal = e => {
    this.setState({ showModal: false });
  };
  render() {
    const { movie, showModal } = this.state;
    return (
      <div>
        <div className="card" onClick={this.onClickDetailButton}>
          <div id="popularity">{Math.round(movie.popularity * 100) / 100}</div>
          {movie.poster_path ? (
            <img
              src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
              alt={movie.title}
            />
          ) : (
            <div className="no-image">
              <img src="./img/no-image-icon.jpg" />
            </div>
          )}
          <div id="title">
            <img src="./img/film-icon.png" alt="film-icon" />
            {movie.title}
          </div>

          <div id="release-date">{movie.release_date}</div>
        </div>
        <ReactModal
          isOpen={showModal}
          contentLabel="Details"
          className="Modal"
          overlayClassName="Overlay"
          onRequestClose={this.handleCloseModal}
        >
          {movie.details && (
            <div className="modal-container">
              <i
                className="fas fa-times-circle"
                onClick={this.handleCloseModal}
              />
              <div className="modal-header">
                <div className="title">
                  {movie.title}
                  <div className="tagline">{movie.details.tagline}</div>
                </div>
              </div>

              <ul>
                {movie.details.overview && (
                  <li>
                    <small>Overview:&nbsp;</small>
                    <span className="overview">{movie.details.overview}</span>
                  </li>
                )}
                {movie.details.runtime && (
                  <li>
                    <small>Runtime:&nbsp;</small>
                    {movie.details.runtime} min
                  </li>
                )}

                <li>
                  <small>Genres:&nbsp;</small>
                  <div className="genres">
                    {movie.details.genres &&
                      movie.details.genres.map(genre => {
                        return <div className="genre">{genre.name}</div>;
                      })}
                  </div>
                </li>
              </ul>
            </div>
          )}
        </ReactModal>
      </div>
    );
  }
}

export default Movie;
