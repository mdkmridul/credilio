import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as request from 'request';
import * as fs from 'fs';
const movies = [];

@Injectable()
export class CrawlerService {
  async getData(count) {
    if (!count) {
      count = 100;
    }
    const url = `https://www.imdb.com/search/title/?count=${count}&groups=top_1000&sort=user_rating`;
    const data = request(url, function (error, response, html) {
      const $ = cheerio.load(html);
      const header = $('.lister-item');
      header.each(function (idx, el) {
        if (!movies[idx] && idx < 100) {
          movies.push({});
        }
        const index = $(el)
          .children('.lister-item-content')
          .children('.lister-item-header')
          .children('.lister-item-index')
          .text();
        movies[idx]['index'] = parseInt(index.match(/\d+/)[0]);
        movies[idx]['title'] = $(el)
          .children('.lister-item-content')
          .children('.lister-item-header')
          .children('a')
          .text();
        const year = $(el)
          .children('.lister-item-content')
          .children('.lister-item-header')
          .children('.lister-item-year')
          .text();
        movies[idx]['year'] = parseInt(year.match(/\d+/)[0]);
        movies[idx]['rating'] = parseFloat(
          $(el)
            .children('.lister-item-content')
            .children('.ratings-bar')
            .children('.ratings-imdb-rating')
            .children('strong')
            .text(),
        );
        const votes = $(el)
          .children('.lister-item-content')
          .children('.sort-num_votes-visible')
          .children('span')
          .text();
        movies[idx]['votes'] = parseInt(
          votes
            .match(/Votes:[\d,]+/)[0]
            .split(':')[1]
            .replace(/,/g, ''),
        );
      });
      function writeData(data) {
        fs.writeFile('movies.json', data, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
      writeData(JSON.stringify(movies));
      return true;
    });
    return {
      success: true,
      message: 'File has been been updated',
    };
  }

  async readFile() {
    const data = fs.readFileSync('movies.json', 'utf8');
    return JSON.parse(data);
  }

  async fetchMovies(name, rating, year, ranking, votes) {
    const movies = await this.readFile();
    const result = [];
    movies.forEach((element) => {
      let name_cond = true;
      let votes_cond = true;
      let ranking_cond = true;
      let rating_cond = true;
      let year_cond = true;

      const title = element.title.toLowerCase();
      const ip_rating = element.rating;
      const ip_votes = element.votes;
      const ip_ranking = element.index;
      const ip_year = element.year;
      if (name) {
        name_cond = title.includes(name.toLowerCase());
      }

      if (rating) {
        rating_cond = ip_rating > rating;
      }

      if (year) {
        year_cond = ip_year == year;
      }

      if (votes) {
        votes_cond = ip_votes > votes;
      }

      if (ranking) {
        ranking_cond = ip_ranking == ranking;
      }

      if (name_cond && rating_cond && year_cond && ranking_cond && votes_cond) {
        result.push(element);
      }
    });

    return { success: true, message: '', data: { movies: { ...result } } };
  }
}
