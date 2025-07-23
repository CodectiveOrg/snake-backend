import { Request, Response } from "express";

import { z } from "zod";

import {
  ProfileEditPictureResponseDto,
  ProfileEditResponseDto,
  ProfileGetResponseDto,
} from "@/dto/profile-response.dto";

import { User } from "@/entities/user";

import { DatabaseService } from "@/services/database.service";

import { fetchUserFromToken } from "@/utils/api.utils";
import { assignDefinedValues } from "@/utils/object.utils";

export class ProfileController {
  private readonly userRepo;

  public constructor(databaseService: DatabaseService) {
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.getProfile = this.getProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.editPicture = this.editPicture.bind(this);
  }

  public async getProfile(
    _: Request,
    res: Response<ProfileGetResponseDto>,
  ): Promise<void> {
    const user = await fetchUserFromToken(res, this.userRepo);

    const record = {
      username: user.username,
      email: user.email,
      gender: user.gender,
      picture: user.picture,
    };

    res.json({
      statusCode: 200,
      message: "Profile info fetched successfully.",
      result: record,
    });
  }

  public async editProfile(
    req: Request,
    res: Response<ProfileEditResponseDto>,
  ): Promise<void> {
    const body = EditProfileSchema.parse(req.body);
    const user = await fetchUserFromToken(res, this.userRepo);

    const updatedUser = assignDefinedValues(user, body);
    await this.userRepo.save(updatedUser);

    res.json({
      statusCode: 200,
      message: "Profile updated successfully.",
    });
  }

  public async editPicture(
    req: Request,
    res: Response<ProfileEditPictureResponseDto>,
  ): Promise<void> {
    const user = await fetchUserFromToken(res, this.userRepo);

    if (!req.file) {
      user.picture = null;
      await this.userRepo.save(user);

      res.json({
        statusCode: 200,
        message: "Picture removed successfully.",
      });
    } else {
      user.picture = req.file.buffer;
      await this.userRepo.save(user);

      res.json({
        statusCode: 200,
        message: "Picture updated successfully.",
      });
    }
  }
}

const EditProfileSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});
