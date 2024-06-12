import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { ConfirmSmsDTO, CreateClientDto } from './client.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth-guard';
import { ApiModelResponse } from 'src/dto';
import { Category } from './client.interface';
import { Client } from './client.schema';

//i this model in controller i use strategy to return prepered data from serrvice
// but I think beter use like in userController

@ApiTags('Client')
@Controller('client')
@ApiBearerAuth('JWT')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    description: `Create  Client. Permissions ["User | Admin"]\n
    Client category can by only [${Object.values(Category).join(' | ')}]`,
  })
  async handler(@Body() createClientDto: CreateClientDto) {
    return this.clientService.handler(createClientDto);
  }

  @Post('/sms')
  @UseGuards(AuthGuard)
  @ApiOperation({
    description: 'confirm sms code',
  })
  async confirmSMS(@Body() confirmSmsDTO: ConfirmSmsDTO) {
    return this.clientService.confirmSMS(confirmSmsDTO);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({
    description: 'Find client by id. Permissions ["User | Admin"]',
  })
  @ApiModelResponse(Client)
  findAll() {
    return this.clientService.findAll();
  }

  @Get('close/:deal')
  @ApiOperation({
    description: 'Find client by id. Permissions ["User | Admin"]',
  })
  @ApiModelResponse(Client)
  close(@Param('deal') deal: string) {
    return this.clientService.findAndClose(deal);
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    description: 'Find client by id. Permissions ["User | Admin"]',
  })
  @ApiModelResponse(Client)
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.clientService.findOne(id);
  }
}
