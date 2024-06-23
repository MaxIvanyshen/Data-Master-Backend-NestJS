import { Test, TestingModule } from '@nestjs/testing';
import { DbDataService } from './db-data.service';

describe('DbDataService', () => {
  let service: DbDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbDataService],
    }).compile();

    service = module.get<DbDataService>(DbDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
