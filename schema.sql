CREATE TABLE movie_detail(
    id serial primary key,
    title VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(255),
    comments VARCHAR(1000)
);