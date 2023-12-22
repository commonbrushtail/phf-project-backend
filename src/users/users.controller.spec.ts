import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { changeUsernameDto } from './dto/user.dto';
import { UserWithReqeust } from 'src/auth/interface/auth.interface';

describe('UsersController', () => {
  let controller: UsersController;

  const requestMock = {
    user: {
      Id: jest.fn(),
    },
  } as unknown as UserWithReqeust;
  const payloadMock = {} as unknown as changeUsernameDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('changeUsername', () => {
    it('should return the return object', () => {
      controller.changeUsername(payloadMock, requestMock);
    });
  });
});
