import { config } from "@repo/config";
import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class EmailConfirmationDto {
  @IsNotEmpty()
  @IsUUID()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Length(config.otpLength)
  code: string;
}
