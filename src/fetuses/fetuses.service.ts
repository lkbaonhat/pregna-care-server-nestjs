import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFetusDto } from './dto/create-fetus.dto';
import { UpdateFetusDto } from './dto/update-fetus.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fetus } from './entities/fetus.entity';
import { UserDocument } from 'src/users/user.schema';
import { CreateUserFetusDto } from './dto/create-user-fetus.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserFetusDto } from './dto/update-user-fetus.dto';

@Injectable()
export class FetusesService {
  constructor(
    @InjectModel('Fetus') private fetusModel: Model<Fetus>,
    private usersService: UsersService,
  ) {}

  // ADMIN
  async create(createFetusDto: CreateFetusDto) {
    try {
      const createdFetus = new this.fetusModel(createFetusDto);
      return await createdFetus.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }

  async findAll() {
    try {
      const fetuses = await this.fetusModel.find();
      if (fetuses.length === 0) {
        throw new NotFoundException('No fetuses found');
      }
      return fetuses;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }

  async findOne(id: string) {
    try {
      const fetus = await this.fetusModel.findById(id);
      if (!fetus) {
        throw new NotFoundException('Fetus not found');
      }
      return fetus;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }

  async update(id: string, updateFetusDto: UpdateFetusDto) {
    try {
      const updatedFetus = await this.fetusModel.findByIdAndUpdate(
        id,
        updateFetusDto,
        { new: true },
      );
      if (!updatedFetus) {
        throw new NotFoundException('Fetus not found');
      }

      return updatedFetus;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }

  async softDelete(id: string) {
    try {
      const deletedFetus = await this.fetusModel.findByIdAndUpdate(
        id,
        [{ $set: { isDeleted: { $not: '$isDeleted' } } }],
        { new: true },
      );
      if (!deletedFetus) {
        throw new NotFoundException('Fetus not found');
      }
      return deletedFetus;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }

  async hardDelete(id: string) {
    try {
      const deletedFetus = await this.fetusModel.findByIdAndDelete(id);
      if (!deletedFetus) {
        throw new NotFoundException('Fetus not found');
      }
      return deletedFetus;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }

  // USER
  async createByUser(user: UserDocument, createFetusDto: CreateUserFetusDto) {
    const createdFetus = new this.fetusModel({
      userId: user._id,
      ...createFetusDto,
    });

    await createdFetus.save();
    await this.usersService.addFetus(user, createdFetus);

    return createdFetus;
  }

  async updateByUser(
    user: UserDocument,
    fetusId: string,
    updateUserFetusDto: UpdateUserFetusDto,
  ) {
    const fetus = await this.update(fetusId, updateUserFetusDto);

    await this.usersService.updateFetus(user, fetus);
    return fetus;
  }

  async softDeleteByUser(user: UserDocument, fetusId: string) {
    const fetus = await this.softDelete(fetusId);
    await this.usersService.softDeleteFetus(user, fetus._id.toString());
    return fetus;
  }

  async hardDeleteByUser(user: UserDocument, fetusId: string) {
    const fetus = await this.hardDelete(fetusId);
    await this.usersService.hardDeleteFetus(user, fetus._id.toString());
    return fetus;
  }

  async getFetusesByUser(userId: string) {
    const fetuses = await this.fetusModel.find({ userId }).exec();
    if (!fetuses.length) {
      throw new NotFoundException('No fetuses found for this user');
    }
    return fetuses;
  }
}
