import { env } from '@/env';
import { Exception } from '@/utils/exception';
import { getPuppeteerClient } from '@/utils/puppeteer';
import { Page } from 'puppeteer';

export class OpenFoodService {
  constructor(private readonly openFoodUrl: string = env.OPEN_FOOD_URL) {}

  private calculateLevel = (content: string) => {
    if (content.includes('quantidade baixa')) {
      return 'low';
    }

    if (content.includes('quantidade moderada')) {
      return 'moderate';
    }

    if (content.includes('quantidade elevada')) {
      return 'high';
    }
  };

  private getGramsFromNutritionTable = (
    nutritionTable: string[],
    startCompareString: string,
    finalCompareString?: string
  ) => {
    if (!finalCompareString) {
      const startIndex = nutritionTable.indexOf('Sal');

      const saltArr = nutritionTable.splice(startIndex);
      const perHundredGrams = saltArr.at(1);
      const perServingSize = saltArr.at(2);

      return [perHundredGrams, perServingSize];
    }

    const startIndex = nutritionTable.indexOf(startCompareString);
    const finalIndex = nutritionTable.indexOf(finalCompareString);

    const arr = nutritionTable.slice(startIndex, finalIndex);
    const perHundredGrams = arr.at(1);
    const perServingSize = arr.at(2);

    return [perHundredGrams, perServingSize];
  };

  private serializeData = (nutritionTable: string[]) => {
    // get energy grams
    const [energyPerHundredGrams, energyPerServingSize] =
      this.getGramsFromNutritionTable(
        nutritionTable,
        'Energia',
        'Gorduras/lípidos'
      );

    // get fat grams
    const [fatHundredGrams, fatServingSize] = this.getGramsFromNutritionTable(
      nutritionTable,
      'Gorduras/lípidos',
      'Gorduras/lípidos/ácidos gordos saturados'
    );

    // get carbs grams
    const [carbsHundredGrams, carbsServingSize] =
      this.getGramsFromNutritionTable(
        nutritionTable,
        'Carboidratos',
        'Açúcares'
      );

    // get fiber grams
    const [fiberHundredGrams, fiberServingSize] =
      this.getGramsFromNutritionTable(
        nutritionTable,
        'Fibra alimentar',
        'Proteínas'
      );

    // get proteins grams
    const [proteinsHundredGrams, proteinsServingSize] =
      this.getGramsFromNutritionTable(nutritionTable, 'Proteínas', 'Sal');

    // get salt grams
    const [saltHundredGrams, saltServingSize] = this.getGramsFromNutritionTable(
      nutritionTable,
      'Sal'
    );

    return {
      Energia: {
        per100g: energyPerHundredGrams,
        perServing: energyPerServingSize?.includes('%')
          ? '?'
          : energyPerServingSize,
      },

      'Gorduras/lípidos': {
        per100g: fatHundredGrams,
        perServing: fatHundredGrams?.includes('%') ? '?' : fatServingSize,
      },

      Carboidratos: {
        per100g: carbsHundredGrams,
        perServing: carbsServingSize?.includes('%') ? '?' : carbsServingSize,
      },

      'Fibra alimentar': {
        per100g: fiberHundredGrams,
        perServing: fiberServingSize?.includes('%') ? '?' : fiberServingSize,
      },

      Proteínas: {
        per100g: proteinsHundredGrams,
        perServing: proteinsServingSize?.includes('%')
          ? '?'
          : proteinsServingSize,
      },

      Sal: {
        per100g: saltHundredGrams,
        perServing: saltServingSize?.includes('%') ? '?' : saltServingSize,
      },
    };
  };

