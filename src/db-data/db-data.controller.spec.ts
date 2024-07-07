import { Test, TestingModule } from '@nestjs/testing';
import { DbDataController } from './db-data.controller';

describe('DbDataController', () => {
  let controller: DbDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbDataController],
    }).compile();

    controller = module.get<DbDataController>(DbDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
