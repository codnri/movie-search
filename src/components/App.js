/* eslint-disable no-unused-vars, no-unused-expressions */
import React from "react";
import Movie from "./Movie";
import { THEMOVIEDB_API_KEY } from "../../config.js";
import Header from './Header'
let loadsize =
  (Math.floor(window.innerHeight / 430) + 1) *
  Math.floor((window.innerWidth - 180) / 250);
const api_key = THEMOVIEDB_API_KEY || process.env.THEMOVIEDB_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      error: null,
      isLoaded: false,
      total_pages: 0,
      current_page: 0,
      isLoading: false,
      lastpage: 0,
      hasLoadedAll: false,
      num_of_current_displayed: 0,
      year: new Date().getFullYear()
    };
  }

  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling);
  }

  // lazy loading
  trackScrolling = () => {
    if (this.state.hasLoadedAll || this.state.isLoading) {
      return false;
    }

    if (
      window.pageYOffset + window.innerHeight + 50 >
      document.body.clientHeight
    ) {
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.showMore(loadsize);
        this.setState({ isLoading: false });
      }, 1200);
    }
  };

  setYear= (year) =>{
    this.setState({year})
    this.setState({movies:[]})
    this.getMoviesByPage(1);
  }
  addDetailsToMovie = (movie, callback) => {
    return new Promise((resolve, reject) => {
      const url = `https://api.themoviedb.org/3/movie/${
        movie.id
      }?api_key=${api_key}`;

      fetch(url)
        .then(res => res.json())
        .then(
          result => {
            movie.details = result;
            this.setState(prevState => {
              movies: [...prevState.movies, movie];
            });
            callback(movie);
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
  sortMoviesByReleaseDate = () => {
    let movies = this.state.movies;

    movies.sort(function(a, b) {
      return a.release_date < b.release_date ? -1 : 1;
    });
    this.setState({ movies });
  };
  removeLowPopularityMovies = () => {
    let movies = this.state.movies;
    var i;
    for (i = 0; i < movies.length; i++) {
      if (movies[i].popularity < 10) {
        movies.pop(i);
      }
    }
    this.setState({ movies });
  };
  hasLowPopularityMovie = () => {
    var i;
    for (i = 0; i < this.state.movies.length; i++) {
      if (this.state.movies[i].popularity < 10) {
        return true;
      }
    }
    return false;
  };

  getMoviesByPage = page_num => {
    const year = this.state.year//new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=6156345e952a1ea8f63f83962610e7c9&language=en-US&sort_by=popularity.desc&include_video=false&page=${page_num}&primary_release_year=${year}`;
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          // console.log(result);

          this.setState(prevState => ({
            isLoaded: true,
            movies: [...prevState.movies, ...result.results],
            total_pages: result.total_pages
          }));
          // console.log(this.hasLowPopularityMovie());
          if (
            page_num >= this.state.total_pages ||
            this.hasLowPopularityMovie()
          ) {
            this.removeLowPopularityMovies();
            this.sortMoviesByReleaseDate();
            // console.log(this.state.movies);
            return false;
          } else {
            this.getMoviesByPage(page_num + 1);
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  componentWillMount() {
    // const movies = [
    //   {
    //     vote_count: 0,
    //     id: 501121,
    //     video: false,
    //     vote_average: 0,
    //     title: "The Queen of Spades",
    //     popularity: 11.305,
    //     poster_path: "/6Q9HloaX7PQN6tkqFpAv5qE3fkP.jpg",
    //     original_language: "ru",
    //     original_title: "La dame de pique",
    //     genre_ids: [10402],
    //     backdrop_path: null,
    //     adult: false,
    //     overview:
    //       "The dark world of Tchaikovsky’s penultimate operatic masterpiece Queen of Spades hinges on obsession, greed, and a secret in winning at cards… In 2005, the Opéra Bastille mounted a compelling production featuring Vladimir Galouzine as the mad lover Hermann, Hasmik Papian as the doomed Lisa, and Irina Bogatcheva as the mysterious Comtesse.",
    //     release_date: "2019-01-22"
    //   },
    //   {
    //     vote_count: 0,
    //     id: 440472,
    //     video: false,
    //     vote_average: 0,
    //     title: "The Queen of Spades 2",
    //     popularity: 10.305,
    //     poster_path: "/6Q9HloaX7PQN6tkqFpAv5qE3fkP.jpg",
    //     original_language: "ru",
    //     original_title: "La dame de pique",
    //     genre_ids: [10402],
    //     backdrop_path: null,
    //     adult: false,
    //     overview:
    //       "The dark world of Tchaikovsky’s penultimate operatic masterpiece Queen of Spades hinges on obsession, greed, and a secret in winning at cards… In 2005, the Opéra Bastille mounted a compelling production featuring Vladimir Galouzine as the mad lover Hermann, Hasmik Papian as the doomed Lisa, and Irina Bogatcheva as the mysterious Comtesse.",
    //     release_date: "2019-03-22"
    //   }
    // ];

    if (loadsize == 0) loadsize = 5;

    this.setState({ num_of_current_displayed: loadsize });
    this.getMoviesByPage(1);
  }

  showMore = additional_num => {
    this.setState(prevState => ({
      num_of_current_displayed:
        prevState.num_of_current_displayed + additional_num
    }));
  };
  render() {
    const {
      movies,
      isLoading,
      hasLoadedAll,
      num_of_current_displayed
    } = this.state;
    return (
      <>
      <Header setYear={this.setYear}/>
      <div className="App">
        <div className="mv-container mv-align-center">
          {movies
            .filter((el, index) => index < num_of_current_displayed)
            .map(movie => {
              return (
                <div>
                  <Movie movie={movie} key={movie.id} />
                </div>
              );
            })}
        </div>

        {isLoading && num_of_current_displayed < movies.length ? (
          <div class="load">
            <i class="fas fa-spinner fa-3x fa-spin" />
          </div>
        ) : (
          ""
        )}
      </div>
      </>
    );
  }
}

export default App;
