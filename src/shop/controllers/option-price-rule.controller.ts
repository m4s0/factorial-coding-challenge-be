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
import { OptionPriceRulesService } from '@Shop/services/option-price-rules.service';
import { transformOptionPriceRule } from '@Shop/services/transfomers/option-price-rule.transformer';
import { OptionPriceRuleOutput } from '@Shop/types/option-price-rule.output';
import { CreateOptionPriceRuleDto } from '@Shop/dtos/create-option-price-rule.dto';
import { UpdateOptionPriceRuleDto } from '@Shop/dtos/update-option-price-rule.dto';

@Controller('option-price-rules')
export class OptionPriceRulesController {
  constructor(
    private readonly optionPriceRulesService: OptionPriceRulesService,
  ) {}

  @Get()
  async getAll(): Promise<OptionPriceRuleOutput[]> {
    const optionsPriceRules = await this.optionPriceRulesService.getAll();

    return optionsPriceRules.map((optionsPriceRule) =>
      transformOptionPriceRule(optionsPriceRule),
    );
  }

  @Get(':priceRuleId')
  async get(
    @Param('priceRuleId', ParseUUIDPipe) priceRuleId: string,
  ): Promise<OptionPriceRuleOutput> {
    const optionsPriceRule =
      await this.optionPriceRulesService.getById(priceRuleId);

    return transformOptionPriceRule(optionsPriceRule);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateOptionPriceRuleDto,
  ): Promise<OptionPriceRuleOutput> {
    const optionsPriceRule = await this.optionPriceRulesService.create(body);

    return transformOptionPriceRule(optionsPriceRule);
  }

  @Patch(':priceRuleId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('priceRuleId', ParseUUIDPipe) priceRuleId: string,
    @Body() body: UpdateOptionPriceRuleDto,
  ): Promise<OptionPriceRuleOutput> {
    const optionsPriceRule = await this.optionPriceRulesService.update(
      priceRuleId,
      body,
    );

    return transformOptionPriceRule(optionsPriceRule);
  }

  @Delete(':priceRuleId')
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('priceRuleId', ParseUUIDPipe) priceRuleId: string,
  ): Promise<void> {
    return this.optionPriceRulesService.remove(priceRuleId);
  }
}
