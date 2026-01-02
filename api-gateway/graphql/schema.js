import { gql } from "apollo-server-express";

const typeDefs = gql`
  # =======================
  # USER
  # =======================
  type User {
    uuid: String
    userId: Int
    name: String
    email: String
    role: String
  }

  # =======================
  # RESTAURANT
  # =======================
  type Review {
    user: String
    rating: Int!
    comment: String
  }

  type Menu {
    name: String
    price: Int
  }

  type Restaurant {
    id: ID!
    name: String!
    address: String
    reviews: [Review]
    menus: [Menu]
    rating: Float
    createdAt: String
    updatedAt: String
  }

  input ReviewInput {
    user: String
    rating: Int!
    comment: String
  }

  input MenuInput {
    name: String!
    price: Int!
  }

  input RestaurantInput {
    name: String!
    address: String
  }

  # =======================
  # ORDER
  # =======================
  type Order {
    _id: ID!
    customerName: String
    restaurantId: String
    items: [OrderItem]
    totalPrice: Float
    status: String
    createdAt: String
    updatedAt: String
  }

  type OrderItem {
    name: String
    price: Float
    quantity: Int
  }

  input OrderItemInput {
    name: String!
    price: Float!
    quantity: Int!
  }

  input CreateOrderInput {
    customerName: String!
    restaurantId: String!
    items: [OrderItemInput!]!
    totalPrice: Float!
  }

  input UpdateOrderInput {
    customerName: String
    items: [OrderItemInput]
    totalPrice: Float
    status: String
  }

  type DeleteResponse {
    message: String!
  }

  # =======================
  # ROOT QUERY
  # =======================
  type Query {
    users: [User]

    restaurants: [Restaurant]
    restaurant(id: ID!): Restaurant

    orders: [Order]
    order(id: ID!): Order
  }

  # =======================
  # ROOT MUTATION
  # =======================
  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
    ): User

    createRestaurant(data: RestaurantInput!): Restaurant
    addReview(restaurantId: ID!, review: ReviewInput!): Restaurant
    addMenu(restaurantId: ID!, menu: MenuInput!): Restaurant

    createOrder(data: CreateOrderInput!): Order
    updateOrder(id: ID!, data: UpdateOrderInput!): Order
    deleteOrder(id: ID!): DeleteResponse
  }
`;

export default typeDefs;