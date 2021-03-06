import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getMovies, deleteMovie, likeMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import ReactLoading from "react-loading";
import auth from "../services/authService";
import _ from "lodash";
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    isLoading: true,
    pageSize: 4,
    searchQuery: "",
    currentPage: 1,
    selectedGenre: "",
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres, isLoading: false });
  }

  handleLike = async (movie) => {
    if (!auth.getCurrentUser()) {
      return toast.info("You have to login for liking a movie");
    }

    let movies = [...this.state.movies];
    let index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movie.liked;
    this.setState({ movies });
    try {
      await likeMovie(movie._id);
    } catch (ex) {
      toast.error("something went wrong.");
    }
  };

  handleDelete = async (movieId) => {
    const originalMovies = this.state.movies;
    let movies = this.state.movies.filter((movie) => movie._id !== movieId);
    this.setState({ movies });

    try {
      await deleteMovie(movieId);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: "", currentPage: 1 });
  };

  getPagedData = () => {
    let {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      searchQuery,
      sortColumn,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { sortColumn, searchQuery, isLoading } = this.state;
    const { user } = this.props;
    const { totalCount, data: movies } = this.getPagedData();

    if (isLoading)
      return (
        <center>
          <ReactLoading
            type={"bars"}
            color={"#fff025"}
            height={"10%"}
            width={"50%"}
          />
        </center>
      );
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              stype={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>There are {totalCount} movies in the database</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            onClick={this.handlePageChange}
            currentPage={this.state.currentPage}
            totalMovies={totalCount}
            pageSize={this.state.pageSize}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
