import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FollowListType {
  FOLLOW = 'follow',
  FANS = 'fans',
}

export class getFollowListDto {
  @ApiPropertyOptional({
    description: '列表类型：follow 关注列表，fans 粉丝列表',
    example: 'follow',
    enum: ['follow', 'fans'],
  })
  type?: FollowListType;
}
