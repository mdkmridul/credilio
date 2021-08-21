start app
  npm run start

create a json file for movies
  localhost:3000?count=${any number}
   eg: curl --location --request GET 'localhost:3000/crawler?count=2'

fetch movies by filters
  curl --location --request GET 'localhost:3000/crawler/movies?name=he s&year=1994&rating=8.9&votes=2448197&ranking=1'

  name filter : any case is acceptable,
  votes filter : all the movies with higher number of votes
  rating filter : all the movies with higher ratings
  ranking filter : given ranking will be matched only
  year filter : movies with given year will be provided