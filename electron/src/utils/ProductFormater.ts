type Product = {
  product_id: number
  name: string
  price_unit: number
  category: {
    id: string
    name: string
  }
}

type FormatedProduct = {
  category: string
  products: Product[]
}

export const formaterToCategory = (products: Product[]): FormatedProduct[] => {
  const allCategories = products.map((product) => +product.category.id)
  const cleanedCategories = Array.from(new Set(allCategories))
  const formatedProducts = cleanedCategories.map((categoryId) => {
    const productsByCategory = products.filter(
      (product) => +product.category.id === categoryId
    )
    const category = productsByCategory[0].category.name
    return {
      category,
      products: productsByCategory,
    }
  })
  return formatedProducts
}
