// find product by id mocks
export const successResponseBodyFindProductById = {
  title: 'Futuro Burger - Fazenda Futuro - 230 g',
  quantity: '230 g',
  ingredients: {
    hasPalmOil: 'unknown',
    isVegan: false,
    isVegetarian: false,
    list: [
      'Água, preparado proteico (proteína texturizada de soja, proteína isolada de soja e proteína de ervilha), gordura de coco, óleo de canola, aroma natural, estabilizante metilcelulose, sal, beterraba em pó e corante carvão vegetal.',
    ],
  },
  nutrition: {
    score: 'D',
    values: [
      ['moderate', 'Gorduras/lípidos em quantidade moderada (11.9%)'],
      [
        'high',
        'Gorduras/lípidos/ácidos gordos saturados em quantidade elevada (8%)',
      ],
      ['low', 'Açúcares em quantidade baixa (0%)'],
      ['moderate', 'Sal em quantidade moderada (0.565%)'],
    ],
  },
  servingSize: '80g',
  data: {
    Energia: {
      per100g: '814 kj(194 kcal)',
      perServing: '651 kj(155 kcal)',
    },
    'Gorduras/lípidos': {
      per100g: '11,9 g',
      perServing: '9,5 g',
    },
    Carboidratos: {
      per100g: '7,88 g',
      perServing: '6,3 g',
    },
    'Fibra alimentar': {
      per100g: '?',
      perServing: '?',
    },
    Proteínas: {
      per100g: '13,8 g',
      perServing: '11 g',
    },
    Sal: {
      per100g: '0,565 g',
      perServing: '0,452 g',
    },
  },
  nova: {
    score: '4',
    title: 'Alimentos ultra-processados',
  },
};
