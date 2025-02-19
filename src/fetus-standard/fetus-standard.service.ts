import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFetusStandardDto } from './dto/create-fetus-standard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FetusStandard } from './entities/fetus-standard.entity';
import { Model } from 'mongoose';
import { UpdateFetusStandardDto } from './dto/update-fetus-standard.dto';

@Injectable()
export class FetusStandardService {

  constructor(
    @InjectModel(FetusStandard.name) private userModel: Model<FetusStandard>
  ) { }

  //#region findOneStandardByName
  async findOneStandardByName(name: string) {
    const result = await this.userModel.findOne({ name: name });
    return result ? result : null;
  }
  //#endregion

  //#region checkDuplicateStandardByWeek
  async checkDuplicateStandardByWeek(week: number) {
    const result = await this.userModel.findOne({ week: week });
    return result ? result : null;
  }
  //#endregion

  //#region find all fetus standard
  async findAll() {
    const result = await this.userModel.find();
    return {
      data: result
    };
  }
  //#endregion

  //#region find fetus standard by name
  async findFetusStandardByName(name: string, isActive: boolean) {
    try {
      const result = await this.userModel.find({ name: name, isDeleted: isActive });

      if (!result || result.length === 0) {
        throw new NotFoundException(`No data found for name ${name}`);
      }
      return {
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
  //#endregion

  //#region Search 
  async search(name: string) {
    const regex = new RegExp(name, 'i');
    const result = await this.userModel.find({ name: regex });

    if (!result || result.length === 0) {
      throw new NotFoundException(`No data found for name ${name}`);
    }

    return {
      data: result
    };
  }
  //#endregion

  //#region Create FetusStandard
  async create(createFetusStandardDto: CreateFetusStandardDto) {
    try {
      const isFetusExist = await this.findOneStandardByName(createFetusStandardDto.name);

      if (isFetusExist) {
        const duplicateWeeks = createFetusStandardDto.weeks
          .filter(week => isFetusExist.weeks.some(w => w.week === week.week))
          .map(w => w.week);

        if (duplicateWeeks.length > 0) {
          throw new ConflictException(`Week ${duplicateWeeks.join(', ')} already exist for ${createFetusStandardDto.name}`);
        }

        // Add new weeks to existing fetus standard
        isFetusExist.weeks.push(...createFetusStandardDto.weeks);
        isFetusExist.save();
        return {
          data: isFetusExist
        };

      } else {
        const createdFetusStandard = new this.userModel(createFetusStandardDto);
        createdFetusStandard.save();
        return {
          data: createdFetusStandard
        };
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
  //#endregion

  //#region Update FetusStandard
  async update(createFetusStandardDto: UpdateFetusStandardDto, id: string) {
    try {
      const updatedFetusStandard = await this.userModel.findByIdAndUpdate(id, createFetusStandardDto, { new: true });
      if (!updatedFetusStandard) {
        throw new NotFoundException(`No data found for id ${id}`);
      }
      return {
        data: updatedFetusStandard
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
  //#endregion

  //#region Soft Delete FetusStandard
  async softDelete(id: string) {
    try {
      const updatedFetusStandard = await this.userModel.findByIdAndUpdate(
        id,
        [{ $set: { isDeleted: { $not: "$isDeleted" } } }],
        { new: true }
      );

      if (!updatedFetusStandard) {
        throw new NotFoundException(`No data found for id ${id}`);
      }
      return {
        data: {
          _id: updatedFetusStandard._id,
          name: updatedFetusStandard.name,
          isDeleted: updatedFetusStandard.isDeleted
        },
        message: 'Deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
  //#endregion

  //#region Hard Delete FetusStandard
  async hardDelete(id: string) {
    try {
      const deletedFetusStandard = await this.userModel.findByIdAndDelete(id);
      if (!deletedFetusStandard) {
        throw new NotFoundException(`No data found for id ${id}`);
      }
      return {
        message: 'Deleted successfully',
        data: {
          id: deletedFetusStandard._id,
          name: deletedFetusStandard.name,
        }
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
  //#endregion
}
