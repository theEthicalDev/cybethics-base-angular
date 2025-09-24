import {BaseDto} from './base-dto';

export abstract class BaseCreatedUpdatedDto extends BaseDto {
  createdDate: Date;
  createdUserId: string;
  updatedDate: Date;
  updatedUserId: string;
}

