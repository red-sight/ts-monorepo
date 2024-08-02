import { OtpResendDto, ServiceMethodBaseDto } from '@repo/dtos';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class OtpResendAuthDto extends ServiceMethodBaseDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => OtpResendDto)
  query: OtpResendDto;
}
