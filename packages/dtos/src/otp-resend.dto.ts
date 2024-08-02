import { EOtpChannelName } from "@repo/types";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class OtpResendDto {
  @IsNotEmpty()
  @IsUUID()
  token: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EOtpChannelName)
  channel: EOtpChannelName;

  @IsString()
  @IsNotEmpty()
  to: string;
}
