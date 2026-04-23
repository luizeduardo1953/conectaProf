import { Body, Controller, Delete, Get, Param, Post, Put, HttpException } from "@nestjs/common";
import { CreateAvailabilityUseCase } from "../application/use-cases/CreateAvailability";
import { UpdateAvaliabilityUseCase } from "../application/use-cases/UpdateAvailability";
import { DeleteAvailabilityUseCase } from "../application/use-cases/DeleteAvailability";
import { FindByIdAvailabilityUseCase } from "../application/use-cases/FindByIdAvailability";
import { FindAllAvailabilityUseCase } from "../application/use-cases/FindAllAvailability";
import { CreateAvailabilityDto } from "../dto/create-availability.dto";
import { UpdateAvailabilityDto } from "../dto/update-availability.dto";
import { Role } from "src/enums/role";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller('availability')
export class AvailabilityController {
    constructor(
        private readonly createAvailability: CreateAvailabilityUseCase,
        private readonly updateAvailability: UpdateAvaliabilityUseCase,
        private readonly deleteAvailability: DeleteAvailabilityUseCase,
        private readonly findAvailabilityById: FindByIdAvailabilityUseCase,
        private readonly findAllAvailability: FindAllAvailabilityUseCase,
    ) { }

    @Roles(Role.Teacher, Role.Admin)
    @Post()
    async create(@Body() data: CreateAvailabilityDto){
        try {
            return await this.createAvailability.execute(data);
        } catch (e) {
            throw new HttpException('DEBUG_ERROR: ' + e.message, 500);
        }
    }

    @Roles(Role.Teacher, Role.Admin)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateAvailabilityDto){
        return await this.updateAvailability.execute(id, data.dayOfWeek, data.startTime, data.endTime, data.teacherId);
    }

    @Roles(Role.Teacher, Role.Admin)
    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.deleteAvailability.execute(id);
    }

    @Roles(Role.Teacher, Role.Admin)
    @Get(':id')
    async findById(@Param('id') id: string){
        return await this.findAvailabilityById.execute(id);
    }

    @Roles(Role.Teacher, Role.Admin)
    @Get()
    async findAll(){
        return await this.findAllAvailability.execute();
    }
}