  private getDetailDescriptionProduct = async (page: Page) => {
    return page.evaluate(() => {
      const productTitle = document.querySelector(
        '.title-1[property="food:name"]'
      )!.textContent;

      const productQuantity = document.querySelector(
        '#field_quantity_value'
      )!.textContent;

      const isVeganProduct = document.querySelector(
        '#panel_ingredients_analysis_en-vegan_content'
      );

      const isVegetarianProduct = document.querySelector(
        '#panel_ingredients_analysis_en-vegetarian'
      );

      const hasPalmOil = document.querySelector(
        '#panel_ingredients_analysis_en-palm-oil-free'
      );

      const ingredientsList = document.querySelector(
        '#panel_ingredients_content'
      )?.textContent;

      const serializeIngredientsList = ingredientsList!
        .split('\n') // split by break lines
        .filter((element) => element.trim() !== '') // validate if current index is empty space and remove from array
        .map((ingredient) => ingredient.trim()) // removes empty spaces before and after in the string
        .filter((ingredient) => !ingredient.includes(':')); // removes strings if includes ':'

      const ingredientsListValidation = serializeIngredientsList.includes(
        'Pode adicionar a lista de ingredientes?'
      )
        ? []
        : serializeIngredientsList; // validation for products that do not have a known list of ingredients

      const nutritionFields = {
        novaScore: '',
        novaDescription: '',
        nutriScore: '',
      };

      // get nutrition fields (NOVA and Nutri-Score)
      for (const nutrition of document.querySelector('#attributes_grid')!
        .childNodes) {
        // console.log('NUTRITION: ', nutrition);
        const textContent = nutrition.textContent!;

        //  validate  if product doesn't have nova
        if (textContent.includes('NOVA não calculada')) {
          nutritionFields.novaScore = 'unknown';
          nutritionFields.novaDescription =
            'Nível desconhecido de processamento do alimento';
        }

        ///  validate  if product doesn't have nutri score
        else if (textContent.includes('Nutri-Score desconhecido')) {
          nutritionFields.nutriScore = 'unknown';
        }

        // get nova when product have nova score
        else if (textContent.includes('NOVA')) {
          nutritionFields.novaScore = textContent
            .split('Alimentos')
            .at(0)!
            .substring(5)
            .trim();

          nutritionFields.novaDescription = textContent
            .split('NOVA ')
            .at(1)!
            .substring(1)
            .trim();
        }

        // get nutri score when product have nutri score
        else if (textContent.includes('Nutri-Score')) {
          nutritionFields.nutriScore = textContent
            .split('Qualidade')
            .at(0)!
            .substring(11)!
            .trim();
        }
      }

      let levelFat = '';
      if (document.querySelector('#panel_nutrient_level_fat')) {
        levelFat = document
          .querySelector('#panel_nutrient_level_fat')!
          .textContent!.split('\n')
          .filter((element) => element.trim() !== '')
          .map((ingredient) => ingredient.trim())
          .at(0)!;
      }

      let levelSuturedFat = '';
      if (document.querySelector('#panel_nutrient_level_saturated-fat')) {
        levelSuturedFat = document
          .querySelector('#panel_nutrient_level_saturated-fat')
          ?.textContent?.split('\n')
          .filter((element) => element.trim() !== '')
          .map((ingredient) => ingredient.trim())
          .at(0)!;
      }

      let levelSugar = '';
      if (document.querySelector('#panel_nutrient_level_sugars')) {
        levelSugar = document
          .querySelector('#panel_nutrient_level_sugars')
          ?.textContent?.split('\n')
          .filter((element) => element.trim() !== '')
          .map((ingredient) => ingredient.trim())
          .at(0)!;
      }

      let levelSalt = '';
      if (document.querySelector('#panel_nutrient_level_salt')) {
        levelSalt = document
          .querySelector('#panel_nutrient_level_salt')
          ?.textContent?.split('\n')
          .filter((element) => element.trim() !== '')
          .map((ingredient) => ingredient.trim())
          .at(0)!;
      }

      const nutritionTable = document
        .querySelector('table')!
        .textContent!.split('\n')
        .filter((element) => element.trim() !== '')
        .map((ingredient) => ingredient.trim());

      const servingSize = nutritionTable
        .find((element) => element.includes('Como vendidopor porção'))
        ?.split('Como vendidopor porção ')
        .at(1);

      return {
        title: productTitle,
        quantity: productQuantity,
        ingredients: {
          hasPalmOil: hasPalmOil ? 'has' : 'unknown',
          isVegan: isVeganProduct ? true : false,
          isVegetarian: isVegetarianProduct ? true : false,
          list: ingredientsListValidation,
        },

        nutrition: {
          score: nutritionFields.nutriScore,
          values: [[levelFat], [levelSuturedFat], [levelSugar], [levelSalt]],
        },

        servingSize: servingSize ? servingSize : '',

        data: {},
        nutritionTable,

        nova: {
          score: nutritionFields.novaScore,
          title: nutritionFields.novaDescription,
        },
      };
    });
  };

  public searchByProductId = async (productId: string) => {
    const { browser, page } = await getPuppeteerClient();

    const productUrl = `${this.openFoodUrl}/produto/${productId}`;

    // navigate to open food product
    await page.goto(productUrl);

    const isErrorPage = await page.evaluate(
      () => document.querySelector('.if-empty-dnone')?.textContent
    );

    if (isErrorPage) {
      throw new Exception('product not found', 404);
    }

    // wait page is load
    await page.waitForSelector('.title-1[property="food:name"]');
    let productContent = await this.getDetailDescriptionProduct(page);

    await browser.close();

    const data = this.serializeData(productContent.nutritionTable);

    productContent.data = data;

    // add high, low, moderate  according to nutrition level
    for (const values of productContent.nutrition.values) {
      const level = this.calculateLevel(values.at(0)!);

      if (level) values.unshift(level);
    }

    // @ts-ignore
    delete productContent.nutritionTable;

    return productContent;
  };

  public searchByTerm = async ({
    nova = '1',
    nutrition = 'A',
    pageOpenFood = '1',
  }: {
    nova?: string;
    nutrition?: string;
    pageOpenFood?: string;
  }) => {
    const { browser, page } = await getPuppeteerClient();

    const pageUrl = `${this.openFoodUrl}/${pageOpenFood}`;
    await page.goto(pageUrl);

    await page.waitForSelector('#products_match_all');

    const dataScraping = await page.evaluate(() => {
      const productsList = document.querySelectorAll(
        'ul#products_match_all li'
      );

      const data = [];

      for (const product of productsList) {
        const images = product.getElementsByClassName('list_product_icons');
        const link = product.querySelector('.list_product_a')!;
        const productId = link.getAttribute('href')!.split('/').at(4)!;

        const nutriScoreImage = images.item(0);
        const novaImage = images.item(1);

        const splitNutriScore = nutriScoreImage!
          .getAttribute('title')!
          .split(' - ');

        const splitNova = novaImage!.getAttribute('title')!.split(' - ');

        const validateUnknownNova = splitNova.at(0)!.includes('não calculada')
          ? splitNova.at(0)
          : splitNova.at(0)!.substring(5);

        data.push({
          id: productId,
          name: product.textContent!,
          nutrition: {
            score: splitNutriScore.at(0)!.substring(11).trim(),
            title: splitNutriScore.at(1)!.trim(),
          },
          nova: {
            score: validateUnknownNova,
            title: splitNova.at(1),
          },
        });
      }

      return data;
    });
    await browser.close();

    const filterByTerms = dataScraping.filter(
      (data) => data.nova.score === nova && data.nutrition.score === nutrition
    );

    return filterByTerms;
  };
}
