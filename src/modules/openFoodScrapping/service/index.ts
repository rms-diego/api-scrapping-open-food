import { env } from '@/env';
import { Exception } from '@/utils/exception';
import { getPuppeteerClient } from '@/utils/puppeteer';
import { DataProductsSearchByTerm } from '../types';

export class OpenFoodService {
  constructor(private readonly openFoodUrl: string = env.OPEN_FOOD_URL) {}

  private scrappingSearchByProductId = () => {
    const productTitle = document.querySelector('.title-1')!.textContent;

    const productQuantity = document.querySelector(
      '#field_quantity_value'
    )!.textContent;

    const ingredientsAnalysis = document.querySelector(
      '#panel_ingredients_analysis_content'
    )!.textContent;

    const palmOilValidation =
      ingredientsAnalysis!.includes('Sem óleo de palma');

    const hasPalmOil = palmOilValidation ? false : 'unknown';

    const isVegan =
      ingredientsAnalysis!.includes('Não vegano') ||
      ingredientsAnalysis!.includes('Desconhece-se se é vegano')
        ? false
        : true;

    const isVegetarian =
      ingredientsAnalysis!.includes('Estado vegetariano desconhecido') ||
      ingredientsAnalysis!.includes('Não vegetariano')
        ? false
        : true;

    // get ingredient list and formatting
    const ingredientsList = document
      .querySelector('#panel_ingredients_content')!
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim());

    const productSummary = document.querySelector('#product_summary');

    // NUTRI-SCORE SECTION
    const nutriScoreTextContent = productSummary!.querySelector(
      `a[href="#panel_nutriscore"]`
    )?.textContent!;

    // validate if product have a nutriScore
    const isUnknownNutriScore =
      nutriScoreTextContent.includes('Nutri-Score desconhecido') ?? true;

    // formatting nutriScore
    const nutriScore = !isUnknownNutriScore
      ? nutriScoreTextContent
          .split('Qualidade nutricional')
          .at(0)!
          .substring(11)
          .trim()
      : 'Nutri-Score desconhecido';

    // NOVA SCORE SECTION
    const novaScoreTextContent = productSummary!.querySelector(
      `a[href="#panel_nova"]`
    )?.textContent!;

    // validate if product have a nova score
    const isUnknownNovaScore =
      novaScoreTextContent.includes('NOVA não calculada') ?? true;

    const novaScore = !isUnknownNovaScore
      ? novaScoreTextContent.split('Alimentos').at(0)!.substring(4).trim()
      : 'NOVA não calculada';

    const novaScoreTitle =
      novaScore === 'NOVA não calculada'
        ? 'Nível desconhecido de processamento do alimento'
        : novaScoreTextContent.split('NOVA ')!.at(1)!.substring(1);

    // PRODUCT PORTION SECTION
    const portionTextContent = document
      .querySelector('thead')!
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .find((string) => string.includes('Como vendidopor porção'));

    // validate if product have a portion on nutrition table
    const isUnknownPortion = portionTextContent
      ? portionTextContent.split('(').at(1)!.slice(0, -1)
      : 'unknown';

