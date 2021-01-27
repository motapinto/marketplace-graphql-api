GraphQL schema
=============
You can check our GraphQL API schema documentation [here](https://motapinto.github.io/marketplace-graphql-api/api/doc/)!

Usage examples
==============

  * [Products](#Products)
    * [Get Product by key](#Get-Product-by-key)
    * [Get Products](#Get-Products)
    * [Get Products by search](#Get-Products-by-search)
    * [Add Product](#Add-Product)
    * [Update Product](#Update-Product)
  * [User](#User)
    * [Get User by key](#Get-User-by-key)
    * [Get User by name](#Get-User-by-name)
  * [Producer](#Producer)
    * [Get Producer by key](#Get-Producer-by-key)
  * [Reviews](#Reviews)
    * [Get Review by key](#Get-Review-by-key)
    * [Get Reviews](#Get-Reviews)
    * [Add Review](#Add-Review)
    * [Update Review](#Update-Review)
    * [Remove Review](#Remove-Review)
  * [Categories](#Categories)
    * [Get Category by key](#Get-Category-by-key)
    * [Get Categories](#Get-Categories)
    * [Add Categories](#Add-Category)
    * [Update Categories](#Update-Category)
    * [Remove Categories](#Remove-Category)
  * [Sorts](#Sorts)
    * [Get Sorts](#Get-Sorts)


### Products
[Back](#Usage-examples)
#### Get Product by key
```gql
  query {
    product(_key: "11512") {
      name,
    }
  }
``` 

#### Get Products 
```gql
  query {
    products {
      name,
    }
  }
```

#### Get Products by search (all params are optional)
```gql
  query {
    products(query: "chicken", categories: ["honey"], priceMin: 0, priceMax: 10, sort: SORT.PRICE_LOW_HIGH) {
      _key
      name
      description
      price
      units
    	rating
    	publishedAt
    	reviews {
				_key
        rating
			}
      images {
        dataLocation
      }
      categories {
        _key
        name
      }
    	location {
				latitude,
        longitude
			}
    }
  }
```

#### Add Product
```gql
  mutation {
    addProduct(
      product: {
        _key: "115"
        name: "New name"
        description: "New description"
        price: 12.99
        units: 5
        images: [{ dataLocation: "assets/newIMg.jpeg" }]
        categories: [
          { _key: "1", name: "honey" }
          { _key: "2", name: "not honey" }
        ]
      }
    ) {
      _key
      name
      description
      price
      units
    	rating
    	publishedAt
    	reviews {
				_key
        rating
			}
      images {
        dataLocation
      }
      categories {
        _key
        name
      }
    	location {
				latitude,
        longitude
			}
    }
  }
```

#### Update Product
```gql
  mutation {
    updateProduct(
      product: {
        _key: "111"
        name: "New name"
        description: "New description"
        price: 12.99
        units: 5
        images: [{ dataLocation: "assets/newIMg.jpeg" }]
        categories: [
          { _key: "1", name: "honey" }
          { _key: "2", name: "not honey" }
        ]
      }
    ) {
      _key
      name
      description
      price
      units
    	rating
    	publishedAt
    	reviews {
				_key
        rating
			}
      images {
        dataLocation
      }
      categories {
        _key
        name
      }
    	location {
				latitude,
        longitude
			}
    }
  }
```

#### Remove Product
```gql
  mutation {
    removeProduct(_key: "111") {
        _key
        name
        description
        price
        units
        rating
        publishedAt
        reviews {
          _key
          rating
        }
        images {
          dataLocation
        }
        categories {
          _key
          name
        }
        location {
          latitude,
          longitude
        }
      }
  }
```

### User
[Back](#Usage-examples)
#### Get User by key
```gql
  query {
    user(key: "11512") {
      name
    }
  }
``` 
#### Get User by name
```gql
  query {
    key(key: "111") {
      name
    }
  }
``` 

### Producer
#### Get Producer by key
```gql
  query {
    producer(key: "11512") {
      name
    }
  }
``` 

### Review 
[Back](#Usage-examples)
#### Get Review by key
```gql
  query {
    review(_key: "1") {
      _key
      buyerKey
      productKey
      title
      comment
      rating
      date
    }
  }
``` 

#### Get Reviews
```gql
  query {
    reviews {
      _key
      buyerKey
      productKey
      title
      comment
      rating
      date
    }
  }
``` 

#### Add Review
```gql
  mutation {
    addReview(
      review: {
        _key: "56"
        buyerKey: "111"
        productKey: "12"
        title: "Great product!"
        comment: "Greatest product"
        rating: 4
        date: "2019-04-12, 07:22:13"
      }
    ) {
      _key
      buyerKey
      productKey
      title
      comment
      rating
      date
    }
  }
``` 

#### Update Review
```gql
  mutation {
    updateReview(
      review: {
        _key: "56"
        title: "Great product!"
        comment: "saddas"
        rating: 5
      }
    ) {
      _key
      buyerKey
      productKey
      title
      comment
      rating
      date
    }
  }
``` 

#### Remove Review
```gql
  mutation {
    removeReview(_key: "111") {
      _key
      buyerKey
      productKey
      title
      comment
      rating
      date
    }
  }
``` 

### Categories
[Back](#Usage-examples)
#### Get Categories
```gql
  query {
    categories {
      _key,
      name,
    }
  }
```

#### Get Category by key
```gql
  query {
    category(_key: "1") {
      _key
      name
    }
  }
```

#### Add Categories
```gql
  mutation {
    addCategory(category:{name:"Meat"}) {
      _key
      name
    }
  }
```

#### Update Categories
```gql
  mutation {
    updateCategory(category:{_key: "1", name: "Honey"}) {
      _key
      name
    }
  }
```

#### Remove Categories
```gql
  mutation {
    removeCategory(_key: "1") {
      _key
      name
    }
  }
```

### Sorts
[Back](#Usage-examples)
#### Get Sorts
```gql
  query {
    sorts {
      name
    }
  }
```