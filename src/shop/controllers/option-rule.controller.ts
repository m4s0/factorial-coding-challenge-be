import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '@Auth/decorators/roles.decorator';
import { UserRole } from '@User/entities/user-role';
import { CreateOptionRuleDto } from '@Shop/dtos/create-option-rule.dto';
import { UpdateOptionRuleDto } from '@Shop/dtos/update-option-rule.dto';
import { transformOptionRule } from '@Shop/services/transfomers/option-rule.transformer';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { OptionRulesService } from '../services/option-rules.service';

@Controller('option-rules')
export class OptionRulesController {
  constructor(private readonly optionRulesService: OptionRulesService) {}

  @Get()
  async getAll(): Promise<OptionRuleOutput[]> {
    const optionsRules = await this.optionRulesService.getAll();

    return optionsRules.map((optionsRule) => transformOptionRule(optionsRule));
  }

  @Get(':ruleId')
  async get(
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
  ): Promise<OptionRuleOutput> {
    const optionsRule = await this.optionRulesService.getById(ruleId);

    return transformOptionRule(optionsRule);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateOptionRuleDto): Promise<OptionRuleOutput> {
    const optionRule = await this.optionRulesService.create(body);

    return transformOptionRule(optionRule);
  }

  @Patch(':ruleId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
    @Body() body: UpdateOptionRuleDto,
  ): Promise<OptionRuleOutput> {
    const optionRule = await this.optionRulesService.update(ruleId, body);

    return transformOptionRule(optionRule);
  }

  @Delete(':ruleId')
  @Roles(UserRole.ADMIN)
  async delete(@Param('ruleId', ParseUUIDPipe) ruleId: string): Promise<void> {
    return this.optionRulesService.remove(ruleId);
  }
}
