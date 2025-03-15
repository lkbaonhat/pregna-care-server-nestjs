import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFetusStandardDto } from './dto/create-fetus-standard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FetusStandard } from './entities/fetus-standard.entity';
import { Model } from 'mongoose';
import { UpdateFetusStandardDto } from './dto/update-fetus-standard.dto';

@Injectable()
export class FetusStandardService {
  constructor(
    @InjectModel(FetusStandard.name) private userModel: Model<FetusStandard>,
  ) { }

  async findFetusStandardByWeek(week: number) {
    const standards = await this.userModel.find({
      'weeks.week': week,
    });

    if (!standards || standards.length === 0) {
      throw new NotFoundException(`No standard data found for week ${week}`);
    }

    // Transform data to the requested format
    const result: { item: string; value: string; score: number }[] = [];
    standards.forEach(standard => {
      const weekData = standard.weeks.find(w => w.week === week);
      if (weekData) {
        result.push(
          { item: standard.name, value: 'min', score: weekData.min },
          { item: standard.name, value: 'max', score: weekData.max }
        );
      }
    });

    return {
      data: result,
    };
  }

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
  async findAll(page: number, limit: number) {
    const result = await this.userModel.find().select('name unit createdAt');

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginatedResult = result.slice(startIndex, startIndex + limit);

    return {
      data: {
        data: paginatedResult,
        pagination: {
          total: total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
  //#endregion

  //#region find fetus standard by name and week
  async findFetusStandardByNameAndWeek(
    name: string,
    minWeek: number,
    maxWeek: number,
    page: number,
    limit: number,
    isDeleted: boolean,
  ) {
    try {
      const result = await this.userModel.findOne({
        name: name,
        isDeleted: isDeleted,
      });

      const min =
        minWeek && !isNaN(Number(minWeek)) ? Number(minWeek) : undefined;
      const max =
        maxWeek && !isNaN(Number(maxWeek)) ? Number(maxWeek) : undefined;

      let filteredWeeks = result?.weeks;
      if (min !== undefined && max !== undefined) {
        filteredWeeks = result?.weeks.filter(
          (week) => week.week >= min && week.week <= max,
        );
      } else if (min !== undefined) {
        filteredWeeks = result?.weeks.filter((week) => week.week >= min);
      } else if (max !== undefined) {
        filteredWeeks = result?.weeks.filter((week) => week.week <= max);
      }

      const total = filteredWeeks ? filteredWeeks.length : 0;
      const startIndex = (page - 1) * limit;
      const paginatedWeeks = filteredWeeks
        ? filteredWeeks.slice(startIndex, startIndex + limit)
        : [];

      return {
        data: {
          name: result?.name,
          unit: result?.unit,
          weeks: paginatedWeeks,
          pagination: {
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error');
    }
  }
  //#endregion

  //#region find fetus standard by week for member
  async findByWeekForMember(week: number) {
    try {
      const result = await this.userModel.find(
        { 'weeks.week': week },
        { name: 1, unit: 1, _id: 0 },
      );
      if (!result || result.length === 0) {
        throw new NotFoundException(`No data found for week ${week}`);
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
    const result = await this.userModel
      .find({ name: regex })
      .select('name unit');

    if (!result || result.length === 0) {
      throw new NotFoundException(`No data found for name ${name}`);
    }

    return {
      data: result,
    };
  }
  //#endregion

  //#region Create FetusStandard
  async create(createFetusStandardDto: CreateFetusStandardDto) {
    try {
      const isFetusExist = await this.findOneStandardByName(
        createFetusStandardDto.name,
      );

      if (isFetusExist) {
        const duplicateWeeks = createFetusStandardDto.weeks
          .filter((week) =>
            isFetusExist.weeks.some((w) => w.week === week.week),
          )
          .map((w) => w.week);

        if (duplicateWeeks.length > 0) {
          throw new ConflictException(
            `Week ${duplicateWeeks.join(', ')} already exist for ${createFetusStandardDto.name}`,
          );
        }

        // Add new weeks to existing fetus standard
        isFetusExist.weeks.push(...createFetusStandardDto.weeks);
        isFetusExist.save();
        return {
          data: isFetusExist,
        };
      } else {
        const createdFetusStandard = new this.userModel(createFetusStandardDto);
        createdFetusStandard.save();
        return {
          data: createdFetusStandard,
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
      const existingFetusStandard = await this.userModel.findById(id);
      if (!existingFetusStandard) {
        throw new NotFoundException(`No data found for id ${id}`);
      }

      Object.keys(createFetusStandardDto).forEach((key) => {
        if (key === 'weeks' && Array.isArray(createFetusStandardDto.weeks)) {
          createFetusStandardDto.weeks.forEach((newWeek) => {
            const existingWeekIndex = existingFetusStandard.weeks.findIndex(
              (week) => week.week === newWeek.week,
            );

            if (existingWeekIndex !== -1) {
              existingFetusStandard.weeks[existingWeekIndex] = {
                ...existingFetusStandard.weeks[existingWeekIndex],
                ...newWeek,
              };
            }
          });
        } else if (createFetusStandardDto[key] !== undefined) {
          existingFetusStandard[key] = createFetusStandardDto[key];
        }
      });

      const updatedFetusStandard = await existingFetusStandard.save();

      return {
        data: updatedFetusStandard,
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
        [{ $set: { isDeleted: { $not: '$isDeleted' } } }],
        { new: true },
      );

      if (!updatedFetusStandard) {
        throw new NotFoundException(`No data found for id ${id}`);
      }
      return {
        data: {
          _id: updatedFetusStandard._id,
          name: updatedFetusStandard.name,
          isDeleted: updatedFetusStandard.isDeleted,
        },
        message: 'Deleted successfully',
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
        },
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
