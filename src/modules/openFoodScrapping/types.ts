export interface DataProductsSearchByTerm {
  id: String,
  name: String,
  nutrition: {
    score: String,
    title: String,
  },
  nova: {
    score: String,
    title: String,
  },
}