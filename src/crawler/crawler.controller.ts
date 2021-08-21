import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawService: CrawlerService) {}

  @Get('')
  async getData(@Query('count') count: string) {
    return await this.crawService.getData(parseInt(count));
  }

  @Get('movies')
  async getMovies(
    @Query('name') name: string,
    @Query('rating') rating: string,
    @Query('year') year: string,
    @Query('votes') votes: string,
    @Query('ranking') ranking: string,
  ) {
    return await this.crawService.fetchMovies(
      name,
      parseFloat(rating),
      parseInt(year),
      parseInt(ranking),
      parseInt(votes),
    );
  }
}
