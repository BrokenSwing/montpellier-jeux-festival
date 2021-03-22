import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UUIDPipe } from '../utils';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindCompanyDto } from './dto/find-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiBearerAuth()
@ApiTags('Companies')
@UseGuards(JwtAuthGuard)
@Controller('api/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll(@Query() query: FindCompanyDto) {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', UUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.companyService.delete(id);
  }
}