    // NUTRITION PERCENTAGE AND QUANTITY SECTION
    const nutritionValues = document
      .querySelector('#panel_nutrient_levels_content')
      ?.textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => string.includes('%'));

    const fatPercentage = nutritionValues?.find((nutrition) =>
      nutrition.includes('Gorduras/lípidos')
    );

    const saturatedFatPercentage = nutritionValues?.find((nutrition) =>
      nutrition.includes('Gorduras/lípidos/ácidos gordos saturados')
    );

    const sugarPercentage = nutritionValues?.find((nutrition) =>
      nutrition.includes('Açúcares')
    );

    const saltPercentage = nutritionValues?.find((nutrition) =>
      nutrition.includes('Sal em')
    );

    const values = [];
    if (fatPercentage) {
      const splitFatPercentage = fatPercentage.split(' (').at(0)!.split(' ');

      const quantity = splitFatPercentage
        .at(splitFatPercentage.length - 1)!
        .trim()!;

      values.push([quantity, fatPercentage]);
    }

    if (saturatedFatPercentage) {
      const splitSaturatedFatPercentage = saturatedFatPercentage
        .split(' (')
        .at(0)!
        .split(' ');

      const quantity = splitSaturatedFatPercentage
        .at(splitSaturatedFatPercentage.length - 1)!
        .trim();

      values.push([quantity, saturatedFatPercentage]);
    }

    if (sugarPercentage) {
      const splitSugarPercentage = sugarPercentage
        .split(' (')
        .at(0)!
        .split(' ');

      const quantity = splitSugarPercentage
        .at(splitSugarPercentage.length - 1)!
        .trim()!;

      values.push([quantity, sugarPercentage]);
    }

    if (saltPercentage) {
      const splitSaltPercentage = saltPercentage.split(' (').at(0)!.split(' ');

      const quantity = splitSaltPercentage
        .at(splitSaltPercentage.length - 1)!
        .trim()!;

      values.push([quantity, saltPercentage]);
    }

    // change "baixa" to "low", "moderada" to "moderate", "elevada" to "high"
    const quantityOption: { [key: string]: string } = {
      baixa: 'low',
      moderada: 'moderate',
      elevada: 'high',
    };

    const formatValues = values.map((valuesSubArray) => {
      const quantityIndex = 0;
      const percentageTextContentIndex = 1;

      const firstIndex = quantityOption[valuesSubArray[quantityIndex]];

      return [firstIndex, valuesSubArray[percentageTextContentIndex]];
    });

    //nutrition table body
    const tableBody = document.querySelector('tbody')!.querySelectorAll('tr');

    // energy
    const [energyPerHundredGrams, energyPerServing] = tableBody!
      .item(0)
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => !string.includes('%'))
      .filter((string) => !string.includes('Energia'));

    // fat
    const [fatPerHundredGrams, fatPerServing] = tableBody!
      .item(1)
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => !string.includes('%'))
      .filter((string) => !string.includes('Gorduras/lípidos'));

    // carbs
    const [carbsPerHundredGrams, carbsPerServing] = tableBody!
      .item(3)
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => !string.includes('%'))
      .filter((string) => !string.includes('Carboidratos'));

    // fiber
    const [fiberPerHundredGrams, fiberPerServing] = tableBody!
      .item(5)
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => !string.includes('%'))
      .filter((string) => !string.includes('Fibra alimentar'));

    // proteins
    const [proteinsPerHundredGrams, proteinsPerServing] = tableBody!
      .item(6)
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => !string.includes('%'))
      .filter((string) => !string.includes('Proteínas'));

    // salt
    const [saltPerHundredGrams, saltPerServing] = tableBody!
      .item(7)
      .textContent!.split('\n')
      .filter((string) => string.trim() !== '')
      .map((string) => string.trim())
      .filter((string) => !string.includes('%'))
      .filter((string) => !string.includes('Sal'));

    return {
      title: productTitle,
      quantity: productQuantity,
      ingredients: {
        hasPalmOil,
        isVegan,
        isVegetarian,
        list: ingredientsList,
      },

      nutrition: {
        score: nutriScore,
        values: formatValues,
      },

      servingSize: isUnknownPortion,

      data: {
        Energia: {
          per100g: energyPerHundredGrams,
          perServing: energyPerServing ? energyPerServing : 'unknown',
        },
        'Gorduras/lípidos': {
          per100g: fatPerHundredGrams,
          perServing: fatPerServing ? fatPerServing : 'unknown',
        },
        Carboidratos: {
          per100g: carbsPerHundredGrams,
          perServing: carbsPerServing ? carbsPerServing : 'unknown',
        },
        'Fibra alimentar': {
          per100g: fiberPerHundredGrams,
          perServing: fiberPerServing ? fiberPerServing : 'unknown',
        },
        Proteínas: {
          per100g: proteinsPerHundredGrams,
          perServing: proteinsPerServing ? proteinsPerServing : 'unknown',
        },
        Sal: {
          per100g: saltPerHundredGrams,
          perServing: saltPerServing ? saltPerServing : 'unknown',
        },
      },

      nova: {
        score: novaScore,
        title: novaScoreTitle,
      },
    };
  };

  public searchByProductId = async (productId: number) => {
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

    const scrapingData = await page.evaluate(this.scrappingSearchByProductId);
    await browser.close();

    return scrapingData;
  };

  private scrappingSearchByTerm = () => {
    const productsList = document.querySelectorAll('ul#products_match_all li');

    // array that will be populate after formatting products
    const data: Array<DataProductsSearchByTerm> = [];

    for (const product of productsList) {
      // cards images
      const images = product.getElementsByClassName('list_product_icons');

      // find product id in href anchor
      const link = product.querySelector('.list_product_a')!;
      const productId = link.getAttribute('href')!.split('/').at(4)!;

      const nutriScoreImage = images.item(0);
      const novaImage = images.item(1);

      // formatting Nutri-Score, first index is score and next index is the title
      const splitNutriScore = nutriScoreImage!
        .getAttribute('title')!
        .split(' - ');

      // formatting NOVA, first index is score and next index is the title
      const splitNova = novaImage!.getAttribute('title')!.split(' - ');

      // validate if is unknown nova score
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
          score: validateUnknownNova ? validateUnknownNova : '',
          title: splitNova.at(1) ? splitNova.at(1)! : '',
        },
      });
    }

    return data;
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

    const dataScraping = await page.evaluate(this.scrappingSearchByTerm);
    await browser.close();

    // removes elements that does't satisfy conditions passed by parameter
    const filterByTerms = dataScraping.filter(
      (data) => data.nova.score === nova && data.nutrition.score === nutrition
    );

    return filterByTerms;
  };
}
