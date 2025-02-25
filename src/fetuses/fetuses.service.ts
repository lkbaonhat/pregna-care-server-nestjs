import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFetusDto } from './dto/create-fetus.dto';
import { UpdateFetusDto } from './dto/update-fetus.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fetus } from './entities/fetus.entity';

@Injectable()
export class FetusesService {
  constructor(@InjectModel('Fetus') private fetusModel: Model<Fetus>) { }

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
      return {
        message: 'Deleted successfully',
        data: {
          id: deletedFetus._id,
          name: deletedFetus.name,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
}
